import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helpText,
      icon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'flex items-center gap-2 rounded-lg border-2 border-stone-200 bg-white px-4 py-2 transition-all duration-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20';

    const inputStyles =
      'flex-1 bg-transparent outline-none text-stone-900 placeholder-stone-400 disabled:text-stone-400 disabled:cursor-not-allowed';

    const errorStyles = error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' : '';
    const disabledStyles = disabled ? 'bg-stone-50 opacity-60' : '';

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-stone-700">
            {label}
          </label>
        )}
        <div className={`${baseStyles} ${errorStyles} ${disabledStyles}`}>
          {icon && <span className="text-stone-400">{icon}</span>}
          <input
            ref={ref}
            disabled={disabled}
            className={`${inputStyles} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}
        {helpText && !error && (
          <p className="text-sm text-stone-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
