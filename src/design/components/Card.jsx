/**
 * Card Component
 * Contenedor base para contenido
 */

import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-[var(--brand-surface)] rounded-[var(--radius-lg)] transition-all duration-[var(--transition-base)]';

  const variants = {
    default: 'border border-[var(--brand-border)] shadow-[var(--shadow-sm)]',
    elevated: 'shadow-[var(--shadow-md)]',
    outlined: 'border-2 border-[var(--brand-border)]',
    ghost: 'border border-transparent',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const hoverStyles = hover ? 'hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'ghost']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  hover: PropTypes.bool,
  className: PropTypes.string,
};

export default Card;
