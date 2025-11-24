import React from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  footer?: React.ReactNode;
  scrollable?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '3xl',
  footer,
  scrollable = true
}: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl ${maxWidthClasses[maxWidth]} w-full my-8 animate-in fade-in zoom-in duration-200 ${footer ? 'flex flex-col max-h-[85vh]' : ''}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              {subtitle && (
                <p className="text-white/80 text-sm mt-1">{subtitle}</p>
              )}
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="p-2 hover:bg-white/20"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className={`p-6 ${footer ? 'overflow-y-auto flex-1' : scrollable ? 'max-h-[70vh] overflow-y-auto' : ''}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 rounded-b-2xl flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

