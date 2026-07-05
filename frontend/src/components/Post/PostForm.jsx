import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import Avatar from '../Common/Avatar';

const postSchema = z.object({
  description: z.string().max(2000).optional(),
  occasion: z.enum(['birthday', 'wedding', 'anniversary', 'graduation', 'christmas', 'mothers_day', 'valentines', 'other']).optional(),
  giftProduct: z.string().max(200).optional()
});

const occasions = [
  { value: 'other', label: 'Seleccionar ocasión', emoji: '🎉', color: 'gray' },
  { value: 'birthday', label: 'Cumpleaños', emoji: '🎂', color: 'pink' },
  { value: 'wedding', label: 'Boda', emoji: '💒', color: 'purple' },
  { value: 'anniversary', label: 'Aniversario', emoji: '💕', color: 'rose' },
  { value: 'graduation', label: 'Graduación', emoji: '🎓', color: 'blue' },
  { value: 'christmas', label: 'Navidad', emoji: '🎄', color: 'green' },
  { value: 'mothers_day', label: 'Día de la Madre', emoji: '👩', color: 'pink' },
  { value: 'valentines', label: 'San Valentín', emoji: '💝', color: 'red' }
];

const PostForm = ({ onSuccess }) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOccasionPicker, setShowOccasionPicker] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      occasion: 'other'
    }
  });

  const description = watch('description', '');
  const selectedOccasion = watch('occasion', 'other');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert('Máximo 5 imágenes permitidas');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length + images.length > 5) {
        alert('Máximo 5 imágenes permitidas');
        return;
      }
      const newImages = [...images, ...files];
      setImages(newImages);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const selectOccasion = (value) => {
    setValue('occasion', value);
    setShowOccasionPicker(false);
  };

  const getSelectedOccasion = () => {
    return occasions.find(o => o.value === selectedOccasion) || occasions[0];
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      alert('Agrega al menos una imagen');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      images.forEach(image => formData.append('images', image));
      if (data.description) formData.append('description', data.description);
      if (data.occasion && data.occasion !== 'other') formData.append('occasion', data.occasion);
      if (data.giftProduct) formData.append('giftProduct', data.giftProduct);

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      reset();
      setImages([]);
      setPreviews([]);
      if (onSuccess) onSuccess();
      navigate('/feed');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error al crear la publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* User Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center space-x-3">
          <Avatar src={user?.avatar?.secure_url} size="md" />
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowOccasionPicker(!showOccasionPicker)}
                className="flex items-center space-x-1.5 px-3 py-1 mt-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span>{getSelectedOccasion().emoji}</span>
                <span className="text-gray-700">{getSelectedOccasion().label}</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Occasion Picker Dropdown */}
              {showOccasionPicker && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Seleccionar ocasión</p>
                  {occasions.map((occasion) => (
                    <button
                      key={occasion.value}
                      type="button"
                      onClick={() => selectOccasion(occasion.value)}
                      className={`w-full px-4 py-2.5 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                        selectedOccasion === occasion.value ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <span className="text-xl">{occasion.emoji}</span>
                      <span className={`text-sm ${selectedOccasion === occasion.value ? 'font-medium text-indigo-600' : 'text-gray-700'}`}>
                        {occasion.label}
                      </span>
                      {selectedOccasion === occasion.value && (
                        <svg className="w-4 h-4 text-indigo-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <textarea
          {...register('description')}
          placeholder="¿Qué momento especial quieres compartir? Cuenta la historia detrás de este regalo..."
          className="w-full text-lg text-gray-800 placeholder-gray-400 border-0 focus:ring-0 focus:outline-none resize-none min-h-[120px]"
          rows={5}
        />
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className={`text-sm ${description.length > 1800 ? 'text-red-500' : 'text-gray-400'}`}>
            {description.length}/2000
          </span>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Fotos
          <span className="ml-auto text-sm font-normal text-gray-400">{images.length}/5</span>
        </h3>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-50' 
              : images.length > 0 
                ? 'border-gray-200 hover:border-gray-300' 
                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
          
          {images.length === 0 ? (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Arrastra tus fotos aquí</p>
                <p className="text-sm text-gray-500 mt-1">o haz clic para seleccionar</p>
              </div>
              <p className="text-xs text-gray-400">PNG, JPG, GIF hasta 10MB cada una</p>
            </div>
          ) : (
            <div className="space-y-3">
              <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm text-gray-500">Agregar más fotos</p>
            </div>
          )}
        </div>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group aspect-square rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:text-white shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700 shadow-lg">
                    Portada
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gift Product */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-xl mr-2">🎁</span>
          ¿Qué regalo utilizaste?
          <span className="ml-2 text-xs font-normal text-gray-400">(Opcional)</span>
        </h3>
        <div className="relative">
          <input
            type="text"
            {...register('giftProduct')}
            placeholder="Ej: Taza personalizada, Botella grabada, Caja Premium..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Al agregar el producto, otros usuarios podrán ver qué regalo utilizaste y personalizarlo
        </p>
      </div>

      {/* Submit Button */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Foto</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Video</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || images.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Publicando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Publicar
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
