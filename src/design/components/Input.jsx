/**
 * Input Component
 * Campo de entrada base reutilizable
 */

import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 border rounded-[var(--radius-md)] bg-[var(--brand-bg)] text-[var(--brand-text)] placeholder:text-[var(--brand-muted)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed';

  const errorStyles = error 
    ? 'border-[var(--brand-error)] focus:ring-[var(--brand-error)]' 
    : 'border-[var(--brand-border)]';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`flex flex-col gap-1 ${widthClass}`}>
      {label && (
        <label className="text-sm font-medium text-[var(--brand-text)]">
          {label}
          {required && <span className="text-[var(--brand-error)] ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`${baseStyles} ${errorStyles} ${widthClass} ${className}`}
        {...props}
      />
      
      {error && (
        <span className="text-sm text-[var(--brand-error)]">{error}</span>
      )}
      
      {helperText && !error && (
        <span className="text-sm text-[var(--brand-muted)]">{helperText}</span>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;
