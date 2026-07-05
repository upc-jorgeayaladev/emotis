import PostForm from '../components/Post/PostForm';
import useAuthStore from '../store/authStore';
import Avatar from '../components/Common/Avatar';

const CreatePostPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crear publicación</h1>
          <p className="text-gray-500 mt-2">Comparte un momento especial con la comunidad</p>
        </div>

        <div className="flex gap-6">
          {/* Main Form */}
          <div className="flex-1">
            <PostForm />
          </div>

          {/* Tips Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Tips Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mr-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </span>
                  Consejos para tu publicación
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <p className="text-sm text-gray-600">Comparte la historia detrás del regalo</p>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <p className="text-sm text-gray-600">Muestra la reacción de quien recibió</p>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <p className="text-sm text-gray-600">Agrega una ocasión especial</p>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <p className="text-sm text-gray-600">Incluye el producto utilizado</p>
                  </li>
                </ul>
              </div>

              {/* Trending Occasions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Ocasiones populares</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-pink-50 text-pink-600 text-sm rounded-full font-medium cursor-pointer hover:bg-pink-100 transition-colors">🎂 Cumpleaños</span>
                  <span className="px-3 py-1.5 bg-purple-50 text-purple-600 text-sm rounded-full font-medium cursor-pointer hover:bg-purple-100 transition-colors">💒 Bodas</span>
                  <span className="px-3 py-1.5 bg-rose-50 text-rose-600 text-sm rounded-full font-medium cursor-pointer hover:bg-rose-100 transition-colors">💕 Aniversario</span>
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm rounded-full font-medium cursor-pointer hover:bg-blue-100 transition-colors">🎓 Graduación</span>
                  <span className="px-3 py-1.5 bg-green-50 text-green-600 text-sm rounded-full font-medium cursor-pointer hover:bg-green-100 transition-colors">🎄 Navidad</span>
                  <span className="px-3 py-1.5 bg-red-50 text-red-600 text-sm rounded-full font-medium cursor-pointer hover:bg-red-100 transition-colors">💝 San Valentín</span>
                </div>
              </div>

              {/* Example Post */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">💡</span>
                  Ejemplo de publicación
                </h3>
                <blockquote className="text-sm text-gray-700 italic border-l-4 border-indigo-300 pl-3">
                  "Mi mamá siempre quiso una taza con una foto de toda la familia. 
                  Hoy finalmente pude regalársela y lloró de emoción ❤️"
                </blockquote>
                <p className="text-xs text-gray-500 mt-3">— Publicación popular en Emotis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
