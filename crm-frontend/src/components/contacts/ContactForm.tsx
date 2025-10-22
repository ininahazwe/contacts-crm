import React, { useState, useEffect } from 'react';
import type { Contact, ContactFormData, Interaction, Tag } from '../../types';
import { Save, Plus, Trash2, Calendar, MessageSquare, X } from 'lucide-react';
import { LoadingSpinner } from '../ui/Loading';

interface ContactFormProps {
  contact?: Contact;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ contact, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: contact?.firstName || '',
    lastName: contact?.lastName || '',
    alias: contact?.alias || '',
    organization: contact?.organization || '',
    position: contact?.position || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    sensitivity: contact?.sensitivity || 'low',
    reliability: contact?.reliability || 'medium',
    status: contact?.status || 'potential',
    tags: contact?.tags || [],
    notes: contact?.notes || '',
    interactions: contact?.interactions || [],
  });

  const [newTag, setNewTag] = useState('');
  const [newInteraction, setNewInteraction] = useState<Partial<Interaction>>({
    date: new Date().toISOString().split('T')[0],
    type: 'call',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ContactFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      handleChange('tags', [...(formData.tags || []), { tag: newTag.trim() }]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = formData.tags?.filter((_, i) => i !== index);
    handleChange('tags', updatedTags);
  };

  const addInteraction = () => {
    if (newInteraction.date && newInteraction.type && newInteraction.notes) {
      handleChange('interactions', [
        ...(formData.interactions || []),
        newInteraction as Interaction,
      ]);
      setNewInteraction({
        date: new Date().toISOString().split('T')[0],
        type: 'call',
        notes: '',
      });
    }
  };

  const removeInteraction = (index: number) => {
    const updatedInteractions = formData.interactions?.filter((_, i) => i !== index);
    handleChange('interactions', updatedInteractions);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Informations de base */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '1rem' }}>
            Informations de base
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="input-group">
              <label className="label">Prénom *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="label">Nom *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label className="label">Alias / Pseudonyme</label>
              <input
                type="text"
                value={formData.alias}
                onChange={(e) => handleChange('alias', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="label">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="label">Téléphone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Organisation */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '1rem' }}>
            Organisation
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="input-group">
              <label className="label">Organisation</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => handleChange('organization', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="label">Fonction / Titre</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Niveaux et statut */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '1rem' }}>
            Classification
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div className="input-group">
              <label className="label">Confidentialité *</label>
              <select
                value={formData.sensitivity}
                onChange={(e) => handleChange('sensitivity', e.target.value)}
                required
              >
                <option value="low">Public</option>
                <option value="medium">Sensible</option>
                <option value="high">Confidentiel</option>
              </select>
            </div>
            <div className="input-group">
              <label className="label">Fiabilité *</label>
              <select
                value={formData.reliability}
                onChange={(e) => handleChange('reliability', e.target.value)}
                required
              >
                <option value="low">À vérifier</option>
                <option value="medium">Fiable</option>
                <option value="high">Très fiable</option>
              </select>
            </div>
            <div className="input-group">
              <label className="label">Statut *</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                required
              >
                <option value="potential">Potentiel</option>
                <option value="active">Actif</option>
                <option value="verified">Vérifié</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '1rem' }}>
            Tags
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Ajouter un tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={addTag}
              className="btn-secondary"
              style={{ padding: '0.875rem 1.5rem' }}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--color-primary-100)',
                    borderRadius: '0.75rem',
                    border: '2px solid var(--color-primary-200)',
                  }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-primary-800)' }}>
                    {tag.tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.125rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <X className="w-4 h-4 text-primary-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '1rem' }}>
            Notes confidentielles
          </h3>
          <div className="input-group">
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Informations sensibles, contexte, particularités du contact..."
              style={{ minHeight: '120px' }}
            />
          </div>
        </div>

        {/* Interactions */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare className="w-5 h-5" />
            Historique des interactions
            {formData.interactions && formData.interactions.length > 0 && (
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600',
                padding: '0.25rem 0.75rem',
                backgroundColor: 'var(--color-primary-100)',
                color: 'var(--color-primary-800)',
                borderRadius: '9999px'
              }}>
                {formData.interactions.length}
              </span>
            )}
          </h3>
          
          {/* Liste des interactions existantes */}
          {formData.interactions && formData.interactions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {formData.interactions.map((interaction, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    backgroundColor: 'white',
                    border: '2px solid var(--color-neutral-200)',
                    borderRadius: '1rem',
                    display: 'flex',
                    gap: '1rem',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-dark)' }}>
                        {new Date(interaction.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span
                        style={{
                          padding: '0.125rem 0.5rem',
                          backgroundColor: 'var(--color-secondary-100)',
                          color: 'var(--color-secondary-800)',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        {interaction.type === 'call' && 'Appel'}
                        {interaction.type === 'meeting' && 'Rencontre'}
                        {interaction.type === 'email' && 'Email'}
                        {interaction.type === 'encrypted' && 'Crypté'}
                        {interaction.type === 'other' && 'Autre'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)', margin: 0 }}>
                      {interaction.notes}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInteraction(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem',
                    }}
                    title="Supprimer cette interaction"
                  >
                    <Trash2 className="w-4 h-4 text-secondary-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Formulaire nouvelle interaction */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-primary-50)',
              border: '2px solid var(--color-primary-200)',
              borderRadius: '1rem',
            }}
          >
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ➕ Ajouter une nouvelle interaction
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="input-group">
                <label className="label">Date</label>
                <input
                  type="date"
                  value={newInteraction.date}
                  onChange={(e) => setNewInteraction({ ...newInteraction, date: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label className="label">Type de contact</label>
                <select
                  value={newInteraction.type}
                  onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value as any })}
                >
                  <option value="call">Appel téléphonique</option>
                  <option value="meeting">Rencontre</option>
                  <option value="email">Email</option>
                  <option value="encrypted">Message crypté</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="label">Notes de l'interaction</label>
              <textarea
                value={newInteraction.notes}
                onChange={(e) => setNewInteraction({ ...newInteraction, notes: e.target.value })}
                placeholder="Décrivez cette interaction (sujet discuté, informations obtenues, suite à donner...)"
                style={{ minHeight: '100px' }}
              />
            </div>
            <button
              type="button"
              onClick={addInteraction}
              className="btn-primary"
              style={{ width: '100%' }}
              disabled={!newInteraction.notes || !newInteraction.date}
            >
              <Plus className="w-5 h-5" />
              <span>Ajouter cette interaction</span>
            </button>
            {!newInteraction.notes && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', marginTop: '0.5rem', textAlign: 'center', margin: 0 }}>
                💡 Remplissez les notes pour activer le bouton
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid var(--color-neutral-100)',
          }}
        >
          <button type="button" onClick={onCancel} className="btn-secondary" style={{ flex: 1 }}>
            Annuler
          </button>
          <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{contact ? 'Enregistrer' : 'Créer'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};