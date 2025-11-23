/**
 * Availability Config Page
 * Página de configuración de disponibilidad del profesor
 */

import React, { useState, useEffect } from 'react';
import { Card, Button } from '@design';
import { useAuth } from '@features/auth';
import { getTeacherAvailability, setTeacherAvailability } from '@features/bookings';
import AvailabilityConfig from '../components/AvailabilityConfig';
import { useNavigate } from 'react-router-dom';

const AvailabilityConfigPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, [user]);

  const loadAvailability = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { availability: data } = await getTeacherAvailability(user.uid);
      setAvailability(data);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (config) => {
    setSaving(true);

    try {
      const { error } = await setTeacherAvailability(user.uid, config);

      if (error) {
        alert('Error al guardar: ' + error);
        return;
      }

      alert('✅ Disponibilidad guardada correctamente');
      navigate('/teacher/calendar');
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card variant="outlined" padding="lg">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--brand-primary)] mx-auto mb-4"></div>
            <p className="text-[var(--brand-muted)]">Cargando configuración...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Configurar Disponibilidad</h1>
            <p className="text-[var(--brand-muted)]">
              Define tus horarios semanales y reglas de reserva
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/teacher/calendar')}>
            ← Volver al Calendario
          </Button>
        </div>
      </Card>

      {/* Info Banner */}
      <Card variant="outlined" padding="md">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1">
            <h3 className="font-bold mb-2">Información Importante</h3>
            <ul className="text-sm text-[var(--brand-muted)] space-y-1">
              <li>
                • Los cambios se aplicarán a todas las reservas futuras
              </li>
              <li>
                • Las reservas existentes no se verán afectadas
              </li>
              <li>
                • Los estudiantes verán tu disponibilidad actualizada inmediatamente
              </li>
              <li>
                • Puedes modificar tu configuración en cualquier momento
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Availability Config Component */}
      <AvailabilityConfig
        initialConfig={availability}
        onSave={handleSave}
        loading={saving}
      />

      {/* Preview Section */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-bold mb-4">Vista Previa</h3>
        <div className="space-y-4">
          <div className="p-4 bg-[var(--brand-bg-alt)] rounded-lg">
            <p className="text-sm text-[var(--brand-muted)] mb-3">
              Así verán los estudiantes tu disponibilidad:
            </p>
            <div className="grid grid-cols-7 gap-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => {
                const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                const hasAvailability = availability?.weeklySchedule[dayKeys[index]]?.length > 0;
                
                return (
                  <div
                    key={index}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center font-bold
                      ${hasAvailability 
                        ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                        : 'bg-gray-100 text-gray-400'
                      }
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {availability && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-600 mb-1">Duración de clase</p>
                <p className="text-2xl font-bold text-blue-700">
                  {availability.slotDuration} min
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-600 mb-1">Descanso entre clases</p>
                <p className="text-2xl font-bold text-purple-700">
                  {availability.bufferTime} min
                </p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-600 mb-1">Anticipación</p>
                <p className="text-2xl font-bold text-orange-700">
                  {availability.minAdvanceBooking}-{availability.maxAdvanceBooking} días
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tips */}
      <Card variant="outlined" padding="md">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📚</div>
          <div className="flex-1">
            <h3 className="font-bold mb-2">Consejos para Optimizar tu Disponibilidad</h3>
            <ul className="text-sm text-[var(--brand-muted)] space-y-2">
              <li>
                <strong>Bloques de tiempo:</strong> Agrupa tus clases en bloques para maximizar tu productividad
              </li>
              <li>
                <strong>Buffer time:</strong> Deja tiempo entre clases para prepararte y descansar
              </li>
              <li>
                <strong>Anticipación:</strong> Establece un mínimo de 24-48 horas para que los estudiantes reserven
              </li>
              <li>
                <strong>Cancelaciones:</strong> Permite cancelaciones con al menos 24 horas de anticipación
              </li>
              <li>
                <strong>Flexibilidad:</strong> Ofrece varios horarios para acomodar diferentes zonas horarias
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AvailabilityConfigPage;
