import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options?: { value: string; label: string }[];
  children?: React.ReactNode;
}

/**
 * @description This component is used to display a select.
 * @param {SelectProps} props - The props for the Select component.
 * @param {string} label - The label of the Select component.
 * @param {string} error - The error of the Select component.
 * @param {boolean} fullWidth - Whether the Select should be full width.
 * @param {string} className - The className of the Select component.
 * @param {React.SelectHTMLAttributes<HTMLSelectElement>} props - The props for the Select component.
 * @returns {React.ReactNode} The Select component.
 */

export default function Select({
  label,
  error,
  fullWidth = true,
  options,
  children,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
          error 
            ? 'border-red-500 dark:border-red-400' 
            : 'border-gray-300 dark:border-gray-600'
        } ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {options ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

