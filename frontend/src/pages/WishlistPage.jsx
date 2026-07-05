import { useState, useEffect } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const WishlistPage = () => {
  const { user, updateUser } = useAuthStore();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', url: '', priority: 'medium', category: 'general' });
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Todas', emoji: '✨' },
    { value: 'general', label: 'General', emoji: '🎁' },
    { value: 'tech', label: 'Tecnología', emoji: '💻' },
    { value: 'fashion', label: 'Moda', emoji: '👗' },
    { value: 'home', label: 'Hogar', emoji: '🏠' },
    { value: 'books', label: 'Libros', emoji: '📚' },
    { value: 'experience', label: 'Experiencias', emoji: '🌟' },
  ];

  const priorities = [
    { value: 'low', label: 'Baja', color: 'bg-gray-100 text-gray-600' },
    { value: 'medium', label: 'Media', color: 'bg-amber-100 text-amber-600' },
    { value: 'high', label: 'Alta', color: 'bg-rose-100 text-rose-600' },
  ];

  useEffect(() => {
    if (user?.wishlist) {
      setWishlist(user.wishlist);
    }
    setIsLoading(false);
  }, [user]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const itemToAdd = {
        ...newItem,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      const updatedWishlist = [...wishlist, itemToAdd];
      await api.put('/users/profile', { wishlist: updatedWishlist });
      setWishlist(updatedWishlist);
      updateUser({ wishlist: updatedWishlist });
      setShowAddModal(false);
      setNewItem({ name: '', url: '', priority: 'medium', category: 'general' });
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      const updatedWishlist = wishlist.map(item => 
        (item.id || item._id) === editingItem.id ? editingItem : item
      );
      await api.put('/users/profile', { wishlist: updatedWishlist });
      setWishlist(updatedWishlist);
      updateUser({ wishlist: updatedWishlist });
      setShowAddModal(false);
      setEditingItem(null);
      setNewItem({ name: '', url: '', priority: 'medium', category: 'general' });
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!confirm('¿Eliminar este elemento de tu lista de deseos?')) return;
    try {
      const updatedWishlist = wishlist.filter(item => (item.id || item._id) !== itemId);
      await api.put('/users/profile', { wishlist: updatedWishlist });
      setWishlist(updatedWishlist);
      updateUser({ wishlist: updatedWishlist });
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const openEditModal = (item) => {
    setEditingItem({ ...item });
    setNewItem({ name: item.name, url: item.url || '', priority: item.priority || 'medium', category: item.category || 'general' });
    setShowAddModal(true);
  };

  const filteredWishlist = filterCategory === 'all' 
    ? wishlist 
    : wishlist.filter(item => item.category === filterCategory);

  const getPriorityColor = (priority) => {
    return priorities.find(p => p.value === priority)?.color || 'bg-gray-100 text-gray-600';
  };

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[1];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

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
              if (user?.wishlist) setWishlist(user.wishlist);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Lista de Deseos</h1>
            <p className="text-gray-500 mt-1">Los regalos que me encantaría recibir</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setNewItem({ name: '', url: '', priority: 'medium', category: 'general' });
              setShowAddModal(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar deseo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💫</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
            <p className="text-sm text-gray-500">Deseos totales</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{wishlist.filter(i => i.priority === 'high').length}</p>
            <p className="text-sm text-gray-500">Prioridad alta</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{wishlist.filter(i => i.priority === 'medium').length}</p>
            <p className="text-sm text-gray-500">Prioridad media</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📌</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{wishlist.filter(i => i.priority === 'low').length}</p>
            <p className="text-sm text-gray-500">Prioridad baja</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setFilterCategory(category.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  filterCategory === category.value
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

        {/* Wishlist Grid */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <span className="text-5xl">💫</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Tu lista está vacía</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Agrega los regalos que te gustaría recibir para que tus amigos y familia sepan qué obsequiarte
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Agregar mi primer deseo
            </button>
          </div>
        ) : filteredWishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin resultados</h3>
            <p className="text-gray-500">No hay deseos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWishlist.map((item) => {
              const categoryInfo = getCategoryInfo(item.category);
              return (
                <div
                  key={item.id || item._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group"
                >
                  {/* Card Header with Gradient */}
                  <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
                          {categoryInfo.emoji}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500">{categoryInfo.label}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                        {priorities.find(p => p.value === item.priority)?.label || 'Media'}
                      </span>
                    </div>

                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 mb-4 p-2 bg-indigo-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="truncate">Ver enlace del producto</span>
                      </a>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={() => openEditModal(item)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-sm">Editar</span>
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id || item._id)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-sm">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500/75 backdrop-blur-sm"
              onClick={() => {
                setShowAddModal(false);
                setEditingItem(null);
              }}
            />

            <div className="relative w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
              {/* Modal Header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingItem ? 'Editar deseo' : 'Agregar nuevo deseo'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingItem(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={editingItem ? handleEditItem : handleAddItem} className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Qué te gustaría recibir?
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-xl">🎁</span>
                    </div>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Ej: Taza personalizada"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enlace del producto
                    <span className="ml-1 text-xs font-normal text-gray-400">(opcional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      value={newItem.url}
                      onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                      placeholder="https://..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {categories.slice(1).map(category => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setNewItem({ ...newItem, category: category.value })}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                          newItem.category === category.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl block">{category.emoji}</span>
                        <span className={`text-[10px] font-medium ${
                          newItem.category === category.value ? 'text-indigo-600' : 'text-gray-600'
                        }`}>
                          {category.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Qué tan importante es?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {priorities.map(priority => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setNewItem({ ...newItem, priority: priority.value })}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                          newItem.priority === priority.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`text-sm font-medium ${
                          newItem.priority === priority.value ? 'text-indigo-600' : 'text-gray-600'
                        }`}>
                          {priority.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingItem(null);
                    }}
                    className="px-6 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {editingItem ? 'Guardar cambios' : 'Agregar deseo'}
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

export default WishlistPage;
