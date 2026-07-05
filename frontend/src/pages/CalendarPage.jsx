import { useState, useEffect } from 'react';
import api from '../services/api';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    type: 'birthday',
    reminder: true,
    reminderDays: 7
  });

  const eventTypes = [
    { value: 'birthday', label: 'Cumpleaños', emoji: '🎂', color: 'pink' },
    { value: 'anniversary', label: 'Aniversario', emoji: '💕', color: 'purple' },
    { value: 'other', label: 'Otro', emoji: '🎉', color: 'indigo' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/calendar');
      setEvents(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar eventos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/calendar', newEvent);
      setEvents([...events, data]);
      setShowAddModal(false);
      setNewEvent({
        title: '',
        date: '',
        type: 'birthday',
        reminder: true,
        reminderDays: 7
      });
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('¿Eliminar este evento?')) return;
    try {
      await api.delete(`/calendar/${eventId}`);
      setEvents(events.filter(event => event._id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 p-2 border border-gray-100 cursor-pointer transition-all duration-200 hover:bg-indigo-50/50 ${
            isSelected ? 'bg-indigo-50 ring-2 ring-indigo-500' : 
            isToday ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : 'bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className={`text-sm font-medium ${
              isToday ? 'w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center' :
              isSelected ? 'text-indigo-600' : 'text-gray-700'
            }`}>
              {day}
            </span>
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className={`text-xs px-1.5 py-0.5 rounded truncate ${
                  event.type === 'birthday' ? 'bg-pink-100 text-pink-700' :
                  event.type === 'anniversary' ? 'bg-purple-100 text-purple-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <span className="text-xs text-gray-500">+{dayEvents.length - 2} más</span>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const upcomingEvents = events
    .filter(event => getDaysUntil(event.date) > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const selectedDateEvents = getEventsForDate(selectedDate);

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
              fetchEvents();
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendario Social</h1>
            <p className="text-gray-500 mt-1">Nunca olvides una fecha importante</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar evento
          </button>
        </div>

        <div className="flex gap-8">
          {/* Calendar */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Calendar Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h2>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 border-b border-gray-100">
                {dayNames.map(day => (
                  <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {renderCalendarDays()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Selected Date Events */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {selectedDate.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">Sin eventos este día</p>
                    <button
                      onClick={() => {
                        setNewEvent({ ...newEvent, date: selectedDate.toISOString().split('T')[0] });
                        setShowAddModal(true);
                      }}
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      + Agregar evento
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateEvents.map(event => {
                      const eventInfo = eventTypes.find(t => t.value === event.type) || eventTypes[2];
                      return (
                        <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{eventInfo.emoji}</span>
                            <div>
                              <p className="font-medium text-gray-900">{event.title}</p>
                              <p className="text-xs text-gray-500">{eventInfo.label}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Próximos eventos</h3>
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500">No hay eventos próximos</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map(event => {
                      const daysUntil = getDaysUntil(event.date);
                      const eventInfo = eventTypes.find(t => t.value === event.type) || eventTypes[2];
                      return (
                        <div key={event._id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${
                            daysUntil <= 7 ? 'bg-gradient-to-br from-red-400 to-pink-500' :
                            daysUntil <= 30 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                            'bg-gradient-to-br from-indigo-400 to-purple-500'
                          }`}>
                            <span className="text-white text-lg font-bold">{new Date(event.date).getDate()}</span>
                            <span className="text-white/80 text-[10px] uppercase">
                              {new Date(event.date).toLocaleDateString('es-PE', { month: 'short' })}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{event.title}</p>
                            <p className={`text-xs font-medium ${
                              daysUntil <= 7 ? 'text-red-500' :
                              daysUntil <= 30 ? 'text-amber-500' :
                              'text-gray-500'
                            }`}>
                              {daysUntil === 0 ? '¡Hoy!' :
                               daysUntil === 1 ? '¡Mañana!' :
                               `En ${daysUntil} días`}
                            </p>
                          </div>
                          <span className="text-lg">{eventInfo.emoji}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
                <h3 className="font-semibold mb-4">Tu calendario</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">{events.length}</p>
                    <p className="text-xs text-white/80">Eventos totales</p>
                  </div>
                  <div className="bg-white/20 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">{upcomingEvents.length}</p>
                    <p className="text-xs text-white/80">Próximos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500/75 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />

            <div className="relative w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden my-8">
              {/* Modal Header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Agregar evento</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleAddEvent} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del evento
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Ej: Cumpleaños de Andrea"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de evento
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {eventTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, type: type.value })}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                          newEvent.type === type.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{type.emoji}</span>
                        <span className={`text-xs font-medium ${
                          newEvent.type === type.value ? 'text-indigo-600' : 'text-gray-600'
                        }`}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reminder */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Recordatorio</p>
                      <p className="text-xs text-gray-500">Recibe una notificación antes del evento</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newEvent.reminder}
                      onChange={(e) => setNewEvent({ ...newEvent, reminder: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {newEvent.reminder && (
                  <div className="pl-4 border-l-2 border-indigo-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recordarme antes
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={newEvent.reminderDays}
                        onChange={(e) => setNewEvent({ ...newEvent, reminderDays: parseInt(e.target.value) })}
                        min="1"
                        max="30"
                        className="w-20 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                      />
                      <span className="text-sm text-gray-600">días antes</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Guardar evento
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

export default CalendarPage;
