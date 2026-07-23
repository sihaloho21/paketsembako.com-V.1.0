import { useState, useEffect } from "react";

export interface CartItem {
  productId: number;
  variantId?: number | null;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const CART_STORAGE_KEY = "hypermart_cart";

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 });

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from storage", e);
      }
    }
  }, []);

  const saveCart = (newCart: Cart) => {
    setCart(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  };

  const addToCart = (productId: number, quantity: number, variantId?: number | null) => {
    const newItems = [...cart.items];
    const existingItemIndex = newItems.findIndex(
      (item) => item.productId === productId && item.variantId === variantId
    );

    if (existingItemIndex > -1) {
      newItems[existingItemIndex].quantity += quantity;
    } else {
      newItems.push({ productId, quantity, variantId });
    }

    const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
    // Note: totalPrice calculation would require product data, 
    // for now we'll just track totalItems or implement a simple version.
    const newCart = { ...cart, items: newItems, totalItems };
    saveCart(newCart);
  };

  return { cart, addToCart };
}
