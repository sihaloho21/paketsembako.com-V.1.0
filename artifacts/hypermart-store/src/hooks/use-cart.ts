import { useState, useEffect } from "react";

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

  const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { totalItems, totalPrice };
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

    const { totalItems, totalPrice } = calculateTotals(newItems);
    saveCart({ items: newItems, totalItems, totalPrice });
  };

  const removeFromCart = (productId: number, variantId?: number | null) => {
    const newItems = cart.items.filter(
      (item) => !(item.productId === productId && item.variantId === variantId)
    );
    const { totalItems, totalPrice } = calculateTotals(newItems);
    saveCart({ items: newItems, totalItems, totalPrice });
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

    const { totalItems, totalPrice } = calculateTotals(newItems);
    saveCart({ items: newItems, totalItems, totalPrice });
  };

  const clearCart = () => {
    saveCart({ items: [], totalItems: 0, totalPrice: 0 });
  };

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart };
}
