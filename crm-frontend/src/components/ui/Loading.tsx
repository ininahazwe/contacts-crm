import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizeMap = {
    sm: { spinner: '24px', padding: '1rem' },
    md: { spinner: '40px', padding: '2rem' },
    lg: { spinner: '56px', padding: '3rem' },
  };

  const dimensions = sizeMap[size];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: dimensions.padding,
      }}
    >
      {/* Spinner animation */}
      <div
        style={{
          width: dimensions.spinner,
          height: dimensions.spinner,
          border: '3px solid var(--color-neutral-200)',
          borderTop: '3px solid var(--color-primary-500)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      
      {/* Texte optionnel */}
      {text && (
        <p
          style={{
            color: 'var(--color-neutral-600)',
            fontSize: '0.875rem',
            fontWeight: '600',
            margin: 0,
          }}
        >
          {text}
        </p>
      )}

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card"
          style={{
            height: '400px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Avatar skeleton */}
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '1rem',
              backgroundColor: 'var(--color-neutral-200)',
              animation: 'pulse 2s infinite',
            }}
          />

          {/* Title skeleton */}
          <div
            style={{
              height: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--color-neutral-200)',
              animation: 'pulse 2s infinite',
            }}
          />

          {/* Content skeleton */}
          {Array.from({ length: 3 }).map((_, j) => (
            <div
              key={j}
              style={{
                height: '0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--color-neutral-200)',
                animation: 'pulse 2s infinite',
              }}
            />
          ))}

          {/* Footer skeleton */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
            <div
              style={{
                flex: 1,
                height: '2.5rem',
                borderRadius: 'var(--radius-2xl)',
                backgroundColor: 'var(--color-neutral-200)',
                animation: 'pulse 2s infinite',
              }}
            />
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: 'var(--radius-2xl)',
                backgroundColor: 'var(--color-neutral-200)',
                animation: 'pulse 2s infinite',
              }}
            />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};
export { LoadingSpinner as Loading };