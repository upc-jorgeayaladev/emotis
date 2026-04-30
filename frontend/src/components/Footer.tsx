import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Emotis Regalos
            </h3>
            <p className="text-gray-400 text-sm">
              Artículos promocionales y regalos personalizados en Lima, Perú.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-white transition">Catálogo</Link></li>
              <li><Link href="/cart" className="hover:text-white transition">Carrito</Link></li>
              <li><Link href="/orders" className="hover:text-white transition">Mis Pedidos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products?category=tazas" className="hover:text-white transition">Tazas</Link></li>
              <li><Link href="/products?category=polos" className="hover:text-white transition">Polos</Link></li>
              <li><Link href="/products?category=piscos" className="hover:text-white transition">Piscos</Link></li>
              <li><Link href="/products?category=llaveros" className="hover:text-white transition">Llaveros</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Lima, Perú</li>
              <li>contacto@emotis.com.pe</li>
              <li>+51 999 999 999</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Emotis Regalos. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
