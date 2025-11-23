/**
 * Booking Modal Component
 * Modal para crear/editar reservas
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '@design';
import PropTypes from 'prop-types';

const BookingModal = ({
  isOpen,
  onClose,
  onConfirm,
  booking = null,
  selectedDate,
  selectedTime,
  products = [],
  teacherName,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    productId: '',
    productTitle: '',
    notes: '',
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        productId: booking.productId || '',
        productTitle: booking.productTitle || '',
        notes: booking.notes || '',
      });
    } else {
      setFormData({
        productId: '',
        productTitle: '',
        notes: '',
      });
    }
  }, [booking]);

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p.id === productId);
    setFormData({
      ...formData,
      productId,
      productTitle: product?.title || '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onConfirm) {
      onConfirm({
        ...formData,
        date: selectedDate,
        time: selectedTime,
      });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateEndTime = (startTime, duration = 60) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card variant="elevated" padding="none" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-6 border-b border-[var(--brand-border)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {booking ? 'Editar Reserva' : 'Nueva Reserva'}
                </h2>
                <p className="text-[var(--brand-muted)]">
                  Completa los detalles de tu clase
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-[var(--brand-muted)] hover:text-[var(--brand-text)] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Booking Summary */}
            <div className="bg-[var(--brand-bg-alt)] rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>📅</span>
                Resumen de la Reserva
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--brand-muted)]">Fecha:</span>
                  <span className="font-medium">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--brand-muted)]">Hora:</span>
                  <span className="font-medium">
                    {selectedTime} - {calculateEndTime(selectedTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--brand-muted)]">Duración:</span>
                  <span className="font-medium">60 minutos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--brand-muted)]">Profesor:</span>
                  <span className="font-medium">{teacherName}</span>
                </div>
              </div>
            </div>

            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipo de Clase <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.productId}
                onChange={handleProductChange}
                required
                className="w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              >
                <option value="">Selecciona una clase</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.title} {product.duration && `(${product.duration} min)`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[var(--brand-muted)] mt-1">
                Elige el tipo de clase que deseas reservar
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Notas o comentarios (opcional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Ej: Quiero enfocarme en conversación..."
                className="w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] resize-none"
              />
              <p className="text-xs text-[var(--brand-muted)] mt-1">
                Comparte cualquier información relevante para tu clase
              </p>
            </div>

            {/* Important Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2">Información Importante</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Puedes cancelar o reprogramar con 24 horas de anticipación</li>
                    <li>• Recibirás un recordatorio por email 1 día antes</li>
                    <li>• El profesor te contactará si hay algún cambio</li>
                    <li>• La clase se agregará a tu calendario</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
              />
              <label className="text-sm text-[var(--brand-muted)]">
                Acepto las{' '}
                <a href="#" className="text-[var(--brand-primary)] hover:underline">
                  políticas de cancelación
                </a>{' '}
                y confirmo que asistiré a la clase en el horario seleccionado
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--brand-border)] bg-[var(--brand-bg-alt)]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--brand-muted)]">
                <strong>Nota:</strong> La reserva quedará confirmada inmediatamente
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading || !formData.productId}
                >
                  {loading ? 'Confirmando...' : booking ? 'Actualizar Reserva' : 'Confirmar Reserva'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

BookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  booking: PropTypes.object,
  selectedDate: PropTypes.string,
  selectedTime: PropTypes.string,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      duration: PropTypes.number,
    })
  ),
  teacherName: PropTypes.string,
  loading: PropTypes.bool,
};

export default BookingModal;
