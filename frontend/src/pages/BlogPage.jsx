import { useState, useEffect } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const categories = [
  { id: 'all', label: 'Todas', emoji: '📝' },
  { id: 'stories', label: 'Historias', emoji: '📖' },
  { id: 'tips', label: 'Consejos', emoji: '💡' },
  { id: 'tutorials', label: 'Tutoriales', emoji: '🎓' },
  { id: 'inspiration', label: 'Inspiración', emoji: '✨' },
];

const BlogPage = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'stories' });

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/blog?category=${selectedCategory}&search=${searchQuery}`);
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await api.post('/blog', newPost);
      setPosts([data, ...posts]);
      setShowWriteModal(false);
      setNewPost({ title: '', content: '', category: 'stories' });
    } catch (err) {
      console.error('Error creating post:', err);
      alert(err.response?.data?.message || 'Error al crear el artículo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async (e, postId) => {
    e.stopPropagation();
    try {
      const { data } = await api.post(`/blog/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: data.liked ? [...p.likes, user._id] : p.likes.filter(id => id !== user._id) } : p));
      if (selectedPost?._id === postId) {
        setSelectedPost({ ...selectedPost, likes: data.liked ? [...selectedPost.likes, user._id] : selectedPost.likes.filter(id => id !== user._id) });
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await api.post(`/blog/${postId}/comments`, { content: newComment });
      setSelectedPost(data);
      setPosts(posts.map(p => p._id === postId ? { ...p, comments: data.comments } : p));
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const featuredPosts = posts.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Mi Blog</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Historias, consejos e inspiración para crear regalos inolvidables
            </p>
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar historias..."
                  className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-200"
                />
              </form>
            </div>
            <button
              onClick={() => setShowWriteModal(true)}
              className="mt-6 inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Escribir historia
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{category.emoji}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay artículos aún</h3>
            <p className="text-gray-500 mb-6">Sé el primero en compartir tu historia</p>
            <button
              onClick={() => setShowWriteModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200"
            >
              Escribir primera historia
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <article
                key={post._id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  {post.cover?.secure_url ? (
                    <img src={post.cover.secure_url} alt={post.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <span className="text-5xl">{categories.find(c => c.id === post.category)?.emoji || '📝'}</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                      {post.readTime}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                      {categories.find(c => c.id === post.category)?.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{post.user?.name?.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-gray-600">{post.user?.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {post.likes?.length || 0}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 transition-opacity bg-gray-500/75 backdrop-blur-sm" onClick={() => setSelectedPost(null)} />
            <div className="relative w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
              {/* Cover */}
              {selectedPost.cover?.secure_url ? (
                <div className="relative h-64 md:h-80">
                  <img src={selectedPost.cover.secure_url} alt={selectedPost.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600" />
              )}

              {/* Close button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-10"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                  {categories.find(c => c.id === selectedPost.category)?.emoji} {categories.find(c => c.id === selectedPost.category)?.label}
                </span>

                <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">{selectedPost.title}</h1>

                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{selectedPost.user?.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedPost.user?.name}</p>
                      <p className="text-sm text-gray-500">{formatDate(selectedPost.createdAt)} · {selectedPost.readTime} de lectura</p>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  {selectedPost.content?.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={(e) => handleLikePost(e, selectedPost._id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                      selectedPost.likes?.includes(user?._id)
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={selectedPost.likes?.includes(user?._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="font-medium">{selectedPost.likes?.length || 0}</span>
                  </button>
                </div>

                {/* Comments */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {selectedPost.comments?.length || 0} Comentarios
                  </h3>
                  <div className="space-y-4 mb-6">
                    {selectedPost.comments?.map(comment => (
                      <div key={comment._id} className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">{comment.user?.name?.charAt(0)}</span>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900 text-sm">{comment.user?.name}</p>
                            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-600">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add comment */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">{user?.name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
                        rows={3}
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => handleAddComment(selectedPost._id)}
                          disabled={submitting || !newComment.trim()}
                          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-50"
                        >
                          {submitting ? 'Publicando...' : 'Publicar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Write Post Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 transition-opacity bg-gray-500/75 backdrop-blur-sm" onClick={() => setShowWriteModal(false)} />
            <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Escribir historia</h3>
                  <button onClick={() => setShowWriteModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleCreatePost} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Ej: Cómo sorprendí a mi mamá en su cumpleaños"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(1).map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setNewPost({ ...newPost, category: category.id })}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          newPost.category === category.id
                            ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                            : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-300'
                        }`}
                      >
                        {category.emoji} {category.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Historia</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Cuenta tu experiencia, consejo o historia..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
                    rows={8}
                    required
                  />
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setShowWriteModal(false)} className="px-6 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-50">
                    {submitting ? 'Publicando...' : 'Publicar historia'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
