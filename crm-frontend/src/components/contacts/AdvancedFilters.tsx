import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { ContactFilters as Filters } from '../../types';

interface AdvancedFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  totalResults?: number;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  totalResults = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Compter les filtres actifs
  const activeFiltersCount = Object.entries(filters)
    .filter(([key, value]) => {
      if (key === 'page' || key === 'limit') return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== '';
    })
    .length;

  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value,
      page: 1, // Réinitialiser à la page 1
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
      page: 1,
      limit: filters.limit || 20,
      search: '',
      sensitivity: undefined,
      reliability: undefined,
      status: undefined,
      organization: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      tags: undefined,
      hasNotes: undefined,
    });
  };

  const handleMultiSelect = (key: string, value: string, currentValues: string[] = []) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...filters,
      [key]: newValues.length > 0 ? newValues : undefined,
      page: 1,
    });
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Bouton pour déplier/replier */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '1rem 1.5rem',
          backgroundColor: 'white',
          border: '2px solid var(--color-neutral-100)',
          borderRadius: 'var(--radius-2xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-primary-300)';
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-primary-50)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-neutral-100)';
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>🔍 Recherche avancée</span>
          {activeFiltersCount > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-500)',
                color: 'var(--color-dark)',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}
            >
              {activeFiltersCount}
            </span>
          )}
        </div>
        <ChevronDown
          className="w-5 h-5"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        />
      </button>

      {/* Panel des filtres */}
      {isExpanded && (
        <div
          style={{
            marginTop: '0.5rem',
            padding: '2rem',
            backgroundColor: 'white',
            border: '2px solid var(--color-neutral-100)',
            borderRadius: 'var(--radius-2xl)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* RECHERCHE TEXTE */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-neutral-700)' }}>
              🔎 Recherche
            </label>
            <input
              type="text"
              placeholder="Nom, email, organisation..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--color-neutral-200)',
                borderRadius: 'var(--radius-xl)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* ORGANISATION */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-neutral-700)' }}>
              🏢 Organisation
            </label>
            <input
              type="text"
              placeholder="Nom de l'organisation..."
              value={filters.organization || ''}
              onChange={(e) => handleFilterChange('organization', e.target.value || undefined)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--color-neutral-200)',
                borderRadius: 'var(--radius-xl)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* STATUT */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--color-neutral-700)' }}>
              📊 Statut
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['potential', 'active', 'verified', 'inactive'].map((status) => (
                <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.status === status}
                    onChange={() => handleFilterChange('status', filters.status === status ? undefined : status)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-700)' }}>
                    {status === 'potential' && '🎯 Potentiel'}
                    {status === 'active' && '✅ Actif'}
                    {status === 'verified' && '✓ Vérifié'}
                    {status === 'inactive' && '❌ Inactif'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* CONFIDENTIALITÉ */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--color-neutral-700)' }}>
              🔒 Confidentialité
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['low', 'medium', 'high'].map((level) => (
                <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.sensitivity === level}
                    onChange={() => handleFilterChange('sensitivity', filters.sensitivity === level ? undefined : level)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-700)' }}>
                    {level === 'low' && '🟢 Public'}
                    {level === 'medium' && '🟡 Sensible'}
                    {level === 'high' && '🔴 Confidentiel'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* FIABILITÉ */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--color-neutral-700)' }}>
              ⭐ Fiabilité
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['low', 'medium', 'high'].map((level) => (
                <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.reliability === level}
                    onChange={() => handleFilterChange('reliability', filters.reliability === level ? undefined : level)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-700)' }}>
                    {level === 'low' && '⭐ Basse'}
                    {level === 'medium' && '⭐⭐ Moyenne'}
                    {level === 'high' && '⭐⭐⭐ Haute'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* PÉRIODE - DE */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-neutral-700)' }}>
              📅 Dernier contact: De
            </label>
            <input
              type="date"
              value={filters.dateFrom ? filters.dateFrom.split('T')[0] : ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--color-neutral-200)',
                borderRadius: 'var(--radius-xl)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* PÉRIODE - À */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-neutral-700)' }}>
              📅 Dernier contact: À
            </label>
            <input
              type="date"
              value={filters.dateTo ? filters.dateTo.split('T')[0] : ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--color-neutral-200)',
                borderRadius: 'var(--radius-xl)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* NOTES */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filters.hasNotes === true}
                onChange={() => handleFilterChange('hasNotes', filters.hasNotes ? undefined : true)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-neutral-700)' }}>
                📝 Avec des notes
              </span>
            </label>
          </div>

          {/* RÉSULTATS + BOUTON RÉINITIALISER */}
          <div
            style={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '1rem',
              borderTop: '2px solid var(--color-neutral-100)',
            }}
          >
            <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)', fontWeight: '600' }}>
              {totalResults > 0 ? (
                <>
                  <span style={{ color: 'var(--color-primary-600)' }}>{totalResults}</span> résultat{totalResults > 1 ? 's' : ''}
                </>
              ) : (
                'Aucun résultat'
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1rem',
                  backgroundColor: 'var(--color-neutral-100)',
                  color: 'var(--color-dark)',
                  border: 'none',
                  borderRadius: 'var(--radius-2xl)',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-neutral-200)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-neutral-100)';
                }}
              >
                <X className="w-4 h-4" />
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};