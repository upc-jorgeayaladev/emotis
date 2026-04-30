'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { ShippingMethod } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const { cart, loading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    address: user?.address || '',
    district: user?.district || '',
    reference: '',
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    loadShippingMethods();
  }, [isAuthenticated]);

  const loadShippingMethods = async () => {
    try {
      const data = await api.getShippingMethods();
      setShippingMethods(data);
      if (data.length > 0) {
        setSelectedShipping(data[0].id.toString());
      }
    } catch (error) {
      console.error('Error loading shipping methods:', error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;

    try {
      const coupon = await api.validateCoupon(couponCode);
      const discountAmount = coupon.discount_type === 'percentage'
        ? (cart?.total || 0) * (coupon.discount_value / 100)
        : coupon.discount_value;
      setDiscount(Math.min(discountAmount, cart?.total || 0));
      alert('Cupón aplicado correctamente');
    } catch (error) {
      alert('Cupón inválido o expirado');
      setDiscount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || !selectedShipping) return;

    setProcessing(true);
    try {
      const order = await api.createOrder({
        shipping_address_data: shippingAddress,
        shipping_method_id: parseInt(selectedShipping),
        coupon_code: couponCode,
        items: cart.items.map(item => ({
          product_variant: item.product_variant.id,
          quantity: item.quantity,
          customization_data: item.customization_data,
        })),
      });

      router.push(`/orders/${order.id}?success=true`);
    } catch (error) {
      alert('Error al procesar el pedido');
    } finally {
      setProcessing(false);
    }
  };

  if (cartLoading || !cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Carrito vacío</h1>
        <Link href="/products" className="text-pink-600 hover:text-pink-700">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const subtotal = cart.total;
  const shippingCost = shippingMethods.find(m => m.id.toString() === selectedShipping)?.cost || 0;
  const total = subtotal - discount + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-6">Dirección de Envío</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distrito
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.district}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referencia
                  </label>
                  <textarea
                    value={shippingAddress.reference}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, reference: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-6">Método de Envío</h2>
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                      selectedShipping === method.id.toString()
                        ? 'border-pink-600 bg-pink-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={selectedShipping === method.id.toString()}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      className="mr-3 text-pink-600 focus:ring-pink-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{method.name}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                      <div className="text-sm text-gray-500">{method.estimated_days} días</div>
                    </div>
                    <div className="font-semibold text-gray-900">S/. {formatPrice(method.cost)}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-6">Cupón de Descuento</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Código de cupón"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Aplicar
                </button>
              </div>
              {discount > 0 && (
                <p className="mt-3 text-green-600 font-medium">Descuento aplicado: S/. {formatPrice(discount)}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              {processing ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Resumen</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">S/. {formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>- S/. {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold">S/. {formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>S/. {formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
