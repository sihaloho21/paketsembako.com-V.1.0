import { useState, useEffect, useCallback } from "react";
import { fetchCart, saveCartToBackend } from "@/lib/gas-api";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  variantId?: number | null;
  variantLabel?: string | null;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const CART_STORAGE_KEY = "hypermart_cart";
const DEFAULT_USER_ID = "guest_user"; // For now, use a default ID. Replace with real user ID later.

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 });
  const [isSyncing, setIsSyncing] = useState(false);

  // Load initial cart
  useEffect(() => {
    const loadCart = async () => {
      // 1. Load from local storage first for speed
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart from storage", e);
        }
      }

      // 2. Sync with backend
      try {
        const backendCart = await fetchCart(DEFAULT_USER_ID);
        if (backendCart && backendCart.items) {
          saveCartLocally(backendCart);
        }
      } catch (e) {
        console.warn("Failed to sync cart from backend", e);
      }
    };

    loadCart();
  }, []);

  const saveCartLocally = (newCart: Cart) => {
    setCart(newCart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
  };

  const syncWithBackend = useCallback(async (newCart: Cart) => {
    setIsSyncing(true);
    try {
      await saveCartToBackend(DEFAULT_USER_ID, newCart);
    } catch (e) {
      console.error("Failed to sync cart to backend", e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, totalPrice };
  };

  const updateCart = (newItems: CartItem[]) => {
    const { totalItems, totalPrice } = calculateTotals(newItems);
    const newCart = { items: newItems, totalItems, totalPrice };
    saveCartLocally(newCart);
    syncWithBackend(newCart);
  };

  const addToCart = (product: any, quantity: number, variantId?: number | null) => {
    const newItems = [...cart.items];
    const variant = variantId ? product.variants?.find((v: any) => v.id === variantId) : null;
    const price = variant ? variant.price : product.price;
    const variantLabel = variant ? variant.label : null;

    const existingItemIndex = newItems.findIndex(
      (item) => item.productId === product.id && item.variantId === variantId
    );

    if (existingItemIndex > -1) {
      newItems[existingItemIndex].quantity += quantity;
    } else {
      newItems.push({ 
        productId: product.id, 
        name: product.name,
        price,
        imageUrl: product.imageUrl,
        variantId, 
        variantLabel,
        quantity 
      });
    }

    updateCart(newItems);
  };

  const removeFromCart = (productId: number, variantId?: number | null) => {
    const newItems = cart.items.filter(
      (item) => !(item.productId === productId && item.variantId === variantId)
    );
    updateCart(newItems);
  };

  const updateQuantity = (productId: number, quantity: number, variantId?: number | null) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    const newItems = cart.items.map((item) => {
      if (item.productId === productId && item.variantId === variantId) {
        return { ...item, quantity };
      }
      return item;
    });

    updateCart(newItems);
  };

  const clearCart = () => {
    updateCart([]);
  };

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, isSyncing };
}
