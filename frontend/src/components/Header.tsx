"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Emotis Regalos
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/products" className="text-gray-700 hover:text-pink-600 transition">Catálogo</Link>
              {isAuthenticated && (
                <Link href="/orders" className="text-gray-700 hover:text-pink-600 transition">Mis Pedidos</Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-pink-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cart && cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.items.length}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm hidden md:block">
                  Hola, {user?.first_name}
                </span>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-pink-600 text-sm"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-gray-700 hover:text-pink-600 text-sm">
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
