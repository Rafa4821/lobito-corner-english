/**
 * Stats Card Component
 * Tarjeta de estadística para dashboard
 */

import React from 'react';
import { Card } from '@design';
import PropTypes from 'prop-types';

const StatsCard = ({ icon, title, value, subtitle, trend, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-[var(--brand-primary)] to-[var(--brand-primary-dark)]',
    secondary: 'from-[var(--brand-secondary)] to-[var(--brand-secondary-dark)]',
    accent: 'from-[var(--brand-accent)] to-[var(--brand-accent-dark)]',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    error: 'from-red-500 to-red-600',
  };

  return (
    <Card variant="elevated" padding="lg" hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[var(--brand-muted)] mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-2">{value}</h3>
          {subtitle && (
            <p className="text-sm text-[var(--brand-muted)]">{subtitle}</p>
          )}
          {trend && (
            <div className={`text-sm mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white text-2xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

StatsCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  trend: PropTypes.shape({
    positive: PropTypes.bool,
    value: PropTypes.string,
  }),
  color: PropTypes.oneOf(['primary', 'secondary', 'accent', 'success', 'warning', 'error']),
};

export default StatsCard;
