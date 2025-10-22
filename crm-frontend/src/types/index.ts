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

// Types pour les filtres
export interface ContactFilters {
  search?: string;
  sensitivity?: string;
  reliability?: string;
  status?: string;
  page?: number;
  limit?: number;
}