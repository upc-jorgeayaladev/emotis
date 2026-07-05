import { useState, useEffect } from 'react';
import api from '../services/api';

const categories = [
  { id: 'all', label: 'Todas', emoji: '💬' },
  { id: 'birthday', label: 'Cumpleaños', emoji: '🎂' },
  { id: 'romantic', label: 'Románticas', emoji: '💕' },
  { id: 'corporate', label: 'Corporativos', emoji: '💼' },
  { id: 'graduation', label: 'Graduación', emoji: '🎓' },
  { id: 'other', label: 'Otros', emoji: '✨' },
];

const CommunityPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showAskModal, setShowAskModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', category: 'birthday' });
  const [newAnswer, setNewAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory, sortBy]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/questions?category=${selectedCategory}&sort=${sortBy}`);
      setQuestions(data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await api.post('/questions', newQuestion);
      setQuestions([data, ...questions]);
      setShowAskModal(false);
      setNewQuestion({ title: '', content: '', category: 'birthday' });
    } catch (err) {
      console.error('Error creating question:', err);
      alert(err.response?.data?.message || 'Error al crear la pregunta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnswer = async (questionId) => {
    if (!newAnswer.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await api.post(`/questions/${questionId}/answers`, { content: newAnswer });
      setSelectedQuestion(data);
      setQuestions(questions.map(q => q._id === questionId ? { ...q, answers: data.answers } : q));
      setNewAnswer('');
    } catch (err) {
      console.error('Error adding answer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoteQuestion = async (e, questionId) => {
    e.stopPropagation();
    try {
      const { data } = await api.post(`/questions/${questionId}/vote`);
      setQuestions(questions.map(q => q._id === questionId ? { ...q, votes: data.votes } : q));
      if (selectedQuestion?._id === questionId) {
        setSelectedQuestion({ ...selectedQuestion, votes: data.votes });
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Hace minutos';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comunidad</h1>
            <p className="text-gray-500 mt-1">Pregunta, responde y descubre las mejores ideas de regalos</p>
          </div>
          <button
            onClick={() => setShowAskModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Hacer pregunta
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="overflow-x-auto -mx-1 px-1">
              <div className="flex items-center space-x-2 min-w-max">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
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
            <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">Ordenar:</span>
              {['popular', 'recent', 'unanswered'].map(sort => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    sortBy === sort
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sort === 'popular' ? 'Popular' : sort === 'recent' ? 'Reciente' : 'Sin responder'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no hay preguntas</h3>
              <p className="text-gray-500 mb-6">Sé el primero en hacer una pregunta a la comunidad</p>
              <button
                onClick={() => setShowAskModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200"
              >
                Hacer mi primera pregunta
              </button>
            </div>
          ) : (
            questions.map(question => (
              <div
                key={question._id}
                onClick={() => setSelectedQuestion(question)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start gap-3 sm:gap-5">
                  {/* Votes */}
                  <div className="flex flex-col items-center space-y-1 pt-1">
                    <button
                      onClick={(e) => handleVoteQuestion(e, question._id)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <span className="font-bold text-gray-900 text-lg">{question.votes?.length || 0}</span>
                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {question.title}
                      </h3>
                      {question.solved && (
                        <span className="flex-shrink-0 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          ✅ Resuelta
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{question.content}</p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{question.user?.name?.charAt(0)}</span>
                          </div>
                          <span className="text-sm text-gray-600">{question.user?.name}</span>
                        </div>
                        <span className="text-gray-300">·</span>
                        <span className="text-sm text-gray-500">{formatDate(question.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {question.answers?.length || 0}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {question.views || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500/75 backdrop-blur-sm"
              onClick={() => setSelectedQuestion(null)}
            />
            <div className="relative w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900">{selectedQuestion.title}</h2>
                    <span className="text-sm text-gray-500">{formatDate(selectedQuestion.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => setSelectedQuestion(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <p className="text-gray-700 leading-relaxed mb-6">{selectedQuestion.content}</p>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{selectedQuestion.user?.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedQuestion.user?.name}</p>
                    <p className="text-xs text-gray-500">@{selectedQuestion.user?.username}</p>
                  </div>
                </div>

                {/* Answers */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {selectedQuestion.answers?.length || 0} respuestas
                  </h3>
                  <div className="space-y-4">
                    {selectedQuestion.answers?.map(answer => (
                      <div key={answer._id} className="bg-gray-50 rounded-xl p-5">
                        <p className="text-gray-700 leading-relaxed mb-4">{answer.content}</p>
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{answer.user?.name?.charAt(0)}</span>
                          </div>
                          <span className="text-sm text-gray-600">{answer.user?.name}</span>
                          <span className="text-gray-300">·</span>
                          <span className="text-sm text-gray-500">{formatDate(answer.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Answer */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-3">Tu respuesta</h4>
                    <textarea
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      placeholder="Comparte tu experiencia o consejo..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
                      rows={4}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleAddAnswer(selectedQuestion._id)}
                        disabled={submitting || !newAnswer.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Publicando...' : 'Publicar respuesta'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500/75 backdrop-blur-sm"
              onClick={() => setShowAskModal(false)}
            />
            <div className="relative w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Hacer una pregunta</h3>
                  <button
                    onClick={() => setShowAskModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateQuestion} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    placeholder="Ej: ¿Qué regalo le harían a un amante de los gatos?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    placeholder="Cuéntanos más detalles sobre tu pregunta..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.slice(1).map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setNewQuestion({ ...newQuestion, category: category.id })}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                          newQuestion.category === category.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl block mb-1">{category.emoji}</span>
                        <span className={`text-xs font-medium ${
                          newQuestion.category === category.id ? 'text-indigo-600' : 'text-gray-600'
                        }`}>
                          {category.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAskModal(false)}
                    className="px-6 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                  >
                    {submitting ? 'Publicando...' : 'Publicar pregunta'}
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

export default CommunityPage;
