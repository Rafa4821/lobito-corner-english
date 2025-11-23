/**
 * Logo Component
 * Logo oficial de Lobito Corner
 */

import React from 'react';
import PropTypes from 'prop-types';

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/lc-english-e52c2.firebasestorage.app/o/WhatsApp_Image_2025-11-22_at_10.39.37_PM-removebg-preview.png?alt=media&token=68a2d6c0-8aaf-4510-a84c-8614786dfee7';

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

  // Variant solo icono
  if (variant === 'icon') {
    return (
      <img 
        src={LOGO_URL}
        alt="Lobito Corner Logo"
        className={`${sizeClass} w-auto object-contain ${className}`}
      />
    );
  }

  // Variant 'full' con texto
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={LOGO_URL}
        alt="Lobito Corner Logo"
        className={`${sizeClass} w-auto object-contain`}
      />
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
