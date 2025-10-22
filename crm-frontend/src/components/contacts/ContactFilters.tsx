import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { ContactFilters as Filters } from '../../types';

interface ContactFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export const ContactFilters: React.FC<ContactFiltersProps> = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value, page: 1 });
  };

  const handleSensitivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sensitivity: e.target.value || undefined, page: 1 });
  };

  const handleReliabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, reliability: e.target.value || undefined, page: 1 });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value || undefined, page: 1 });
  };

  const clearFilters = () => {
    onFilterChange({ page: 1, limit: 20 });
  };

  const hasActiveFilters = filters.search || filters.sensitivity || filters.reliability || filters.status;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Filter className="w-5 h-5 text-neutral-600" />
        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-dark)', margin: 0 }}>
          Recherche et filtres
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Recherche */}
        <div className="input-group" style={{ gridColumn: 'span 2' }}>
          <label className="label">Rechercher</label>
          <div style={{ position: 'relative' }}>
            <Search className="w-5 h-5 text-neutral-400 pointer-events-none" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="search"
              placeholder="Nom, organisation, email..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        {/* Confidentialité */}
        <div className="input-group">
          <label className="label">Confidentialité</label>
          <select value={filters.sensitivity || ''} onChange={handleSensitivityChange}>
            <option value="">Tous</option>
            <option value="low">Public</option>
            <option value="medium">Sensible</option>
            <option value="high">Confidentiel</option>
          </select>
        </div>

        {/* Fiabilité */}
        <div className="input-group">
          <label className="label">Fiabilité</label>
          <select value={filters.reliability || ''} onChange={handleReliabilityChange}>
            <option value="">Tous</option>
            <option value="low">À vérifier</option>
            <option value="medium">Fiable</option>
            <option value="high">Très fiable</option>
          </select>
        </div>

        {/* Statut */}
        <div className="input-group">
          <label className="label">Statut</label>
          <select value={filters.status || ''} onChange={handleStatusChange}>
            <option value="">Tous</option>
            <option value="potential">Potentiel</option>
            <option value="active">Actif</option>
            <option value="verified">Vérifié</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={clearFilters}
            className="btn-secondary"
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};