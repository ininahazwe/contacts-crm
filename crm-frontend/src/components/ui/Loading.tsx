import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-neutral-600 font-semibold">Chargement...</p>
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 border-primary-200 rounded-full"></div>
        <div className="absolute inset-0 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};