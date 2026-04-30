'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customizationData, setCustomizationData] = useState<Record<string, any>>({});
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      const data = await api.getProduct(slug as string);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setAdding(true);
    try {
      await addToCart(
        product.variants[selectedVariant].id,
        quantity,
        Object.keys(customizationData).length > 0 ? customizationData : undefined
      );
      alert('Producto agregado al carrito');
    } catch (error) {
      alert('Error al agregar al carrito');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Producto no encontrado</p>
        <Link href="/products" className="text-pink-600 hover:text-pink-700">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="text-pink-600 hover:text-pink-700 mb-6 inline-flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Product Images */}
        <div>
          <div className="bg-gray-100 rounded-xl overflow-hidden mb-4 aspect-square">
            {product.images.length > 0 ? (
              <img
                src={getImageUrl(product.images[selectedImage].image)}
                alt={product.images[selectedImage].alt_text || product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/600x600/EEE/999?text=${encodeURIComponent(product.name)}`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === idx ? 'border-pink-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={getImageUrl(img.image)}
                    alt={img.alt_text}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {variant && (
            <div className="mb-6">
              <span className="text-3xl font-bold text-pink-600">
                S/. {formatPrice(variant.price)}
              </span>
              {variant.stock_quantity > 0 ? (
                <span className="ml-4 text-sm text-green-600">En stock ({variant.stock_quantity} disponibles)</span>
              ) : (
                <span className="ml-4 text-sm text-red-600">Sin stock</span>
              )}
            </div>
          )}

          {/* Variants Selection */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Variante
              </label>
              <div className="space-y-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(idx)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                      selectedVariant === idx
                        ? 'border-pink-600 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {Object.entries(v.attributes)
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(', ')}
                    </div>
                    <div className="text-pink-600 font-semibold">S/. {formatPrice(v.price)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization Options */}
          {product.is_customizable && product.customization_options.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Personalización</h3>
              {product.customization_options.map((option) => (
                <div key={option.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {option.name} {option.is_required && <span className="text-red-500">*</span>}
                  </label>
                  {option.option_type === 'text' && (
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      onChange={(e) =>
                        setCustomizationData({
                          ...customizationData,
                          [option.name]: e.target.value,
                        })
                      }
                    />
                  )}
                  {option.option_type === 'image' && (
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCustomizationData({
                            ...customizationData,
                            [option.name]: file.name,
                          });
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                -
              </button>
              <span className="px-6 py-2 border-x border-gray-200">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding || (variant?.stock_quantity || 0) === 0}
              className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              {adding ? 'Agregando...' : 'Agregar al Carrito'}
            </button>
          </div>

          {product.is_customizable && (
            <div className="p-4 bg-pink-50 rounded-lg">
              <p className="text-sm text-pink-800 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Este producto es personalizable
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
