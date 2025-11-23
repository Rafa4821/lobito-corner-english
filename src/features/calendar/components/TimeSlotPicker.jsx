/**
 * Time Slot Picker Component
 * Selector de horarios disponibles
 */

import React from 'react';
import { Card, Button, Badge } from '@design';
import PropTypes from 'prop-types';

const TimeSlotPicker = ({ date, slots = [], selectedSlot, onSlotSelect, loading = false }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card variant="outlined" padding="lg">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--brand-muted)]">Cargando horarios...</p>
        </div>
      </Card>
    );
  }

  if (!date) {
    return (
      <Card variant="outlined" padding="lg">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📅</div>
          <p className="text-[var(--brand-muted)]">Selecciona una fecha en el calendario</p>
        </div>
      </Card>
    );
  }

  if (slots.length === 0) {
    return (
      <Card variant="outlined" padding="lg">
        <h3 className="font-bold mb-4">{formatDate(date)}</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🚫</div>
          <p className="text-[var(--brand-muted)]">No hay horarios disponibles para este día</p>
        </div>
      </Card>
    );
  }

  const availableSlots = slots.filter((slot) => slot.available);
  const unavailableSlots = slots.filter((slot) => !slot.available);

  return (
    <Card variant="outlined" padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">{formatDate(date)}</h3>
        <Badge variant="primary">
          {availableSlots.length} disponible{availableSlots.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Available Slots */}
      {availableSlots.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-[var(--brand-muted)] mb-3">Horarios disponibles:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableSlots.map((slot, index) => (
              <Button
                key={index}
                variant={selectedSlot === slot.start ? 'primary' : 'outline'}
                size="sm"
                fullWidth
                onClick={() => onSlotSelect(slot.start)}
              >
                {slot.start} - {slot.end}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Unavailable Slots */}
      {unavailableSlots.length > 0 && (
        <div>
          <p className="text-sm text-[var(--brand-muted)] mb-3">Horarios ocupados:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {unavailableSlots.map((slot, index) => (
              <div
                key={index}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-400 text-sm text-center border border-gray-200"
              >
                {slot.start} - {slot.end}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

TimeSlotPicker.propTypes = {
  date: PropTypes.string,
  slots: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      available: PropTypes.bool.isRequired,
    })
  ),
  selectedSlot: PropTypes.string,
  onSlotSelect: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default TimeSlotPicker;
