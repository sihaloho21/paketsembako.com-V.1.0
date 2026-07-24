/**
 * Hook for API calls
 * Backend functionality has been removed.
 */

export function useGetFeaturedProducts() {
  return { data: [], isLoading: false };
}

export function useGetPromoProducts() {
  return { data: [], isLoading: false };
}

export function useGetTrendingProducts() {
  return { data: [], isLoading: false };
}

export function useListProducts(_filters?: any) {
  return { data: [], isLoading: false };
}

export function useGetProduct(_id: number) {
  return { data: null, isLoading: false };
}

export function useListCategories() {
  return { data: [], isLoading: false };
}

export function useGetUser(_id: string) {
  return { data: null, isLoading: false };
}

export function useGetAvailableVouchers() {
  return { data: [], isLoading: false };
}

export function useGetUserVouchers(_userId: string) {
  return { data: [], isLoading: false };
}

export function useGetPointsHistory(_userId: string) {
  return { data: [], isLoading: false };
}
