/**
 * Section Component
 * Contenedor de sección con espaciado consistente
 */

import React from 'react';
import PropTypes from 'prop-types';

const Section = ({
  children,
  spacing = 'md',
  maxWidth = 'xl',
  centered = false,
  className = '',
  ...props
}) => {
  const spacings = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  };

  const maxWidths = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const centerClass = centered ? 'mx-auto' : '';

  return (
    <section
      className={`${spacings[spacing]} ${className}`}
      {...props}
    >
      <div className={`${maxWidths[maxWidth]} ${centerClass} px-4 sm:px-6 lg:px-8`}>
        {children}
      </div>
    </section>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
  spacing: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  centered: PropTypes.bool,
  className: PropTypes.string,
};

export default Section;
