'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { Cart, CartItem } from '@/types';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productVariantId: number, quantity: number, customizationData?: any) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      const data = await api.getCart();
      setCart(data);
    } catch (error) {
      // Cart might not exist yet
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      refreshCart();
    } else {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productVariantId: number, quantity: number, customizationData?: any) => {
    const newItem = await api.addToCart({
      product_variant_id: productVariantId,
      quantity,
      customization_data: customizationData,
    });
    await refreshCart();
  };

  const updateItem = async (itemId: number, quantity: number) => {
    await api.updateCartItem(itemId, { quantity });
    await refreshCart();
  };

  const removeItem = async (itemId: number) => {
    await api.removeCartItem(itemId);
    await refreshCart();
  };

  const clearCart = async () => {
    await api.clearCart();
    await refreshCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
