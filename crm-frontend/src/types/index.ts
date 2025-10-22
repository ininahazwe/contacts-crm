// Types pour l'authentification
export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message?: string;
  user: User;
  token: string;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Types pour les contacts
export interface Interaction {
  id?: string;
  date: string;
  type: 'call' | 'meeting' | 'email' | 'encrypted' | 'other';
  notes: string;
}

export interface Tag {
  id?: string;
  tag: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  alias?: string;
  organization?: string;
  position?: string;
  email?: string;
  phone?: string;
  sensitivity: 'low' | 'medium' | 'high';
  reliability: 'low' | 'medium' | 'high';
  status: 'potential' | 'active' | 'verified' | 'inactive';
  tags?: Tag[];
  notes?: string;
  interactions?: Interaction[];
  lastContact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  alias?: string;
  organization?: string;
  position?: string;
  email?: string;
  phone?: string;
  sensitivity: 'low' | 'medium' | 'high';
  reliability: 'low' | 'medium' | 'high';
  status: 'potential' | 'active' | 'verified' | 'inactive';
  tags?: Tag[];
  notes?: string;
  interactions?: Interaction[];
}

export interface ContactsResponse {
  docs: Contact[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Types pour les filtres - MIS À JOUR
export interface ContactFilters {
  // Pagination
  page?: number;
  limit?: number;

  // Recherche texte
  search?: string;

  // Filtres simples (énums)
  sensitivity?: 'low' | 'medium' | 'high';
  reliability?: 'low' | 'medium' | 'high';
  status?: 'potential' | 'active' | 'verified' | 'inactive';

  // Filtres texte
  organization?: string;

  // Filtres de dates
  dateFrom?: string;  // ISO format: "2025-01-15T00:00:00.000Z"
  dateTo?: string;    // ISO format: "2025-12-31T23:59:59.999Z"

  // Filtres booléens
  hasNotes?: boolean;

  // Filtres multiples (future)
  tags?: string[];
}