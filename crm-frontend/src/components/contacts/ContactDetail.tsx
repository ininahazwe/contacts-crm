import React, { useState } from 'react';
import { Mail, Phone, Building2, Calendar, FileText, Tag, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ContactTimeline } from './ContactTimeline';
import type { Contact } from '../../types';

interface ContactDetailProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onAddInteraction: (interaction: any) => void;
  onDeleteInteraction: (id: string) => void;
  onUpdateInteraction: (id: string, data: any) => void;
  isLoading?: boolean;
}

export const ContactDetail: React.FC<ContactDetailProps> = ({
  contact,
  onEdit,
  onDelete,
  onBack,
  onAddInteraction,
  onDeleteInteraction,
  onUpdateInteraction,
  isLoading = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getSensitivityBadge = (level?: string) => {
    const badges = {
      low: { bg: 'var(--color-primary-100)', color: 'var(--color-primary-800)', label: 'Public' },
      medium: { bg: 'var(--color-secondary-100)', color: 'var(--color-secondary-800)', label: 'Sensible' },
      high: { bg: 'var(--color-neutral-800)', color: 'white', label: 'Confidentiel' },
    };
    const badge = badges[level as keyof typeof badges] || badges.low;
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '0.25rem 0.75rem',
          backgroundColor: badge.bg,
          color: badge.color,
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '700',
        }}
      >
        {badge.label}
      </span>
    );
  };

  const getStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
      potential: '#a8a29e',
      active: '#a5fa71',
      verified: '#a5fa71',
      inactive: '#78716c',
    };
    return colors[status || 'potential'] || '#a8a29e';
  };

  const getStatusLabel = (status?: string) => {
    const labels: Record<string, string> = {
      potential: 'Potentiel',
      active: 'Actif',
      verified: 'Vérifié',
      inactive: 'Inactif',
    };
    return labels[status || 'potential'] || status || 'Inconnu';
  };

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      setIsDeleting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        onDelete(contact.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header avec bouton retour */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={onBack}
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
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: 'var(--color-dark)',
            margin: 0,
          }}
        >
          {contact.firstName} {contact.lastName}
        </h1>
      </div>

      {/* Layout 2 colonnes responsive */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* COLONNE GAUCHE - Infos contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Carte principale */}
          <div
            className="card"
            style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* Avatar et nom */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '1.5rem',
                  background: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-dark)' }}>
                  {contact.firstName && contact.lastName 
                    ? `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`
                    : '?'}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <h2
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--color-dark)',
                    margin: 0,
                    marginBottom: '0.5rem',
                  }}
                >
                  {contact.firstName} {contact.lastName}
                </h2>
                {contact.alias && (
                  <p style={{ color: 'var(--color-neutral-600)', margin: 0, fontSize: '0.875rem' }}>
                    Alias: {contact.alias}
                  </p>
                )}
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {getSensitivityBadge(contact.sensitivity)}
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: getStatusColor(contact.status) + '20',
                  color: getStatusColor(contact.status),
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                }}
              >
                {getStatusLabel(contact.status)}
              </span>
            </div>

            {/* Separator */}
            <div style={{ height: '1px', backgroundColor: 'var(--color-neutral-100)' }} />

            {/* Infos organisation */}
            {(contact.organization || contact.position) && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Building2 className="w-5 h-5 text-neutral-400" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ color: 'var(--color-neutral-600)', margin: 0, fontSize: '0.875rem' }}>
                    Organisation
                  </p>
                  <p style={{ color: 'var(--color-dark)', margin: 0, fontWeight: '600' }}>
                    {contact.organization || 'N/A'}
                  </p>
                  {contact.position && (
                    <p style={{ color: 'var(--color-neutral-600)', margin: 0, fontSize: '0.875rem' }}>
                      {contact.position}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email */}
            {contact.email && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Mail className="w-5 h-5 text-neutral-400" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ color: 'var(--color-neutral-600)', margin: 0, fontSize: '0.875rem' }}>
                    Email
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    style={{
                      color: 'var(--color-primary-600)',
                      textDecoration: 'none',
                      fontWeight: '600',
                    }}
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            )}

            {/* Phone */}
            {contact.phone && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Phone className="w-5 h-5 text-neutral-400" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ color: 'var(--color-neutral-600)', margin: 0, fontSize: '0.875rem' }}>
                    Téléphone
                  </p>
                  <a
                    href={`tel:${contact.phone}`}
                    style={{
                      color: 'var(--color-primary-600)',
                      textDecoration: 'none',
                      fontWeight: '600',
                    }}
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Dates */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Calendar className="w-5 h-5 text-neutral-400" style={{ flexShrink: 0 }} />
              <div style={{ width: '100%' }}>
                <p style={{ color: 'var(--color-neutral-600)', margin: 0, fontSize: '0.875rem' }}>
                  Dernier contact
                </p>
                <p style={{ color: 'var(--color-dark)', margin: 0, fontWeight: '600' }}>
                  {contact.lastContact
                    ? format(new Date(contact.lastContact), 'dd MMM yyyy à HH:mm', { locale: fr })
                    : 'Jamais'}
                </p>
              </div>
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div>
                <p style={{ color: 'var(--color-neutral-600)', margin: 0, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                  Tags
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {contact.tags.map((tag: { tag: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--color-primary-100)',
                        color: 'var(--color-primary-800)',
                        borderRadius: 'var(--radius-2xl)',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                      }}
                    >
                      <Tag className="w-3 h-3" />
                      {tag.tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                onClick={() => onEdit(contact)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--color-primary-500)',
                  color: 'var(--color-dark)',
                  border: 'none',
                  borderRadius: 'var(--radius-2xl)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Edit className="w-4 h-4" />
                Éditer
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--color-secondary-500)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-2xl)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  opacity: isDeleting ? 0.6 : 1,
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div
              className="card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText className="w-5 h-5 text-neutral-600" />
                <h3
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    color: 'var(--color-dark)',
                    margin: 0,
                  }}
                >
                  Notes
                </h3>
              </div>
              <p
                style={{
                  color: 'var(--color-neutral-700)',
                  margin: 0,
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {contact.notes}
              </p>
            </div>
          )}
        </div>

        {/* COLONNE DROITE - Timeline interactions */}
        <div
          className="card"
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <ContactTimeline
            interactions={contact.interactions || []}
            onAddInteraction={onAddInteraction}
            onDeleteInteraction={onDeleteInteraction}
            onUpdateInteraction={onUpdateInteraction}
            contactId={contact.id}
          />
        </div>
      </div>
    </div>
  );
};