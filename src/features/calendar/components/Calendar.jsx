/**
 * Calendar Component
 * Calendario mensual interactivo
 */

import React, { useState, useMemo } from 'react';
import { Card, Button, Badge } from '@design';
import PropTypes from 'prop-types';

const Calendar = ({ events = [], onDateClick, onEventClick, highlightedDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Obtener días del mes
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Días del mes siguiente
    const remainingDays = 42 - days.length; // 6 semanas * 7 días
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    return events.filter((event) => event.date === dateStr);
  };

  const isHighlighted = (date) => {
    const dateStr = formatDate(date);
    return highlightedDates.includes(dateStr);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDayClick = (dayInfo) => {
    if (dayInfo.isCurrentMonth && onDateClick) {
      onDateClick(dayInfo.date);
    }
  };

  return (
    <Card variant="elevated" padding="lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            ←
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoy
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            →
          </Button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-sm font-medium text-[var(--brand-muted)]">
            {name}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((dayInfo, index) => {
          const dayEvents = getEventsForDate(dayInfo.date);
          const highlighted = isHighlighted(dayInfo.date);
          const today = isToday(dayInfo.date);

          return (
            <div
              key={index}
              onClick={() => handleDayClick(dayInfo)}
              className={`
                min-h-[80px] p-2 rounded-lg border transition-all cursor-pointer
                ${
                  dayInfo.isCurrentMonth
                    ? 'bg-white hover:bg-[var(--brand-bg-alt)] border-[var(--brand-border)]'
                    : 'bg-[var(--brand-bg-alt)] border-transparent text-[var(--brand-muted)]'
                }
                ${today ? 'ring-2 ring-[var(--brand-primary)]' : ''}
                ${highlighted ? 'bg-blue-50 border-blue-200' : ''}
              `}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      today ? 'text-[var(--brand-primary)] font-bold' : ''
                    }`}
                  >
                    {dayInfo.day}
                  </span>
                  {dayEvents.length > 0 && (
                    <Badge variant="primary" size="sm">
                      {dayEvents.length}
                    </Badge>
                  )}
                </div>

                {/* Events */}
                <div className="flex-1 space-y-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((event, idx) => (
                    <div
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick && onEventClick(event);
                      }}
                      className={`
                        text-xs p-1 rounded truncate
                        ${
                          event.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                        hover:opacity-80 transition-opacity
                      `}
                    >
                      {event.time} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-[var(--brand-muted)] text-center">
                      +{dayEvents.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-[var(--brand-border)]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
          <span className="text-sm text-[var(--brand-muted)]">Confirmada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200"></div>
          <span className="text-sm text-[var(--brand-muted)]">Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded ring-2 ring-[var(--brand-primary)]"></div>
          <span className="text-sm text-[var(--brand-muted)]">Hoy</span>
        </div>
      </div>
    </Card>
  );
};

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      status: PropTypes.string,
    })
  ),
  onDateClick: PropTypes.func,
  onEventClick: PropTypes.func,
  highlightedDates: PropTypes.arrayOf(PropTypes.string),
};

export default Calendar;
