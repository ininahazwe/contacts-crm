import React, { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import { exportService } from '../../services/exportService';
import { Modal } from './Modal';
import type { Contact } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  filterSummary?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  contacts,
  filterSummary,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'report'>('excel');

  const handleExport = async () => {
    try {
      setIsExporting(true);

      if (selectedFormat === 'csv') {
        await exportService.exportToCSV(contacts, 'contacts');
      } else if (selectedFormat === 'excel') {
        await exportService.exportToExcel(contacts, 'contacts');
      } else if (selectedFormat === 'report') {
        exportService.downloadReport(contacts, 'rapport_contacts');
      }

      // Fermer le modal après un court délai
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'export';
      alert(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exporter les résultats" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Informations */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--color-primary-50)',
            border: '2px solid var(--color-primary-100)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-neutral-700)' }}>
            <strong>{contacts.length}</strong> contact{contacts.length > 1 ? 's' : ''} à exporter
          </p>
          {filterSummary && (
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: 'var(--color-neutral-600)' }}>
              Filtres appliqués: {filterSummary}
            </p>
          )}
        </div>

        {/* Sélection du format */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-neutral-700)' }}>
            Format d'export
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { value: 'excel', label: '📊 Excel', description: 'Format XLSX avec mise en forme' },
              { value: 'csv', label: '📋 CSV', description: 'Format texte (Excel, Sheets)' },
              { value: 'report', label: '📄 Rapport', description: 'Rapport texte avec statistiques' },
            ].map((option) => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: selectedFormat === option.value ? 'var(--color-primary-50)' : 'var(--color-neutral-50)',
                  border: `2px solid ${selectedFormat === option.value ? 'var(--color-primary-300)' : 'var(--color-neutral-200)'}`,
                  borderRadius: 'var(--radius-xl)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="radio"
                  name="format"
                  value={option.value}
                  checked={selectedFormat === option.value as any}
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  style={{ cursor: 'pointer', marginTop: '0.25rem' }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-dark)', fontSize: '0.875rem' }}>
                    {option.label}
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-neutral-600)', fontSize: '0.75rem' }}>
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--color-neutral-50)',
            borderRadius: 'var(--radius-xl)',
            fontSize: '0.75rem',
            color: 'var(--color-neutral-600)',
            lineHeight: '1.6',
          }}
        >
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>Contenu de l'export:</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>Nom, organisation, position</li>
            <li>Email et téléphone</li>
            <li>Statut, confidentialité, fiabilité</li>
            <li>Tags et dates</li>
          </ul>
        </div>

        {/* Boutons d'action */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={isExporting}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--color-neutral-100)',
              color: 'var(--color-dark)',
              border: 'none',
              borderRadius: 'var(--radius-2xl)',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: isExporting ? 0.6 : 1,
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--color-primary-500)',
              color: 'var(--color-dark)',
              border: 'none',
              borderRadius: 'var(--radius-2xl)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isExporting ? 0.6 : 1,
            }}
          >
            {isExporting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exporter
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};