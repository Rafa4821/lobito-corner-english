/**
 * Post Editor Component
 * Editor simple para crear y editar posts
 */

import React, { useState, useEffect } from 'react';
import { Input, Button, Badge } from '@design';
import PropTypes from 'prop-types';

const PostEditor = ({ initialData, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Tecnología',
    coverImage: '',
    featured: false,
    published: false,
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Tecnología',
    'Educación',
    'Programación',
    'Diseño',
    'Marketing',
    'Idiomas',
    'Otros',
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        category: initialData.category || 'Tecnología',
        coverImage: initialData.coverImage || '',
        featured: initialData.featured || false,
        published: initialData.published || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 10) {
      newErrors.title = 'El título debe tener al menos 10 caracteres';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es requerido';
    } else if (formData.content.length < 50) {
      newErrors.content = 'El contenido debe tener al menos 50 caracteres';
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    // Calcular tiempo de lectura (aproximado)
    const wordsPerMinute = 200;
    const wordCount = formData.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);

    onSave({
      ...formData,
      readTime,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <Input
        label="Título del post"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Escribe un título atractivo..."
        error={errors.title}
        fullWidth
        required
      />

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">
          Resumen (opcional)
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="Breve descripción del post..."
          rows={2}
          className="w-full px-4 py-2 border rounded-[var(--radius-md)] bg-[var(--brand-bg)] text-[var(--brand-text)] placeholder:text-[var(--brand-muted)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent border-[var(--brand-border)]"
        />
        <p className="text-xs text-[var(--brand-muted)] mt-1">
          Si no lo completas, se usará el inicio del contenido
        </p>
      </div>

      {/* Contenido */}
      <div>
        <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">
          Contenido *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Escribe el contenido de tu post aquí...&#10;&#10;Puedes usar saltos de línea para separar párrafos."
          rows={15}
          className="w-full px-4 py-3 border rounded-[var(--radius-md)] bg-[var(--brand-bg)] text-[var(--brand-text)] placeholder:text-[var(--brand-muted)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent border-[var(--brand-border)] font-mono text-sm"
        />
        {errors.content && (
          <p className="text-sm text-red-600 mt-1">{errors.content}</p>
        )}
        <p className="text-xs text-[var(--brand-muted)] mt-1">
          {formData.content.split(/\s+/).filter(w => w).length} palabras
        </p>
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium text-[var(--brand-text)] mb-2">
          Categoría *
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                formData.category === cat
                  ? 'bg-[var(--brand-primary)] text-white shadow-[var(--shadow-md)]'
                  : 'bg-[var(--brand-bg-alt)] text-[var(--brand-text)] hover:bg-[var(--brand-border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cover Image */}
      <Input
        label="URL de imagen de portada (opcional)"
        type="url"
        name="coverImage"
        value={formData.coverImage}
        onChange={handleChange}
        placeholder="https://ejemplo.com/imagen.jpg"
        fullWidth
      />

      {/* Opciones */}
      <div className="space-y-3 p-4 bg-[var(--brand-bg-alt)] rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-5 h-5 rounded border-[var(--brand-border)] text-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]"
          />
          <div>
            <span className="font-medium">Post destacado</span>
            <p className="text-sm text-[var(--brand-muted)]">
              Aparecerá en la sección de destacados
            </p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-5 h-5 rounded border-[var(--brand-border)] text-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]"
          />
          <div>
            <span className="font-medium">Publicar</span>
            <p className="text-sm text-[var(--brand-muted)]">
              {formData.published 
                ? 'El post será visible para todos' 
                : 'El post se guardará como borrador'}
            </p>
          </div>
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-[var(--brand-border)]">
        <Button 
          variant="primary" 
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Guardando...' : (initialData ? 'Actualizar Post' : 'Crear Post')}
        </Button>
        <Button 
          variant="ghost" 
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

PostEditor.propTypes = {
  initialData: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default PostEditor;
