import React, { useState, useEffect } from 'react';
import { Plus, Users as UsersIcon } from 'lucide-react';
import { contactService } from '../services/contactService';
import type { Contact, ContactFilters as Filters, ContactFormData } from '../types';
import { ContactFilters } from '../components/contacts/ContactFilters';
import { ContactCard } from '../components/contacts/ContactCard';
import { ContactForm } from '../components/contacts/ContactForm';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/Loading';

export const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 20 });
  const [totalDocs, setTotalDocs] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);

  useEffect(() => {
    loadContacts();
  }, [filters]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getContacts(filters);
      setContacts(response.docs);
      setTotalDocs(response.totalDocs);
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return;

    try {
      await contactService.deleteContact(id);
      loadContacts();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du contact');
    }
  };

  const handleCreateNew = () => {
    setEditingContact(undefined);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: ContactFormData) => {
    try {
      if (editingContact) {
        await contactService.updateContact(editingContact.id, data);
      } else {
        await contactService.createContact(data);
      }
      setIsModalOpen(false);
      setEditingContact(undefined);
      loadContacts();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert(error.message || 'Erreur lors de la sauvegarde du contact');
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(undefined);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-dark)', margin: 0, marginBottom: '0.5rem' }}>
            Contacts
          </h1>
          <p style={{ color: 'var(--color-neutral-600)', margin: 0 }}>
            {totalDocs} contact{totalDocs > 1 ? 's' : ''} au total
          </p>
        </div>
        <button onClick={handleCreateNew} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus className="w-5 h-5" />
          Nouveau contact
        </button>
      </div>

      {/* Filtres */}
      <ContactFilters filters={filters} onFilterChange={setFilters} />

      {/* Liste des contacts */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <LoadingSpinner size="lg" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', backgroundColor: 'var(--color-neutral-100)', borderRadius: '1.5rem', marginBottom: '1rem' }}>
            <UsersIcon className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '0.5rem' }}>
            Aucun contact trouvé
          </h3>
          <p style={{ color: 'var(--color-neutral-600)', marginBottom: '1.5rem' }}>
            Commencez par créer votre premier contact
          </p>
          <button onClick={handleCreateNew} className="btn-primary">
            <Plus className="w-5 h-5" style={{ marginRight: '0.5rem' }} />
            Créer un contact
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal de création/édition */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingContact ? 'Modifier le contact' : 'Nouveau contact'}
        size="xl"
      >
        <ContactForm
          contact={editingContact}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};