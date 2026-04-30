'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice, getImageUrl } from '@/lib/utils';

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, clearCart } = useCart();
  const router = useRouter();
  const [updating, setUpdating] = useState<number | null>(null);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    try {
      await updateItem(itemId, newQuantity);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setUpdating(itemId);
    try {
      await removeItem(itemId);
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      await clearCart();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="mb-6">
          <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-8">Agrega productos para comenzar tu compra</p>
        <Link
          href="/products"
          className="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition font-semibold"
        >
          Ver Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="p-6 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.product_variant.sku}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {Object.entries(item.product_variant.attributes)
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(', ')}
                    </p>
                    {item.customization_data &&
                      Object.keys(item.customization_data).length > 0 && (
                        <p className="text-sm text-pink-600 mt-2">
                          Personalización: {JSON.stringify(item.customization_data)}
                        </p>
                      )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={updating === item.id || item.quantity <= 1}
                        className="px-3 py-1 hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={updating === item.id}
                        className="px-3 py-1 hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-semibold text-gray-900 min-w-[80px] text-right">
                      S/. {formatPrice(item.subtotal)}
                    </span>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating === item.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleClearCart}
            className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen del Pedido</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">S/. {formatPrice(cart.total)}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>S/. {formatPrice(cart.total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full mt-6 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold"
            >
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
