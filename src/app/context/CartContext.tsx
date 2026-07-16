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
  removeCartItems,
  getCart,
  updateCartBuyerIdentity,
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

  // Initialize cart on mount, then attach buyer identity if logged in
  useEffect(() => {
    const initCart = async (): Promise<void> => {
      try {
        const cartId = localStorage.getItem("shopifyCartId");
        let activeCartId: string;

        if (cartId) {
          const existingCart = await getCart(cartId, shopifyLocale);
          if (existingCart) {
            setCart(existingCart);
            activeCartId = existingCart.id;
          } else {
            const newCart = await createCart();
            localStorage.setItem("shopifyCartId", newCart.id);
            setCart(newCart);
            activeCartId = newCart.id;
          }
        } else {
          const newCart = await createCart();
          localStorage.setItem("shopifyCartId", newCart.id);
          setCart(newCart);
          activeCartId = newCart.id;
        }

        // Attach customer access token so Shopify pre-fills checkout
        try {
          const res = await fetch("/api/session");
          const { customerAccessToken } = await res.json() as { customerAccessToken: string | null };
          if (customerAccessToken) {
            await updateCartBuyerIdentity(activeCartId, customerAccessToken);
          }
        } catch {
          // non-blocking — checkout still works without pre-fill
        }
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
      const updatedEdges = prev.lines.edges.map((edge) =>
        edge.node.id === lineId ? { node: { ...edge.node, quantity } } : edge
      );
      const newSubtotal = updatedEdges.reduce((sum, { node }) => {
        const price = parseFloat(node.merchandise?.price?.amount ?? "0");
        return sum + price * node.quantity;
      }, 0);
      const currencyCode = prev.estimatedCost?.subtotalAmount?.currencyCode ?? "EUR";
      return {
        ...prev,
        lines: { ...prev.lines, edges: updatedEdges },
        estimatedCost: {
          ...prev.estimatedCost,
          subtotalAmount: { amount: newSubtotal.toFixed(2), currencyCode },
          totalAmount:    { amount: newSubtotal.toFixed(2), currencyCode },
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

    const targetEdge = cart.lines.edges.find((e) => e.node.id === lineId);
    if (!targetEdge) return;

    // Find linked Zusatzprodukte that point to this item's line group.
    // STRIKT nur über `_lineGroup` (pro Kauf eindeutig) — bewusst KEIN
    // Fallback auf die Varianten-ID mehr: das führte dazu, dass eine neue,
    // nicht-verlinkte Zeile derselben Variante fälschlich mit einer älteren,
    // noch nach dem alten Muster verlinkten Zusatzprodukt-Zeile "verklebt"
    // wurde. Ohne `_lineGroup` hat eine Zeile schlicht keine verlinkten
    // Kinder — eindeutig, auch wenn ältere Warenkorb-Zeilen dadurch beim
    // Entfernen manuell mit-entfernt werden müssen.
    const targetLineGroup = targetEdge.node.attributes?.find((a) => a.key === "_lineGroup")?.value;
    const linkedLineIds = targetLineGroup
      ? cart.lines.edges
          .filter(({ node }) =>
            node.id !== lineId &&
            node.attributes?.some((a) => a.key === "_linkedTo" && a.value === targetLineGroup),
          )
          .map(({ node }) => node.id)
      : [];

    const allLineIds = [lineId, ...linkedLineIds];

    // Cancel any pending debounced updates for all affected lines
    for (const id of allLineIds) {
      const pending = pendingUpdates.current.get(id);
      if (pending) {
        clearTimeout(pending.timeoutId);
        pendingUpdates.current.delete(id);
      }
    }

    // Optimistic update — remove all at once
    const idsToRemove = new Set(allLineIds);
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lines: {
          ...prev.lines,
          edges: prev.lines.edges.filter((edge) => !idsToRemove.has(edge.node.id)),
        },
      };
    });

    try {
      const updatedCart = await removeCartItems(cartId, allLineIds);
      setCart(updatedCart);
    } catch (error) {
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
