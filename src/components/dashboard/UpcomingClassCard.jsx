/**
 * Upcoming Class Card Component
 * Tarjeta de próxima clase para estudiantes
 */

import React, { useState } from 'react';
import { Card, Button, Badge } from '@design';
import { formatDate } from '@/utils';
import PropTypes from 'prop-types';

const UpcomingClassCard = ({ booking, onReschedule, onCancel, canReschedule, canCancel }) => {
  const [showActions, setShowActions] = useState(false);

  const getTimeUntilClass = () => {
    const now = new Date();
    const classDate = new Date(`${booking.date} ${booking.time}`);
    const diff = classDate - now;
    
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

  const getStatusColor = () => {
    const colors = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'error',
    };
    return colors[booking.status] || 'default';
  };

  const getStatusText = () => {
    const texts = {
      confirmed: 'Confirmada',
      pending: 'Pendiente',
      cancelled: 'Cancelada',
    };
    return texts[booking.status] || booking.status;
  };

  return (
    <Card variant="elevated" padding="lg" hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg">
                {booking.productTitle || 'Clase Individual'}
              </h3>
              <Badge variant={getStatusColor()} size="sm">
                {getStatusText()}
              </Badge>
            </div>
            <p className="text-sm text-[var(--brand-muted)]">
              Con {booking.teacherName}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl mb-1">📅</div>
            <p className="text-xs text-[var(--brand-muted)]">
              {getTimeUntilClass()}
            </p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-[var(--brand-bg-alt)] rounded-lg">
          <div>
            <p className="text-xs text-[var(--brand-muted)] mb-1">Fecha</p>
            <p className="font-medium">{formatDate(booking.date)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--brand-muted)] mb-1">Hora</p>
            <p className="font-medium">{booking.time}</p>
          </div>
        </div>

        {/* Duration */}
        {booking.duration && (
          <div className="flex items-center gap-2 text-sm text-[var(--brand-muted)]">
            <span>⏱️</span>
            <span>{booking.duration} minutos</span>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> {booking.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        {booking.status === 'confirmed' && (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => setShowActions(!showActions)}
            >
              {showActions ? '▲ Ocultar opciones' : '▼ Opciones de la clase'}
            </Button>

            {showActions && (
              <div className="flex gap-2">
                {canReschedule && (
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => onReschedule(booking)}
                  >
                    📅 Reprogramar
                  </Button>
                )}
                {canCancel && (
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    onClick={() => onCancel(booking)}
                  >
                    ❌ Cancelar
                  </Button>
                )}
              </div>
            )}

            {!canReschedule && !canCancel && showActions && (
              <p className="text-xs text-[var(--brand-muted)] text-center p-2">
                No se puede modificar esta clase (menos de 24h)
              </p>
            )}
          </div>
        )}

        {/* Cancelled info */}
        {booking.status === 'cancelled' && booking.cancellationReason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Cancelada:</strong> {booking.cancellationReason}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

UpcomingClassCard.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.string.isRequired,
    productTitle: PropTypes.string,
    teacherName: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    duration: PropTypes.number,
    status: PropTypes.string.isRequired,
    notes: PropTypes.string,
    cancellationReason: PropTypes.string,
  }).isRequired,
  onReschedule: PropTypes.func,
  onCancel: PropTypes.func,
  canReschedule: PropTypes.bool,
  canCancel: PropTypes.bool,
};

export default UpcomingClassCard;
