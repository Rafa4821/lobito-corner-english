/**
 * Upload Form Component
 * Formulario para subir grabaciones
 */

import React, { useState } from 'react';
import { Input, Button } from '@design';
import { validateRecordingFile, formatFileSize } from '../services/storageService';
import PropTypes from 'prop-types';

const UploadForm = ({ onUpload, loading, students, products }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    productId: '',
    title: '',
    description: '',
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFormData((prev) => ({ ...prev, file: null }));
      return;
    }

    // Validar archivo
    const validation = validateRecordingFile(file);
    
    if (!validation.valid) {
      setErrors((prev) => ({ ...prev, file: validation.error }));
      setFormData((prev) => ({ ...prev, file: null }));
      return;
    }

    setFormData((prev) => ({ ...prev, file }));
    setErrors((prev) => ({ ...prev, file: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Selecciona un estudiante';
    }

    if (!formData.file) {
      newErrors.file = 'Selecciona un archivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    await onUpload(formData, setUploadProgress);
    
    // Reset form
    setFormData({
      studentId: '',
      productId: '',
      title: '',
      description: '',
      file: null,
    });
    setUploadProgress(0);
    
    // Reset file input
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Estudiante */}
      <div>
        <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">
          Estudiante *
        </label>
        <select
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2 border rounded-[var(--radius-md)] bg-[var(--brand-bg)] text-[var(--brand-text)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed border-[var(--brand-border)]"
        >
          <option value="">Selecciona un estudiante</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        {errors.studentId && (
          <p className="text-sm text-red-600 mt-1">{errors.studentId}</p>
        )}
      </div>

      {/* Clase (opcional) */}
      {products && products.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">
            Clase (opcional)
          </label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-2 border rounded-[var(--radius-md)] bg-[var(--brand-bg)] text-[var(--brand-text)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed border-[var(--brand-border)]"
          >
            <option value="">Selecciona una clase</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Título */}
      <Input
        label="Título (opcional)"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Ej: Clase de pronunciación - Sesión 1"
        disabled={loading}
        fullWidth
      />

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">
          Descripción (opcional)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Notas sobre la grabación..."
          rows={3}
          disabled={loading}
          className="w-full px-4 py-2 border rounded-[var(--radius-md)] bg-[var(--brand-bg)] text-[var(--brand-text)] placeholder:text-[var(--brand-muted)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed border-[var(--brand-border)]"
        />
      </div>

      {/* Archivo */}
      <div>
        <label className="block text-sm font-medium text-[var(--brand-text)] mb-1">
          Archivo *
        </label>
        <input
          id="file-input"
          type="file"
          accept="video/*,audio/*"
          onChange={handleFileChange}
          disabled={loading}
          className="w-full px-4 py-2 border rounded-[var(--radius-md)] bg-[var(--brand-bg)] text-[var(--brand-text)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed border-[var(--brand-border)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--brand-primary)] file:text-white hover:file:bg-[var(--brand-primary-dark)] file:cursor-pointer"
        />
        {formData.file && (
          <p className="text-sm text-[var(--brand-muted)] mt-1">
            📦 {formData.file.name} ({formatFileSize(formData.file.size)})
          </p>
        )}
        {errors.file && (
          <p className="text-sm text-red-600 mt-1">{errors.file}</p>
        )}
        <p className="text-xs text-[var(--brand-muted)] mt-1">
          Formatos: MP4, WebM, MOV, MP3, WAV. Máximo 500 MB.
        </p>
      </div>

      {/* Progress bar */}
      {loading && uploadProgress > 0 && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Subiendo...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-[var(--brand-bg-alt)] rounded-full h-2">
            <div 
              className="bg-[var(--brand-primary)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <Button 
        variant="primary" 
        type="submit"
        loading={loading}
        disabled={loading}
        fullWidth
      >
        {loading ? 'Subiendo...' : '📤 Subir Grabación'}
      </Button>
    </form>
  );
};

UploadForm.propTypes = {
  onUpload: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  students: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
};

export default UploadForm;
