/**
 * Event Details Modal Component
 * Modal con detalles completos del evento/reserva
 */

import React from 'react';
import { Card, Button, Badge } from '@design';
import PropTypes from 'prop-types';

const EventDetailsModal = ({
  isOpen,
  onClose,
  event,
  onEdit,
  onCancel,
  onReschedule,
  canEdit = false,
  canCancel = false,
  canReschedule = false,
  loading = false,
}) => {
  if (!isOpen || !event) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    return timeStr;
  };

  const calculateEndTime = (startTime, duration = 60) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      confirmed: {
        variant: 'success',
        label: 'Confirmada',
        icon: '✅',
        color: 'text-green-600',
      },
      pending: {
        variant: 'warning',
        label: 'Pendiente',
        icon: '⏳',
        color: 'text-yellow-600',
      },
      cancelled: {
        variant: 'error',
        label: 'Cancelada',
        icon: '❌',
        color: 'text-red-600',
      },
      completed: {
        variant: 'default',
        label: 'Completada',
        icon: '✔️',
        color: 'text-blue-600',
      },
    };
    return statusMap[status] || statusMap.confirmed;
  };

  const statusInfo = getStatusInfo(event.status);

  const getTimeUntilClass = () => {
    const now = new Date();
    const classDate = new Date(`${event.date} ${event.time}`);
    const diff = classDate - now;
    
    if (diff < 0) return 'Clase pasada';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `En ${days} ${days === 1 ? 'día' : 'días'}`;
    } else if (hours > 0) {
      return `En ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      return 'Próximamente';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card variant="elevated" padding="none" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[var(--brand-border)] bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default" className="bg-white text-[var(--brand-primary)]">
                  {statusInfo.label}
                </Badge>
                {event.status === 'confirmed' && (
                  <span className="text-sm opacity-90">{getTimeUntilClass()}</span>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {event.productTitle || event.title || 'Clase Individual'}
              </h2>
              <p className="opacity-90">
                {event.teacherName && `Con ${event.teacherName}`}
                {event.studentName && `Con ${event.studentName}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
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
          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--brand-bg-alt)] rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📅</span>
                <span className="text-sm text-[var(--brand-muted)]">Fecha</span>
              </div>
              <p className="font-bold">{formatDate(event.date)}</p>
            </div>

            <div className="p-4 bg-[var(--brand-bg-alt)] rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⏰</span>
                <span className="text-sm text-[var(--brand-muted)]">Horario</span>
              </div>
              <p className="font-bold">
                {formatTime(event.time)} - {calculateEndTime(event.time, event.duration)}
              </p>
              {event.duration && (
                <p className="text-sm text-[var(--brand-muted)] mt-1">
                  Duración: {event.duration} minutos
                </p>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {event.productTitle && (
              <div>
                <p className="text-sm text-[var(--brand-muted)] mb-1">Tipo de clase:</p>
                <p className="font-medium">{event.productTitle}</p>
              </div>
            )}

            {event.notes && (
              <div>
                <p className="text-sm text-[var(--brand-muted)] mb-1">Notas:</p>
                <div className="p-3 bg-[var(--brand-bg-alt)] rounded-lg">
                  <p className="text-sm">{event.notes}</p>
                </div>
              </div>
            )}

            {event.status === 'cancelled' && event.cancellationReason && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900 mb-1">Razón de cancelación:</p>
                <p className="text-sm text-red-800">{event.cancellationReason}</p>
                {event.cancelledBy && (
                  <p className="text-xs text-red-600 mt-2">
                    Cancelada por: {event.cancelledBy === event.studentId ? 'Estudiante' : 'Profesor'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Participants */}
          {(event.teacherName || event.studentName) && (
            <div>
              <p className="text-sm text-[var(--brand-muted)] mb-3">Participantes:</p>
              <div className="space-y-2">
                {event.teacherName && (
                  <div className="flex items-center gap-3 p-3 bg-[var(--brand-bg-alt)] rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-secondary)] to-[var(--brand-accent)] flex items-center justify-center text-white font-bold">
                      {event.teacherName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{event.teacherName}</p>
                      <p className="text-sm text-[var(--brand-muted)]">Profesor</p>
                    </div>
                  </div>
                )}
                {event.studentName && (
                  <div className="flex items-center gap-3 p-3 bg-[var(--brand-bg-alt)] rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white font-bold">
                      {event.studentName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{event.studentName}</p>
                      <p className="text-sm text-[var(--brand-muted)]">Estudiante</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-[var(--brand-border)]">
            <div className="grid grid-cols-2 gap-4 text-sm text-[var(--brand-muted)]">
              {event.createdAt && (
                <div>
                  <p className="mb-1">Creada:</p>
                  <p className="font-medium text-[var(--brand-text)]">
                    {new Date(event.createdAt.seconds * 1000).toLocaleDateString('es-AR')}
                  </p>
                </div>
              )}
              {event.id && (
                <div>
                  <p className="mb-1">ID de reserva:</p>
                  <p className="font-mono text-xs text-[var(--brand-text)]">
                    {event.id.substring(0, 8)}...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {event.status === 'confirmed' && (canEdit || canCancel || canReschedule) && (
          <div className="p-6 border-t border-[var(--brand-border)] bg-[var(--brand-bg-alt)]">
            <div className="flex flex-wrap gap-3">
              {canEdit && onEdit && (
                <Button
                  variant="outline"
                  onClick={() => onEdit(event)}
                  disabled={loading}
                >
                  ✏️ Editar
                </Button>
              )}
              {canReschedule && onReschedule && (
                <Button
                  variant="secondary"
                  onClick={() => onReschedule(event)}
                  disabled={loading}
                >
                  📅 Reprogramar
                </Button>
              )}
              {canCancel && onCancel && (
                <Button
                  variant="danger"
                  onClick={() => onCancel(event)}
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? 'Cancelando...' : '❌ Cancelar Clase'}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="ml-auto"
              >
                Cerrar
              </Button>
            </div>
            
            {!canCancel && !canReschedule && (
              <p className="text-xs text-[var(--brand-muted)] mt-3">
                No puedes modificar esta clase (menos de 24 horas de anticipación)
              </p>
            )}
          </div>
        )}

        {event.status !== 'confirmed' && (
          <div className="p-6 border-t border-[var(--brand-border)] bg-[var(--brand-bg-alt)]">
            <Button variant="outline" onClick={onClose} fullWidth>
              Cerrar
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

EventDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    productTitle: PropTypes.string,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    duration: PropTypes.number,
    status: PropTypes.string.isRequired,
    teacherName: PropTypes.string,
    studentName: PropTypes.string,
    notes: PropTypes.string,
    cancellationReason: PropTypes.string,
    cancelledBy: PropTypes.string,
    createdAt: PropTypes.object,
  }),
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  onReschedule: PropTypes.func,
  canEdit: PropTypes.bool,
  canCancel: PropTypes.bool,
  canReschedule: PropTypes.bool,
  loading: PropTypes.bool,
};

export default EventDetailsModal;
