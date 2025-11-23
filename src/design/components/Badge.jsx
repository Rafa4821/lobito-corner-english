/**
 * Badge Component
 * Etiqueta pequeña para estados y categorías
 */

import React from 'react';
import PropTypes from 'prop-types';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[var(--radius-full)] transition-colors duration-[var(--transition-fast)]';

  const variants = {
    default: 'bg-[var(--brand-bg-alt)] text-[var(--brand-text)] border border-[var(--brand-border)]',
    primary: 'bg-[var(--brand-primary)] text-white',
    secondary: 'bg-[var(--brand-secondary)] text-white',
    accent: 'bg-[var(--brand-accent)] text-white',
    success: 'bg-[var(--brand-success)] text-white',
    warning: 'bg-[var(--brand-warning)] text-white',
    error: 'bg-[var(--brand-error)] text-white',
    info: 'bg-[var(--brand-info)] text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Badge;
