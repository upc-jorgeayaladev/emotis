import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Avatar from '../Common/Avatar';

const Sidebar = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    { 
      path: '/feed', 
      label: 'Inicio', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      path: '/create', 
      label: 'Crear publicación', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    { 
      path: '/calendar', 
      label: 'Calendario', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      path: '/wishlist', 
      label: 'Lista de deseos', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    { 
      path: '/inspiration', 
      label: 'Inspiración', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      path: '/community', 
      label: 'Comunidad', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      path: '/blog', 
      label: 'Mi blog', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
  ];

  const trendingTopics = [
    { tag: 'Cumpleaños', count: '2.4k posts' },
    { tag: 'Bodas', count: '1.8k posts' },
    { tag: 'Aniversarios', count: '1.2k posts' },
  ];

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-gray-100 bg-white h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-5">
        {/* User Profile Card */}
        <Link 
          to={`/profile/${user?.username}`} 
          className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group"
        >
          <div className="relative flex-shrink-0">
            <Avatar src={user?.avatar?.secure_url} size="lg" />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{user?.name}</p>
            <p className="text-sm text-gray-500 truncate">@{user?.username}</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="mt-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Trending Section */}
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">Tendencias</h3>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div 
                key={index}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">#</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">#{topic.tag}</p>
                    <p className="text-xs text-gray-500">{topic.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Tu actividad</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">0</p>
              <p className="text-xs text-gray-500">Publicaciones</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-xs text-gray-500">Seguidores</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 px-4">
          <p className="text-xs text-gray-400">
            Emotis © 2026 · Transformando regalos en emociones
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
