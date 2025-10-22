import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  totalDocs: number;
  pageSize: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasPrevPage,
  hasNextPage,
  totalDocs,
  pageSize,
}) => {
  // Calculer le range d'items affichés
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalDocs);

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxPagesToShow) {
      if (currentPage <= 4) {
        endPage = maxPagesToShow;
      } else if (currentPage >= totalPages - 3) {
        startPage = totalPages - (maxPagesToShow - 1);
      } else {
        startPage = currentPage - 3;
        endPage = currentPage + 3;
      }
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: 'var(--radius-3xl)',
        boxShadow: 'var(--shadow-card)',
        border: '2px solid var(--color-neutral-100)',
      }}
    >
      {/* Informations de pagination */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            style={{
              color: 'var(--color-neutral-600)',
              fontSize: '0.875rem',
              margin: 0,
            }}
          >
            Affichage de {startItem} à {endItem} sur {totalDocs} résultats
          </p>
        </div>

        {/* Navigation pagination */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {/* Bouton précédent */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="btn-secondary"
            style={{
              padding: '0.625rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: hasPrevPage ? 1 : 0.5,
              cursor: hasPrevPage ? 'pointer' : 'not-allowed',
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span style={{ display: 'none' }} className="sm:inline">
              Précédent
            </span>
          </button>

          {/* Numéros de page */}
          <div
            style={{
              display: 'flex',
              gap: '0.25rem',
              alignItems: 'center',
            }}
          >
            {pageNumbers.map((page, index) => (
              <button
                key={`${page}-${index}`}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={page === '...'}
                style={{
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-2xl)',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  cursor: page === '...' ? 'default' : 'pointer',
                  backgroundColor:
                    page === currentPage
                      ? 'var(--color-primary-500)'
                      : page === '...'
                        ? 'transparent'
                        : 'var(--color-neutral-100)',
                  color:
                    page === currentPage
                      ? 'var(--color-dark)'
                      : 'var(--color-neutral-600)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (page !== '...' && page !== currentPage) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      'var(--color-neutral-200)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (page !== '...' && page !== currentPage) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      'var(--color-neutral-100)';
                  }
                }}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Bouton suivant */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="btn-secondary"
            style={{
              padding: '0.625rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: hasNextPage ? 1 : 0.5,
              cursor: hasNextPage ? 'pointer' : 'not-allowed',
            }}
          >
            <span style={{ display: 'none' }} className="sm:inline">
              Suivant
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sélecteur de taille de page (optionnel) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.875rem',
        }}
      >
        <label
          htmlFor="page-size"
          style={{
            color: 'var(--color-neutral-600)',
            fontWeight: '600',
          }}
        >
          Afficher par page:
        </label>
        <select
          id="page-size"
          value={pageSize}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--color-neutral-200)',
            backgroundColor: 'white',
            color: 'var(--color-dark)',
            fontWeight: '600',
            cursor: 'pointer',
          }}
          disabled
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
};
