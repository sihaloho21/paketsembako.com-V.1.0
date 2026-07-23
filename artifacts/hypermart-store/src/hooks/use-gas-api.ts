import { useQuery } from "@tanstack/react-query";
import * as gasApi from "@/lib/gas-api";

export function useGetFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => gasApi.getFeaturedProducts(),
  });
}

export function useGetPromoProducts() {
  return useQuery({
    queryKey: ["products", "promo"],
    queryFn: () => gasApi.getPromoProducts(),
  });
}

export function useGetTrendingProducts() {
  return useQuery({
    queryKey: ["products", "trending"],
    queryFn: () => gasApi.getTrendingProducts(),
  });
}

export function useListProducts(filters?: {
  categoryId?: number;
  sort?: string;
  isPromo?: boolean;
  isTrending?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => gasApi.getProducts(filters),
  });
}

export function useGetProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => gasApi.getProduct(id),
    enabled: !!id,
  });
}

export function useListCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => gasApi.getCategories(),
  });
}
