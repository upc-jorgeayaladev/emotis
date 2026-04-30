'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const success = searchParams?.get('success');

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await api.getOrder(parseInt(id as string));
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Pedido no encontrado</p>
        <Link href="/orders" className="text-pink-600 hover:text-pink-700">
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          ¡Pedido realizado con éxito! Te contactaremos pronto.
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Pedido #{order.id}
        </h1>
        <Link href="/orders" className="text-pink-600 hover:text-pink-700 inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a mis pedidos
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Estado del Pedido</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                {statusLabels[order.status]}
              </span>
            </div>
            <p className="text-gray-600">
              Realizado el {new Date(order.created_at).toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-6">Productos</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.product_variant.sku}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Cantidad: {item.quantity}
                      {item.customization_data &&
                        Object.keys(item.customization_data).length > 0 && (
                          <span className="ml-2 text-pink-600 font-medium">
                            (Personalizado)
                          </span>
                        )}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">S/. {formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4">Dirección de Envío</h2>
            <p className="text-gray-700">{order.shipping_address?.address}</p>
            <p className="text-gray-600">{order.shipping_address?.district}</p>
            {order.shipping_address?.reference && (
              <p className="text-sm text-gray-500 mt-2">
                Ref: {order.shipping_address.reference}
              </p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Resumen</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">S/. {formatPrice(order.total_amount)}</span>
              </div>

              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>- S/. {formatPrice(order.discount_amount)}</span>
                </div>
              )}

              {order.shipping_method && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío ({order.shipping_method.name})</span>
                  <span className="font-semibold">S/. {formatPrice(order.shipping_method.cost)}</span>
                </div>
              )}

              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>S/. {formatPrice(order.final_amount)}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Método de envío: <span className="font-medium text-gray-900">{order.shipping_method?.name}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Tiempo estimado: <span className="font-medium text-gray-900">{order.shipping_method?.estimated_days} días</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
