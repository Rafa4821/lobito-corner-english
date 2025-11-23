/**
 * Logo Component
 * Componente placeholder preparado para reemplazo fácil
 * Cambiar solo este archivo cuando llegue la identidad visual
 */

import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({ 
  variant = 'full', 
  size = 'md', 
  className = '' 
}) => {
  const sizes = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16',
  };

  const sizeClass = sizes[size] || sizes.md;

  // Placeholder temporal - reemplazar con logo real
  if (variant === 'icon') {
    return (
      <div 
        className={`${sizeClass} aspect-square rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center ${className}`}
        aria-label="Logo"
      >
        <span className="text-white font-bold text-xl">LC</span>
      </div>
    );
  }

  // Variant 'full' con texto
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className={`${sizeClass} aspect-square rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center`}
        aria-label="Logo"
      >
        <span className="text-white font-bold text-xl">LC</span>
      </div>
      {variant === 'full' && (
        <span className="text-[var(--brand-text)] font-bold text-xl">
          Lobito Corner
        </span>
      )}
    </div>
  );
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['full', 'icon']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

export default Logo;
