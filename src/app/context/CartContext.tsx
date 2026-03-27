'use client'

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Cart } from "../types/shopify";
import {
  createCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart,
} from "../services/shopify";

interface PendingUpdate {
  quantity: number;
  timeoutId: ReturnType<typeof setTimeout>;
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (
    variantId: string,
    quantity: number,
    customAttributes?: { key: string; value: string }[],
    additionalLines?: Array<{ variantId: string; quantity: number; customAttributes?: { key: string; value: string }[] }>,
  ) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  updateItemQuantityFunction: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  itemCount: number;
  showCartPopup: boolean;
  setShowCartPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const shopifyLocale = "de";

  const [showCartPopup, setShowCartPopup] = useState<boolean>(false);
  const popupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce map: lineId → pending API call timeout
  const pendingUpdates = useRef<Map<string, PendingUpdate>>(new Map());

  const itemCount =
    cart?.lines.edges.reduce((total, { node }) => total + node.quantity, 0) || 0;

  // Initialize cart on mount
  useEffect(() => {
    const initCart = async (): Promise<void> => {
      try {
        const cartId = localStorage.getItem("shopifyCartId");

        if (cartId) {
          const existingCart = await getCart(cartId, shopifyLocale);
          if (existingCart) {
            setCart(existingCart);
            setIsLoading(false);
            return;
          }
        }

        const newCart = await createCart();
        localStorage.setItem("shopifyCartId", newCart.id);
        setCart(newCart);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    initCart();
  }, []);

  const triggerPopup = (): void => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    setShowCartPopup(true);
    popupTimerRef.current = setTimeout(() => setShowCartPopup(false), 10000);
  };

  const addItem = async (
    variantId: string,
    quantity: number,
    customAttributes?: { key: string; value: string }[],
    additionalLines?: Array<{ variantId: string; quantity: number; customAttributes?: { key: string; value: string }[] }>,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      let activeCart = cart;

      if (!activeCart) {
        const newCart = await createCart();
        localStorage.setItem("shopifyCartId", newCart.id);
        setCart(newCart);
        activeCart = newCart;
      }

      await addToCart(activeCart.id, variantId, quantity, customAttributes, undefined, additionalLines);

      const refreshedCart = await getCart(activeCart.id, shopifyLocale);
      setCart(refreshedCart);

      // Only show popup when explicitly adding a new item
      triggerPopup();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Schedules a debounced API update for a line item.
   * Rapid clicks cancel the previous timeout — only the last click fires an API call.
   */
  const scheduleUpdate = (cartId: string, lineId: string, quantity: number): void => {
    const existing = pendingUpdates.current.get(lineId);
    if (existing) clearTimeout(existing.timeoutId);

    const timeoutId = setTimeout(async () => {
      pendingUpdates.current.delete(lineId);
      try {
        const updatedCart = await updateCartItem(cartId, lineId, quantity, shopifyLocale);
        setCart(updatedCart);
      } catch (error) {
      }
    }, 500);

    pendingUpdates.current.set(lineId, { quantity, timeoutId });
  };

  const updateItem = async (lineId: string, quantity: number): Promise<void> => {
    if (!cart) return;
    const cartId = cart.id;

    // Optimistic update — instant UI, no loading state
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lines: {
          ...prev.lines,
          edges: prev.lines.edges.map((edge) =>
            edge.node.id === lineId ? { node: { ...edge.node, quantity } } : edge
          ),
        },
      };
    });

    scheduleUpdate(cartId, lineId, quantity);
  };

  const updateItemQuantityFunction = async (lineId: string, quantity: number): Promise<void> => {
    return updateItem(lineId, quantity);
  };

  const removeItem = async (lineId: string): Promise<void> => {
    if (!cart) return;
    const cartId = cart.id;

    // Cancel any pending debounced update for this line
    const pending = pendingUpdates.current.get(lineId);
    if (pending) {
      clearTimeout(pending.timeoutId);
      pendingUpdates.current.delete(lineId);
    }

    // Optimistic update — remove instantly
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lines: {
          ...prev.lines,
          edges: prev.lines.edges.filter((edge) => edge.node.id !== lineId),
        },
      };
    });

    try {
      const updatedCart = await removeCartItem(cartId, lineId);
      setCart(updatedCart);
    } catch (error) {
      // Re-fetch to recover correct state
      try {
        const recovered = await getCart(cartId, shopifyLocale);
        if (recovered) setCart(recovered);
      } catch {
        // ignore secondary error
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        updateItem,
        updateItemQuantityFunction,
        removeItem,
        itemCount,
        showCartPopup,
        setShowCartPopup,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
