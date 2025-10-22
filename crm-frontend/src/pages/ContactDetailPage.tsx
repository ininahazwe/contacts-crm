import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactService } from '../services/contactService';
import type { Contact, ContactFormData } from '../types';
import { ContactDetail } from '../components/contacts/ContactDetail';
import { ContactForm } from '../components/contacts/ContactForm';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/Loading';

export const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Charger le contact au montage et quand l'ID change
  useEffect(() => {
    loadContact();
  }, [id]);

  const loadContact = useCallback(async () => {
    if (!id) {
      setError('ID du contact invalide');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Chargement du contact:', id);
      const data = await contactService.getContactById(id);
      console.log('Contact chargé:', data);
      setContact(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du contact';
      setError(errorMessage);
      console.error('Erreur lors du chargement:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (data: ContactFormData) => {
    if (!contact) return;

    try {
      setIsSaving(true);
      console.log('Mise à jour du contact:', data);
      await contactService.updateContact(contact.id, data);
      
      // Recharger complètement le contact
      console.log('Rechargement après édition');
      await loadContact();
      setIsEditModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      console.error('Erreur lors de la mise à jour:', err);
      alert(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    try {
      await contactService.deleteContact(contactId);
      navigate('/contacts', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      alert(errorMessage);
    }
  };

  const handleAddInteraction = async (interaction: any) => {
    if (!contact) return;

    try {
      console.log('Ajout interaction:', interaction);
      const updated = await contactService.addInteraction(contact.id, interaction);
      console.log('Interaction ajoutée, contact mis à jour:', updated);
      setContact(updated);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout';
      console.error('Erreur lors de l\'ajout d\'interaction:', err);
      alert(errorMessage);
    }
  };

  const handleDeleteInteraction = async (interactionId: string) => {
    if (!contact) return;

    try {
      console.log('Suppression interaction:', interactionId);
      const updated = await contactService.deleteInteraction(contact.id, interactionId);
      console.log('Interaction supprimée, contact mis à jour:', updated);
      setContact(updated);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      console.error('Erreur lors de la suppression d\'interaction:', err);
      alert(errorMessage);
    }
  };

  const handleUpdateInteraction = async (interactionId: string, data: any) => {
    if (!contact) return;

    try {
      console.log('Mise à jour interaction:', interactionId, data);
      const updated = await contactService.updateInteraction(contact.id, interactionId, data);
      console.log('Interaction mise à jour, contact mis à jour:', updated);
      setContact(updated);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      console.error('Erreur lors de la mise à jour d\'interaction:', err);
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <LoadingSpinner size="lg" text="Chargement du contact..." />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div>
        <div
          style={{
            backgroundColor: '#ffebee',
            border: '2px solid #ef5350',
            color: '#c62828',
            padding: '1rem',
            borderRadius: 'var(--radius-2xl)',
            marginBottom: '1.5rem',
          }}
        >
          {error || 'Contact non trouvé'}
        </div>
        <button
          onClick={() => navigate('/contacts')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--color-neutral-100)',
            color: 'var(--color-dark)',
            border: 'none',
            borderRadius: 'var(--radius-2xl)',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <>
      <ContactDetail
        contact={contact}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBack={() => navigate('/contacts')}
        onAddInteraction={handleAddInteraction}
        onDeleteInteraction={handleDeleteInteraction}
        onUpdateInteraction={handleUpdateInteraction}
        isLoading={isSaving}
      />

      {/* Modal d'édition */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier le contact"
        size="xl"
      >
        <ContactForm
          contact={contact}
          onSubmit={handleSaveEdit}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </>
  );
};