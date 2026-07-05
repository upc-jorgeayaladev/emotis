import { useState, useEffect } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const categories = [
  { id: 'all', label: 'Todos', emoji: '✨' },
  { id: 'birthday', label: 'Cumpleaños', emoji: '🎂' },
  { id: 'wedding', label: 'Bodas', emoji: '💒' },
  { id: 'anniversary', label: 'Aniversario', emoji: '💕' },
  { id: 'graduation', label: 'Graduación', emoji: '🎓' },
  { id: 'corporate', label: 'Corporativos', emoji: '💼' },
  { id: 'other', label: 'Otros', emoji: '🎉' },
];

const InspirationPage = () => {
  const { user } = useAuthStore();
  const [inspirations, setInspirations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInspiration, setSelectedInspiration] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [newInspiration, setNewInspiration] = useState({
    title: '',
    description: '',
    category: 'other',
    tags: []
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchInspirations();
  }, [selectedCategory]);

  const fetchInspirations = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/inspiration?category=${selectedCategory}&search=${searchQuery}`);
      setInspirations(data);
    } catch (err) {
      console.error('Error fetching inspirations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert('Máximo 5 imágenes');
      return;
    }
    setImages([...images, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(previews => previews.filter((_, i) => i !== index));
  };

  const handleCreateInspiration = async (e) => {
    e.preventDefault();
    if (!newInspiration.title.trim() || images.length === 0) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      images.forEach(image => formData.append('images', image));
      formData.append('title', newInspiration.title);
      formData.append('description', newInspiration.description);
      formData.append('category', newInspiration.category);
      formData.append('tags', JSON.stringify(newInspiration.tags));

      const { data } = await api.post('/inspiration', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setInspirations([data, ...inspirations]);
      setShowCreateModal(false);
      setNewInspiration({ title: '', description: '', category: 'other', tags: [] });
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      console.error('Error creating inspiration:', err);
      alert(err.response?.data?.message || 'Error al crear la inspiración');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReact = async (inspirationId, reaction) => {
    try {
      const { data } = await api.post(`/inspiration/${inspirationId}/react`, { reaction });
      setInspirations(inspirations.map(i => i._id === inspirationId ? { ...i, reactions: data.reactions } : i));
      if (selectedInspiration?._id === inspirationId) {
        setSelectedInspiration({ ...selectedInspiration, reactions: data.reactions });
      }
    } catch (err) {
      console.error('Error reacting:', err);
    }
  };

  const handleSave = async (e, inspirationId) => {
    e.stopPropagation();
    try {
      const { data } = await api.post(`/inspiration/${inspirationId}/save`);
      setInspirations(inspirations.map(i => i._id === inspirationId
        ? { ...i, saves: data.saved ? [...i.saves, user._id] : i.saves.filter(id => id !== user._id) }
        : i
      ));
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  const handleAddComment = async (inspirationId) => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await api.post(`/inspiration/${inspirationId}/comments`, { content: newComment });
      setSelectedInspiration(data);
      setInspirations(inspirations.map(i => i._id === inspirationId ? { ...i, comments: data.comments } : i));
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalReactions = (reactions) => {
    if (!reactions) return 0;
    return Object.values(reactions).reduce((a, b) => a + (b?.length || 0), 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Inspiración</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Descubre ideas creativas para sorprender a quienes más quieres
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Compartir inspiración
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : inspirations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay inspiraciones aún</h3>
            <p className="text-gray-500 mb-6">Sé el primero en compartir una idea creativa</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200"
            >
              Compartir inspiración
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
            {inspirations.map(inspiration => (
              <div
                key={inspiration._id}
                onClick={() => setSelectedInspiration(inspiration)}
                className="break-inside-avoid bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                {inspiration.images?.[0] && (
                  <div className="relative overflow-hidden">
                    <img
                      src={inspiration.images[0].secure_url}
                      alt={inspiration.title}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ minHeight: '200px', maxHeight: '400px' }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full shadow-sm">
                        {categories.find(c => c.id === inspiration.category)?.emoji} {categories.find(c => c.id === inspiration.category)?.label}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => handleSave(e, inspiration._id)}
                        className={`w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-colors ${
                          inspiration.saves?.includes(user?._id) ? 'bg-amber-400 text-white' : 'bg-white/90 text-gray-600 hover:bg-white'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={inspiration.saves?.includes(user?._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {inspiration.title}
                  </h3>
                  {inspiration.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{inspiration.description}</p>
                  )}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{inspiration.user?.name?.charAt(0)}</span>
                    </div>
                    <span className="text-sm text-gray-600">{inspiration.user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      {['emotion', 'inspire', 'want'].map(reaction => (
                        <button
                          key={reaction}
                          onClick={(e) => { e.stopPropagation(); handleReact(inspiration._id, reaction); }}
                          className="text-gray-400 hover:scale-125 transition-transform"
                        >
                          {reaction === 'emotion' && '❤️'}
                          {reaction === 'inspire' && '🎁'}
                          {reaction === 'want' && '😍'}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{totalReactions(inspiration.reactions)}</span>
                      <span>·</span>
                      <span>{inspiration.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedInspiration && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 transition-opacity bg-gray-500/75 backdrop-blur-sm" onClick={() => setSelectedInspiration(null)} />
            <div className="relative w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
              {/* Images */}
              {selectedInspiration.images?.length > 0 && (
                <div className={`grid gap-0.5 ${selectedInspiration.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {selectedInspiration.images.map((img, idx) => (
                    <img key={idx} src={img.secure_url} alt="" className={`w-full object-cover ${selectedInspiration.images.length === 1 ? 'max-h-96' : 'h-48'}`} />
                  ))}
                </div>
              )}

              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{selectedInspiration.user?.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedInspiration.user?.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(selectedInspiration.createdAt)}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedInspiration(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3">{selectedInspiration.title}</h2>
                {selectedInspiration.description && (
                  <p className="text-gray-700 leading-relaxed mb-4">{selectedInspiration.description}</p>
                )}

                {/* Reactions */}
                <div className="flex items-center space-x-2 mb-6 pb-6 border-b border-gray-100">
                  {[
                    { key: 'emotion', emoji: '❤️', label: 'Me emocionó' },
                    { key: 'inspire', emoji: '🎁', label: 'Me inspira' },
                    { key: 'cry', emoji: '🥹', label: 'Me hizo llorar' },
                    { key: 'want', emoji: '😍', label: 'Lo quiero' },
                    { key: 'perfect', emoji: '👏', label: 'Excelente' }
                  ].map(r => (
                    <button
                      key={r.key}
                      onClick={() => handleReact(selectedInspiration._id, r.key)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-xl transition-all ${
                        selectedInspiration.reactions?.[r.key]?.includes(user?._id)
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span>{r.emoji}</span>
                      <span className="text-sm">{selectedInspiration.reactions?.[r.key]?.length || 0}</span>
                    </button>
                  ))}
                </div>

                {/* Comments */}
                <h3 className="font-semibold text-gray-900 mb-4">
                  {selectedInspiration.comments?.length || 0} Comentarios
                </h3>
                <div className="space-y-4 mb-6">
                  {selectedInspiration.comments?.map(comment => (
                    <div key={comment._id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">{comment.user?.name?.charAt(0)}</span>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-3">
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
                <div className="flex items-start space-x-3 pt-4 border-t border-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">{user?.name?.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe un comentario..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleAddComment(selectedInspiration._id)}
                        disabled={submitting || !newComment.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                      >
                        {submitting ? '...' : 'Comentar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div className="fixed inset-0 transition-opacity bg-gray-500/75 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
            <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Compartir inspiración</h3>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleCreateInspiration} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes (requerido, máx 5)</label>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full text-sm" />
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative">
                          <img src={preview} alt="" className="w-full h-24 object-cover rounded-lg" />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input type="text" value={newInspiration.title} onChange={(e) => setNewInspiration({ ...newInspiration, title: e.target.value })} placeholder="Ej: Taza familiar personalizada" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea value={newInspiration.description} onChange={(e) => setNewInspiration({ ...newInspiration, description: e.target.value })} placeholder="Cuenta la historia detrás de esta idea..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all duration-200" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <div className="grid grid-cols-4 gap-2">
                    {categories.slice(1).map(category => (
                      <button key={category.id} type="button" onClick={() => setNewInspiration({ ...newInspiration, category: category.id })} className={`p-2 rounded-xl border-2 text-center transition-all duration-200 ${newInspiration.category === category.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <span className="text-lg block">{category.emoji}</span>
                        <span className={`text-[10px] font-medium ${newInspiration.category === category.id ? 'text-indigo-600' : 'text-gray-600'}`}>{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors">Cancelar</button>
                  <button type="submit" disabled={submitting || images.length === 0} className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-50">
                    {submitting ? 'Publicando...' : 'Compartir'}
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

export default InspirationPage;
