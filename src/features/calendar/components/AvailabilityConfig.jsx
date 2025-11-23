/**
 * Availability Config Component
 * Configurador de disponibilidad semanal del profesor
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge } from '@design';
import PropTypes from 'prop-types';

const AvailabilityConfig = ({ initialConfig, onSave, loading = false }) => {
  const [config, setConfig] = useState({
    weeklySchedule: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    slotDuration: 60,
    bufferTime: 15,
    maxAdvanceBooking: 30,
    minAdvanceBooking: 1,
    allowCancellation: true,
    cancellationDeadline: 24,
    allowRescheduling: true,
    reschedulingDeadline: 24,
  });

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  const toggleDay = (day) => {
    setConfig((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]:
          prev.weeklySchedule[day].length > 0
            ? []
            : [{ start: '09:00', end: '17:00' }],
      },
    }));
  };

  const addTimeBlock = (day) => {
    setConfig((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: [...prev.weeklySchedule[day], { start: '09:00', end: '17:00' }],
      },
    }));
  };

  const removeTimeBlock = (day, index) => {
    setConfig((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: prev.weeklySchedule[day].filter((_, i) => i !== index),
      },
    }));
  };

  const updateTimeBlock = (day, index, field, value) => {
    setConfig((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: prev.weeklySchedule[day].map((block, i) =>
          i === index ? { ...block, [field]: value } : block
        ),
      },
    }));
  };

  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(config);
    }
  };

  const getTotalHoursPerWeek = () => {
    let total = 0;
    Object.values(config.weeklySchedule).forEach((blocks) => {
      blocks.forEach((block) => {
        const start = parseTime(block.start);
        const end = parseTime(block.end);
        total += (end - start) / 60;
      });
    });
    return total.toFixed(1);
  };

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Configurar Disponibilidad</h2>
            <p className="text-[var(--brand-muted)]">
              Define tus horarios semanales y reglas de reserva
            </p>
          </div>
          <Badge variant="primary" size="lg">
            {getTotalHoursPerWeek()}h/semana
          </Badge>
        </div>
      </Card>

      {/* Weekly Schedule */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-bold mb-4">Horarios Semanales</h3>

        <div className="space-y-4">
          {Object.entries(dayNames).map(([day, label]) => {
            const isActive = config.weeklySchedule[day].length > 0;

            return (
              <div key={day} className="border border-[var(--brand-border)] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => toggleDay(day)}
                      className="w-5 h-5 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                    />
                    <label className="font-medium">{label}</label>
                    {isActive && (
                      <Badge variant="success" size="sm">
                        {config.weeklySchedule[day].length} bloque
                        {config.weeklySchedule[day].length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  {isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTimeBlock(day)}
                    >
                      + Agregar Bloque
                    </Button>
                  )}
                </div>

                {isActive && (
                  <div className="space-y-2 ml-8">
                    {config.weeklySchedule[day].map((block, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Input
                          type="time"
                          value={block.start}
                          onChange={(e) =>
                            updateTimeBlock(day, index, 'start', e.target.value)
                          }
                          className="flex-1"
                        />
                        <span className="text-[var(--brand-muted)]">hasta</span>
                        <Input
                          type="time"
                          value={block.end}
                          onChange={(e) =>
                            updateTimeBlock(day, index, 'end', e.target.value)
                          }
                          className="flex-1"
                        />
                        {config.weeklySchedule[day].length > 1 && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeTimeBlock(day, index)}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Class Settings */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-bold mb-4">Configuración de Clases</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Duración de clase (minutos)
            </label>
            <select
              value={config.slotDuration}
              onChange={(e) => handleConfigChange('slotDuration', Number(e.target.value))}
              className="w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            >
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>60 minutos</option>
              <option value={90}>90 minutos</option>
              <option value={120}>120 minutos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tiempo entre clases (minutos)
            </label>
            <select
              value={config.bufferTime}
              onChange={(e) => handleConfigChange('bufferTime', Number(e.target.value))}
              className="w-full px-3 py-2 border border-[var(--brand-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            >
              <option value={0}>Sin descanso</option>
              <option value={15}>15 minutos</option>
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Booking Rules */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-bold mb-4">Reglas de Reserva</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Anticipación mínima (días)
              </label>
              <Input
                type="number"
                min="0"
                max="30"
                value={config.minAdvanceBooking}
                onChange={(e) =>
                  handleConfigChange('minAdvanceBooking', Number(e.target.value))
                }
              />
              <p className="text-xs text-[var(--brand-muted)] mt-1">
                Los estudiantes deben reservar con al menos este tiempo de anticipación
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Anticipación máxima (días)
              </label>
              <Input
                type="number"
                min="1"
                max="365"
                value={config.maxAdvanceBooking}
                onChange={(e) =>
                  handleConfigChange('maxAdvanceBooking', Number(e.target.value))
                }
              />
              <p className="text-xs text-[var(--brand-muted)] mt-1">
                Los estudiantes pueden reservar hasta este tiempo por adelantado
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--brand-border)] pt-4">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={config.allowCancellation}
                onChange={(e) =>
                  handleConfigChange('allowCancellation', e.target.checked)
                }
                className="w-5 h-5 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
              />
              <label className="font-medium">Permitir cancelaciones</label>
            </div>
            {config.allowCancellation && (
              <div className="ml-8">
                <label className="block text-sm font-medium mb-2">
                  Plazo mínimo para cancelar (horas)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="168"
                  value={config.cancellationDeadline}
                  onChange={(e) =>
                    handleConfigChange('cancellationDeadline', Number(e.target.value))
                  }
                />
                <p className="text-xs text-[var(--brand-muted)] mt-1">
                  Los estudiantes deben cancelar con al menos {config.cancellationDeadline}{' '}
                  horas de anticipación
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-[var(--brand-border)] pt-4">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={config.allowRescheduling}
                onChange={(e) =>
                  handleConfigChange('allowRescheduling', e.target.checked)
                }
                className="w-5 h-5 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
              />
              <label className="font-medium">Permitir reprogramaciones</label>
            </div>
            {config.allowRescheduling && (
              <div className="ml-8">
                <label className="block text-sm font-medium mb-2">
                  Plazo mínimo para reprogramar (horas)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="168"
                  value={config.reschedulingDeadline}
                  onChange={(e) =>
                    handleConfigChange('reschedulingDeadline', Number(e.target.value))
                  }
                />
                <p className="text-xs text-[var(--brand-muted)] mt-1">
                  Los estudiantes deben reprogramar con al menos{' '}
                  {config.reschedulingDeadline} horas de anticipación
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--brand-muted)]">
              Los cambios se aplicarán a todas las reservas futuras
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.history.back()}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

AvailabilityConfig.propTypes = {
  initialConfig: PropTypes.shape({
    weeklySchedule: PropTypes.object,
    slotDuration: PropTypes.number,
    bufferTime: PropTypes.number,
    maxAdvanceBooking: PropTypes.number,
    minAdvanceBooking: PropTypes.number,
    allowCancellation: PropTypes.bool,
    cancellationDeadline: PropTypes.number,
    allowRescheduling: PropTypes.bool,
    reschedulingDeadline: PropTypes.number,
  }),
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default AvailabilityConfig;
