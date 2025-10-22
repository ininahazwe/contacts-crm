import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Contact } from '../../types';
import { Mail, Phone, Building2, Calendar, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getSensitivityBadge = (level: string) => {
    const badges = {
      low: { class: 'badge-low', label: 'Public' },
      medium: { class: 'badge-medium', label: 'Sensible' },
      high: { class: 'badge-high', label: 'Confidentiel' },
    };
    const badge = badges[level as keyof typeof badges];
    return <span className={`badge ${badge.class}`}>{badge.label}</span>;
  };

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, string> = {
      potential: 'Potentiel',
      active: 'Actif',
      verified: 'Vérifié',
      inactive: 'Inactif',
    };
    return statuses[status] || status;
  };

  const getInitials = () => {
    return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase();
  };

  const handleNavigateToDetail = () => {
    navigate(`/contacts/${contact.id}`);
  };

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header avec avatar et badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          marginBottom: '1rem',
          cursor: 'pointer',
        }}
        onClick={handleNavigateToDetail}
      >
        <div
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '1rem',
            background: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-dark)' }}>
            {getInitials()}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: 'var(--color-dark)',
              margin: 0,
              marginBottom: '0.5rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-primary-600)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-dark)';
            }}
          >
            {contact.firstName} {contact.lastName}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {getSensitivityBadge(contact.sensitivity)}
          </div>
        </div>
      </div>

      {/* Informations */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}
        onClick={handleNavigateToDetail}
      >
        {contact.organization && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 className="w-4 h-4 text-neutral-400" />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
              {contact.organization}
              {contact.position && ` • ${contact.position}`}
            </span>
          </div>
        )}

        {contact.email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail className="w-4 h-4 text-neutral-400" />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>{contact.email}</span>
          </div>
        )}

        {contact.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone className="w-4 h-4 text-neutral-400" />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>{contact.phone}</span>
          </div>
        )}

        {contact.lastContact && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
              Dernier contact: {format(new Date(contact.lastContact), 'dd MMM yyyy', { locale: fr })}
            </span>
          </div>
        )}

        {/* Tags */}
        {contact.tags && contact.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {contact.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'var(--color-neutral-100)',
                  color: 'var(--color-neutral-700)',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}
              >
                {tag.tag}
              </span>
            ))}
            {contact.tags.length > 3 && (
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'var(--color-neutral-100)',
                  color: 'var(--color-neutral-700)',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}
              >
                +{contact.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer avec actions */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          paddingTop: '1rem',
          borderTop: '2px solid var(--color-neutral-100)',
        }}
      >
        <button
          onClick={() => onEdit(contact)}
          className="btn-secondary"
          style={{ flex: 1, fontSize: '0.875rem', padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <Edit className="w-4 h-4" />
          Modifier
        </button>
        <button
          onClick={() => onDelete(contact.id)}
          className="btn-danger"
          style={{ fontSize: '0.875rem', padding: '0.625rem 1rem' }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};