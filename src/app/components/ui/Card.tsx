import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
  onClick?: () => void;
}
/**
 * @description This component is used to display a card.
 * @param {CardProps} props - The props for the Card component.
 * @param {React.ReactNode} children - The children of the Card component.
 * @param {string} className - The className of the Card component.
 * @param {boolean} padding - Whether the Card should have padding.
 * @param {boolean} hover - Whether the Card should have a hover effect.
 * @param {() => void} onClick - The function to call when the Card is clicked.
 * @returns {React.ReactNode} The Card component.
 */
export default function Card({
  children,
  className = '',
  padding = true,
  hover = false,
  onClick
}: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${
        padding ? 'p-4' : ''
      } ${
        hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

