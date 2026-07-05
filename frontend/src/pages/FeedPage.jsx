import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import PostCard from '../components/Post/PostCard';
import Avatar from '../components/Common/Avatar';

const FeedPage = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Mock stories data
  const stories = [
    { id: 1, user: { name: 'Ana García', username: 'ana_g', avatar: null }, hasNew: true },
    { id: 2, user: { name: 'Carlos López', username: 'carlos_l', avatar: null }, hasNew: true },
    { id: 3, user: { name: 'María Santos', username: 'maria_s', avatar: null }, hasNew: false },
    { id: 4, user: { name: 'Pedro Ruiz', username: 'pedro_r', avatar: null }, hasNew: true },
  ];

  // Mock suggested users
  const suggestedUsers = [
    { _id: '1', name: 'Laura Díaz', username: 'laura_d', bio: 'Amante de los regalos personalizados 🎁' },
    { _id: '2', name: 'Roberto Méndez', username: 'roberto_m', bio: 'Compartiendo momentos especiales ✨' },
    { _id: '3', name: 'Sofía Vargas', username: 'sofia_v', bio: 'Cada regalo cuenta una historia 💝' },
  ];

  const tabs = [
    { id: 'all', label: 'Para ti', icon: '✨' },
    { id: 'following', label: 'Siguiendo', icon: '👥' },
    { id: 'trending', label: 'Tendencias', icon: '🔥' },
  ];

  const fetchPosts = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/posts?page=${pageNum}&limit=10`);
      
      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      
      setHasMore(pageNum < data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar publicaciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Algo salió mal</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchPosts();
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {/* Main Feed */}
          <div className="flex-1 max-w-2xl">
            {/* Stories Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Historias</h2>
                <Link to="/stories" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Ver todas
                </Link>
              </div>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {/* Create Story */}
                <div className="flex-shrink-0">
                  <Link to="/create" className="block">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-dashed border-indigo-300 flex flex-col items-center justify-center hover:from-indigo-200 hover:to-purple-200 transition-colors">
                      <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-indigo-600 font-medium mt-1">Tu historia</span>
                    </div>
                  </Link>
                </div>

                {/* Other Stories */}
                {stories.map((story) => (
                  <div key={story.id} className="flex-shrink-0">
                    <button className="block">
                      <div className={`w-20 h-20 rounded-2xl p-0.5 ${
                        story.hasNew 
                          ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' 
                          : 'bg-gray-200'
                      }`}>
                        <div className="w-full h-full rounded-xl bg-white p-0.5">
                          <Avatar 
                            src={story.user?.avatar?.secure_url} 
                            size="lg"
                            className="w-full h-full rounded-lg"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center max-w-[80px] truncate">
                        {story.user?.name?.split(' ')[0]}
                      </p>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Create Post */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Avatar src={user?.avatar?.secure_url} size="md" />
                <Link 
                  to="/create"
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-gray-500 text-left hover:bg-gray-200 transition-colors"
                >
                  ¿Qué momento especial quieres compartir?
                </Link>
              </div>
              <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-100 space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Foto</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Video</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Evento</span>
                </button>
              </div>
            </div>

            {/* Posts */}
            {posts.length === 0 && !isLoading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🎁</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Bienvenido a Emotis!</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Comienza siguiendo a personas para ver sus momentos especiales aquí
                </p>
                <div className="flex justify-center space-x-3">
                  <Link
                    to="/inspiration"
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                  >
                    Explorar inspiración
                  </Link>
                  <Link
                    to="/create"
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Crear publicación
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {posts.map(post => (
                  <PostCard key={post._id} post={post} />
                ))}

                {isLoading && (
                  <div className="flex justify-center py-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                {hasMore && !isLoading && (
                  <button
                    onClick={loadMore}
                    className="w-full py-3 text-indigo-600 hover:text-indigo-700 font-medium bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-all"
                  >
                    Cargar más publicaciones
                  </button>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Suggested Users */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Sugerencias para ti</h3>
                <div className="space-y-4">
                  {suggestedUsers.map((suggestedUser) => (
                    <div key={suggestedUser._id} className="flex items-center justify-between">
                      <Link to={`/profile/${suggestedUser.username}`} className="flex items-center space-x-3">
                        <Avatar src={suggestedUser.avatar?.secure_url} size="md" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{suggestedUser.name}</p>
                          <p className="text-sm text-gray-500 truncate">@{suggestedUser.username}</p>
                        </div>
                      </Link>
                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                        Seguir
                      </button>
                    </div>
                  ))}
                </div>
                <Link to="/community" className="block mt-4 text-sm text-gray-500 hover:text-indigo-600 text-center">
                  Ver más sugerencias
                </Link>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Próximos eventos</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                      <span className="text-xl">🎂</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Cumpleaños de Ana</p>
                      <p className="text-sm text-gray-500">En 3 días</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center">
                      <span className="text-xl">💕</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Aniversario de Carlos</p>
                      <p className="text-sm text-gray-500">En 7 días</p>
                    </div>
                  </div>
                </div>
                <Link to="/calendar" className="block mt-4 text-sm text-gray-500 hover:text-indigo-600 text-center">
                  Ver calendario completo
                </Link>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-400">
                <p>Emotis © 2026</p>
                <p className="mt-1">Transformando regalos en emociones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
