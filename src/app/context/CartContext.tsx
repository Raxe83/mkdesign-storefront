'use client'

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Cart } from "../types/shopify";
import {
  createCart,
  addToCart,
  updateCartItem,
  updateItemQuantity,
  removeCartItem,
  getCart,
} from "../services/shopify";
import i18n from "../i18n";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (
    variantId: string,
    quantity: number,
    customAttributes?: {
      key: string;
      value: string;
    }[]
  ) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  updateItemQuantityFunction: (
    lineId: string,
    quantity: number
  ) => Promise<void>; // Hier hinzufügen
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
  const shopifyLocale = i18n.language

  const [showCartPopup, setShowCartPopup] = useState<boolean>(false);

  // Calculate total items in cart
  const itemCount =
    cart?.lines.edges.reduce((total, { node }) => total + node.quantity, 0) ||
    0;

  useEffect(() => {
    if (itemCount > 0) {
      setShowCartPopup(true);

      const timer = setTimeout(() => {
        setShowCartPopup(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [itemCount]);

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

        // Create new cart if none exists
        const newCart = await createCart();
        localStorage.setItem("shopifyCartId", newCart.id);
        setCart(newCart);
      } catch (error) {
        console.error("Failed to initialize cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initCart();
  }, []);

  const addItem = async (
    variantId: string,
    quantity: number,
    customAttributes?: { key: string; value: string }[]
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

      await addToCart(activeCart.id, variantId, quantity, customAttributes);

      // WICHTIG: Cart noch einmal abrufen
      const refreshedCart = await getCart(activeCart.id, shopifyLocale);
      setCart(refreshedCart);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateItem = async (
    lineId: string,
    quantity: number
  ): Promise<void> => {
    try {
      setIsLoading(true);
      if (!cart) return;

      const updatedCart = await updateCartItem(cart.id, lineId, quantity, shopifyLocale);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity (separate function)
  const updateItemQuantityFunction = async (
    lineId: string,
    quantity: number
  ): Promise<void> => {
    try {
      setIsLoading(true);
      if (!cart) return;

      // Führe die API-Anfrage aus
      const updatedCart = await updateItemQuantity(cart.id, lineId, quantity);

      // Wenn das Update erfolgreich ist, aktualisiere die Menge lokal
      setCart((prevCart) => {
        if (!prevCart) return prevCart;

        const updatedLines = prevCart.lines.edges.map((line) =>
          line.node.id === lineId
            ? { ...line, node: { ...line.node, quantity } } // Update die Menge direkt
            : line
        );

        return { ...prevCart, lines: { edges: updatedLines } };
      });
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (lineId: string): Promise<void> => {
    try {
      setIsLoading(true);
      if (!cart) return;

      const updatedCart = await removeCartItem(cart.id, lineId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        updateItem,
        updateItemQuantityFunction, // Update the provider to include the new function
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
