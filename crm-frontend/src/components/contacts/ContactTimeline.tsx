import React, { useState } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Interaction } from '../../types';

interface ContactTimelineProps {
  interactions: Interaction[];
  onAddInteraction: (interaction: Interaction) => void;
  onDeleteInteraction: (id: string) => void;
  onUpdateInteraction: (id: string, data: Partial<Interaction>) => void;
  contactId: string;
}

export const ContactTimeline: React.FC<ContactTimelineProps> = ({
  interactions,
  onAddInteraction,
  onDeleteInteraction,
  onUpdateInteraction,
  contactId,
}) => {
  const [isAddingInteraction, setIsAddingInteraction] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'email' as const,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const interactionTypes = [
    { value: 'call', label: '☎️ Appel' },
    { value: 'meeting', label: '👥 Réunion' },
    { value: 'email', label: '📧 Email' },
    { value: 'encrypted', label: '🔒 Chiffré' },
    { value: 'other', label: '📝 Autre' },
  ];

  const handleAddInteraction = () => {
    if (!formData.notes.trim()) {
      alert('Veuillez entrer une note');
      return;
    }

    const newInteraction: Interaction = {
      id: Date.now().toString(),
      date: new Date(formData.date).toISOString(),
      type: formData.type,
      notes: formData.notes,
    };

    onAddInteraction(newInteraction);
    setFormData({
      type: 'email',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsAddingInteraction(false);
  };

  const handleDeleteInteraction = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette interaction ?')) {
      onDeleteInteraction(id);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      call: '☎️',
      meeting: '👥',
      email: '📧',
      encrypted: '🔒',
      other: '📝',
    };
    return icons[type] || '📝';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      call: 'Appel',
      meeting: 'Réunion',
      email: 'Email',
      encrypted: 'Chiffré',
      other: 'Autre',
    };
    return labels[type] || type;
  };

  const sortedInteractions = [...interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid var(--color-neutral-100)',
          paddingBottom: '1rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: 'var(--color-dark)',
            margin: 0,
          }}
        >
          Interactions ({interactions.length})
        </h3>
        <button
          onClick={() => setIsAddingInteraction(!isAddingInteraction)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--color-primary-500)',
            color: 'var(--color-dark)',
            border: 'none',
            borderRadius: 'var(--radius-2xl)',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {isAddingInteraction && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--color-primary-50)',
            borderRadius: 'var(--radius-2xl)',
            border: '2px solid var(--color-primary-100)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-neutral-700)' }}>
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as any })
                }
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  padding: '0.625rem',
                  border: '2px solid var(--color-neutral-200)',
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                {interactionTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-neutral-700)' }}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  padding: '0.625rem',
                  border: '2px solid var(--color-neutral-200)',
                  borderRadius: 'var(--radius-xl)',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-neutral-700)' }}>
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Décrivez l'interaction..."
              style={{
                width: '100%',
                marginTop: '0.5rem',
                padding: '0.625rem',
                border: '2px solid var(--color-neutral-200)',
                borderRadius: 'var(--radius-xl)',
                minHeight: '80px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsAddingInteraction(false)}
              style={{
                padding: '0.625rem 1rem',
                backgroundColor: 'var(--color-neutral-100)',
                color: 'var(--color-dark)',
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              onClick={handleAddInteraction}
              style={{
                padding: '0.625rem 1rem',
                backgroundColor: 'var(--color-primary-500)',
                color: 'var(--color-dark)',
                border: 'none',
                borderRadius: 'var(--radius-xl)',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Ajouter
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {sortedInteractions.length === 0 ? (
          <p style={{ color: 'var(--color-neutral-600)', textAlign: 'center', padding: '2rem 0' }}>
            Aucune interaction enregistrée
          </p>
        ) : (
          sortedInteractions.map((interaction, index) => (
            <div
              key={interaction.id || index}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--color-neutral-50)',
                borderLeft: '3px solid var(--color-primary-500)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{getTypeIcon(interaction.type)}</span>
                  <span style={{ fontWeight: '600', color: 'var(--color-dark)' }}>
                    {getTypeLabel(interaction.type)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-600)' }}>
                    {format(new Date(interaction.date), 'dd MMM yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
                <p
                  style={{
                    color: 'var(--color-neutral-700)',
                    margin: 0,
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                  }}
                >
                  {interaction.notes}
                </p>
              </div>

              {/* Boutons d'action */}
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                <button
                  onClick={() => handleDeleteInteraction(interaction.id!)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-neutral-600)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#ef5350';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-neutral-600)';
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};