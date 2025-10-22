import React, { useState, useEffect } from 'react';
import { Plus, Users as UsersIcon } from 'lucide-react';
import { contactService } from '../services/contactService';
import type { Contact, ContactFilters as Filters, ContactFormData } from '../types';
import { ContactFilters } from '../components/contacts/ContactFilters';
import { ContactCard } from '../components/contacts/ContactCard';
import { ContactForm } from '../components/contacts/ContactForm';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/Loading';
import { Pagination } from '../components/ui/Pagination';

interface PaginationState {
  page: number;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export const ContactsPage: React.FC = () => {
  // États principaux
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtres et pagination
  const [filters, setFilters] = useState<Filters>({ page: 1, limit: 20 });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    totalDocs: 0,
    totalPages: 0,
    hasPrevPage: false,
    hasNextPage: false,
  });

  // Gestion du modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Charger les contacts au changement de filtres
  useEffect(() => {
    loadContacts();
  }, [filters]);

  /**
   * Charge les contacts depuis le backend
   */
  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await contactService.getContacts(filters);
      
      setContacts(response.docs);
      setPagination({
        page: response.page,
        totalDocs: response.totalDocs,
        totalPages: response.totalPages,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des contacts';
      setError(errorMessage);
      console.error('Erreur lors du chargement des contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ouvre le modal d'édition
   */
  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  /**
   * Supprime un contact avec confirmation
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return;

    try {
      await contactService.deleteContact(id);
      loadContacts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
      alert(errorMessage);
      console.error('Erreur lors de la suppression:', error);
    }
  };

  /**
   * Ouvre le modal de création
   */
  const handleCreateNew = () => {
    setEditingContact(undefined);
    setIsModalOpen(true);
  };

  /**
   * Sauvegarde ou crée un contact
   */
  const handleSubmit = async (data: ContactFormData) => {
    try {
      setIsSaving(true);
      
      if (editingContact) {
        await contactService.updateContact(editingContact.id, data);
      } else {
        await contactService.createContact(data);
      }
      
      setIsModalOpen(false);
      setEditingContact(undefined);
      setFilters({ page: 1, limit: filters.limit }); // Recharger la première page
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
      alert(errorMessage);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Ferme le modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(undefined);
  };

  /**
   * Change la page
   */
  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    // Scroll vers le haut pour une meilleure UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Change les filtres
   */
  const handleFilterChange = (newFilters: Filters) => {
    // Réinitialiser à la page 1 quand les filtres changent
    setFilters({ ...newFilters, page: 1 });
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: 'var(--color-dark)',
              margin: 0,
              marginBottom: '0.5rem',
            }}
          >
            Contacts
          </h1>
          <p style={{ color: 'var(--color-neutral-600)', margin: 0 }}>
            {pagination.totalDocs} contact{pagination.totalDocs > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Plus className="w-5 h-5" />
          Nouveau contact
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
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
          {error}
        </div>
      )}

      {/* Filtres */}
      <ContactFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Contenu principal */}
      {loading && contacts.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <LoadingSpinner size="lg" text="Chargement des contacts..." />
        </div>
      ) : contacts.length === 0 ? (
        /* État vide */
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '4rem',
              height: '4rem',
              backgroundColor: 'var(--color-neutral-100)',
              borderRadius: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            <UsersIcon className="w-8 h-8 text-neutral-400" />
          </div>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--color-dark)',
              marginBottom: '0.5rem',
            }}
          >
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
        <>
          {/* Grille de contacts */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasPrevPage={pagination.hasPrevPage}
              hasNextPage={pagination.hasNextPage}
              totalDocs={pagination.totalDocs}
              pageSize={filters.limit || 20}
            />
          )}
        </>
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