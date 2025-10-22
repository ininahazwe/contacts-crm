import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

interface UsePaginationReturn {
  pagination: PaginationState;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (limit: number) => void;
  reset: () => void;
}

export const usePagination = (initialLimit: number = 20): UsePaginationReturn => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: initialLimit,
    totalDocs: 0,
    totalPages: 0,
    hasPrevPage: false,
    hasNextPage: false,
  });

  const updatePagination = useCallback((data: Partial<PaginationState>) => {
    setPagination((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  const goToPage = useCallback((page: number) => {
    updatePagination({ page });
  }, [updatePagination]);

  const nextPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(1, prev.page - 1),
    }));
  }, []);

  const setPageSize = useCallback((limit: number) => {
    updatePagination({ limit, page: 1 });
  }, [updatePagination]);

  const reset = useCallback(() => {
    setPagination({
      page: 1,
      limit: initialLimit,
      totalDocs: 0,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: false,
    });
  }, [initialLimit]);

  return {
    pagination,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    reset,
  };
};