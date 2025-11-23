/**
 * Recent Activity Component
 * Actividad reciente para dashboard
 */

import React from 'react';
import { Card, Badge } from '@design';
import { formatDate } from '@/utils';
import PropTypes from 'prop-types';

const RecentActivity = ({ activities, loading }) => {
  const getActivityIcon = (type) => {
    const icons = {
      booking: '📅',
      message: '💬',
      recording: '🎥',
      blog: '📝',
      student: '👤',
    };
    return icons[type] || '📌';
  };

  const getActivityColor = (type) => {
    const colors = {
      booking: 'primary',
      message: 'accent',
      recording: 'secondary',
      blog: 'info',
      student: 'success',
    };
    return colors[type] || 'default';
  };

  if (loading) {
    return (
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-[var(--brand-bg-alt)] rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[var(--brand-bg-alt)] rounded w-3/4" />
                <div className="h-3 bg-[var(--brand-bg-alt)] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg">
      <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
      {activities.length === 0 ? (
        <p className="text-center text-[var(--brand-muted)] py-8">
          No hay actividad reciente
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 pb-3 border-b border-[var(--brand-border)] last:border-0 last:pb-0">
              <div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{activity.title}</p>
                <p className="text-sm text-[var(--brand-muted)] truncate">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getActivityColor(activity.type)} size="sm">
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-[var(--brand-muted)]">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

RecentActivity.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
  })).isRequired,
  loading: PropTypes.bool,
};

export default RecentActivity;
