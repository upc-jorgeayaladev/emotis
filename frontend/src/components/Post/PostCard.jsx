import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Common/Avatar';
import ReactionBar from './ReactionBar';

const PostCard = ({ post }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    
    return date.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short'
    });
  };

  const occasionLabels = {
    birthday: '🎂 Cumpleaños',
    wedding: '💒 Boda',
    anniversary: '💕 Aniversario',
    graduation: '🎓 Graduación',
    christmas: '🎄 Navidad',
    mothers_day: '👩 Día de la Madre',
    valentines: '💝 San Valentín',
    other: '🎉 Ocasión especial'
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${post.user?.username}`}>
              <div className="relative">
                <Avatar src={post.user?.avatar?.secure_url} size="md" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <Link 
                  to={`/profile/${post.user?.username}`}
                  className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  {post.user?.name}
                </Link>
                {post.user?.badges?.length > 0 && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs rounded-full font-medium">
                    ✨
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1.5 text-sm text-gray-500">
                <span>@{post.user?.username}</span>
                <span>·</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Guardar publicación</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Compartir</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span>Notificar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Occasion Badge */}
        {post.occasion && post.occasion !== 'other' && (
          <div className="mt-3">
            <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm rounded-full font-medium border border-indigo-100">
              {occasionLabels[post.occasion]}
            </span>
          </div>
        )}

        {/* Description */}
        {post.description && (
          <p className="mt-3 text-gray-800 leading-relaxed whitespace-pre-wrap">{post.description}</p>
        )}
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-0.5 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.images.slice(0, 4).map((image, index) => (
            <div 
              key={index} 
              className={`relative group ${
                post.images.length === 1 
                  ? 'aspect-video' 
                  : post.images.length === 3 && index === 0 
                    ? 'row-span-2 aspect-square' 
                    : 'aspect-square'
              }`}
            >
              <img
                src={image.secure_url}
                alt={`Post image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              {index === 3 && post.images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white text-2xl font-bold">+{post.images.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Gift Product */}
      {post.giftProduct && (
        <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎁</span>
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium">Regalo utilizado</p>
                <p className="font-semibold text-gray-900">{post.giftProduct}</p>
              </div>
            </div>
            <a
              href="https://emotisregalos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 transform hover:-translate-y-0.5"
            >
              Personalizar
            </a>
          </div>
        </div>
      )}

      {/* Reactions & Actions */}
      <div className="p-4 pt-3">
        <div className="flex items-center justify-between">
          <ReactionBar post={post} />
          
          <div className="flex items-center space-x-1">
            {/* Save Button */}
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isSaved 
                  ? 'text-amber-500 bg-amber-50' 
                  : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
              }`}
            >
              <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* Share Button */}
            <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Comments Preview */}
        {post.comments && post.comments.length > 0 && (
          <Link 
            to={`/post/${post._id}`}
            className="block mt-3 pt-3 border-t border-gray-100"
          >
            <p className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              Ver todos los {post.comments.length} comentarios
            </p>
          </Link>
        )}
      </div>
    </article>
  );
};

export default PostCard;
