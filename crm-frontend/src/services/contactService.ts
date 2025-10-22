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

      // Construire l'objet where pour les filtres
      const whereConditions: any = {};

      // Recherche textuelle
      if (filters.search) {
        params['where[or][0][firstName][contains]'] = filters.search;
        params['where[or][1][lastName][contains]'] = filters.search;
        params['where[or][2][organization][contains]'] = filters.search;
        params['where[or][3][email][contains]'] = filters.search;
      }

      // Filtres individuels
      if (filters.sensitivity) {
        params['where[sensitivity][equals]'] = filters.sensitivity;
      }

      if (filters.reliability) {
        params['where[reliability][equals]'] = filters.reliability;
      }

      if (filters.status) {
        params['where[status][equals]'] = filters.status;
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
};