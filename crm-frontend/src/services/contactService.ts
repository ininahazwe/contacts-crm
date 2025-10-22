import api from './api';
import type { Contact, ContactsResponse, ContactFormData, ContactFilters } from '../types';

export const contactService = {
  // Récupérer tous les contacts avec filtres et pagination
  async getContacts(filters: ContactFilters = {}): Promise<ContactsResponse> {
    try {
      const params: any = {
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

      // RECHERCHE TEXTE
      if (filters.search) {
        params['where[or][0][firstName][contains]'] = filters.search;
        params['where[or][1][lastName][contains]'] = filters.search;
        params['where[or][2][organization][contains]'] = filters.search;
        params['where[or][3][email][contains]'] = filters.search;
      }

      // SENSIBILITÉ
      if (filters.sensitivity) {
        params['where[sensitivity][equals]'] = filters.sensitivity;
      }

      // FIABILITÉ
      if (filters.reliability) {
        params['where[reliability][equals]'] = filters.reliability;
      }

      // STATUT
      if (filters.status) {
        params['where[status][equals]'] = filters.status;
      }

      // ORGANISATION
      if (filters.organization) {
        params['where[organization][contains]'] = filters.organization;
      }

      // DATES - DE
      if (filters.dateFrom) {
        params['where[lastContact][greater_than_equal]'] = new Date(filters.dateFrom).toISOString();
      }

      // DATES - À
      if (filters.dateTo) {
        params['where[lastContact][less_than_equal]'] = new Date(filters.dateTo).toISOString();
      }

      // NOTES
      if (filters.hasNotes !== undefined) {
        if (filters.hasNotes) {
          params['where[notes][exists]'] = true;
        } else {
          params['where[notes][exists]'] = false;
        }
      }

      // TAGS (future)
      if (filters.tags && filters.tags.length > 0) {
        // À adapter selon votre structure de tags
        params['where[tags][in]'] = filters.tags.join(',');
      }

      const response = await api.get<ContactsResponse>('/contacts', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la récupération des contacts'
      );
    }
  },

  // Récupérer un contact par ID
  async getContactById(id: string): Promise<Contact> {
    try {
      const response = await api.get<Contact>(`/contacts/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la récupération du contact'
      );
    }
  },

  // Créer un nouveau contact
  async createContact(data: ContactFormData): Promise<Contact> {
    try {
      const response = await api.post<Contact>('/contacts', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la création du contact'
      );
    }
  },

  // Mettre à jour un contact
  async updateContact(id: string, data: Partial<ContactFormData>): Promise<Contact> {
    try {
      const response = await api.patch<Contact>(`/contacts/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la mise à jour du contact'
      );
    }
  },

  // Supprimer un contact
  async deleteContact(id: string): Promise<void> {
    try {
      await api.delete(`/contacts/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la suppression du contact'
      );
    }
  },

  // Ajouter une interaction à un contact
  async addInteraction(contactId: string, interaction: any): Promise<Contact> {
    try {
      const contact = await this.getContactById(contactId);
      const updatedInteractions = [...(contact.interactions || []), interaction];
      
      return await this.updateContact(contactId, {
        interactions: updatedInteractions,
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de l\'ajout de l\'interaction'
      );
    }
  },

  // Supprimer une interaction
  async deleteInteraction(contactId: string, interactionId: string): Promise<Contact> {
    try {
      const contact = await this.getContactById(contactId);
      const updatedInteractions = (contact.interactions || []).filter(
        (i) => i.id !== interactionId
      );
      
      return await this.updateContact(contactId, {
        interactions: updatedInteractions,
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la suppression de l\'interaction'
      );
    }
  },

  // Mettre à jour une interaction
  async updateInteraction(
    contactId: string,
    interactionId: string,
    updatedData: any
  ): Promise<Contact> {
    try {
      const contact = await this.getContactById(contactId);
      const updatedInteractions = (contact.interactions || []).map((i) =>
        i.id === interactionId ? { ...i, ...updatedData } : i
      );
      
      return await this.updateContact(contactId, {
        interactions: updatedInteractions,
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la mise à jour de l\'interaction'
      );
    }
  },
};