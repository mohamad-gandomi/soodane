'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { Product } from '@/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  oldTotal: number;
  discountTotal: number;
  totalReward: number;
  getItemQuantity: (productId: string) => number;
  setQuantity: (product: Product | string, quantity: number) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = storage.getCart<CartItem[]>();
    if (saved && Array.isArray(saved)) {
      setItems(saved);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      storage.setCart(items);
    }
  }, [items, isLoaded]);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0
  );

  const oldTotal = items.reduce(
    (sum, item) =>
      sum + (item.product.oldPrice ?? item.product.price ?? 0) * item.quantity,
    0
  );

  const discountTotal = Math.max(0, oldTotal - subtotal);

  const totalReward = items.reduce(
    (sum, item) => sum + (item.product.reward ?? 0) * item.quantity,
    0
  );

  const getItemQuantity = (productId: string): number => {
    const found = items.find((i) => i.product.id === productId);
    return found ? found.quantity : 0;
  };

  const setQuantity = (productOrId: Product | string, quantity: number) => {
    setItems((prev) => {
      const id = typeof productOrId === 'string' ? productOrId : productOrId.id;
      if (quantity <= 0) {
        return prev.filter((i) => i.product.id !== id);
      }
      const existing = prev.find((i) => i.product.id === id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === id ? { ...i, quantity: Math.min(10, quantity) } : i
        );
      }
      if (typeof productOrId === 'object') {
        return [...prev, { product: productOrId, quantity: Math.min(10, quantity) }];
      }
      return prev;
    });
  };

  const addToCart = (product: Product, quantity = 1) => {
    setQuantity(product, getItemQuantity(product.id) + quantity);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        oldTotal,
        discountTotal,
        totalReward,
        getItemQuantity,
        setQuantity,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
