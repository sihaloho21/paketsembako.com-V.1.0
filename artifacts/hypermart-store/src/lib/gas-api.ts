/**
 * Mock API Wrapper for Frontend-only Development
 * Menyediakan mock data untuk keperluan pengembangan frontend
 */

export interface GASRequestParams {
  action: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Mock data untuk produk
 */
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Beras Premium 5kg",
    price: 65000,
    image: "https://placehold.co/400x400?text=Beras",
    categoryId: 1,
    isPromo: true,
    isTrending: true,
    description: "Beras kualitas premium pulen dan bersih."
  },
  {
    id: 2,
    name: "Minyak Goreng 2L",
    price: 32000,
    image: "https://placehold.co/400x400?text=Minyak",
    categoryId: 2,
    isPromo: false,
    isTrending: true,
    description: "Minyak goreng kelapa sawit murni."
  },
  {
    id: 3,
    name: "Gula Pasir 1kg",
    price: 15000,
    image: "https://placehold.co/400x400?text=Gula",
    categoryId: 2,
    isPromo: true,
    isTrending: false,
    description: "Gula pasir putih bersih."
  }
];

const MOCK_CATEGORIES = [
  { id: 1, name: "Beras", icon: "B" },
  { id: 2, name: "Kebutuhan Pokok", icon: "K" },
  { id: 3, name: "Minuman", icon: "M" }
];

/**
 * Mock function untuk memanggil API
 */
export async function callGAS<T = any>(params: GASRequestParams): Promise<T> {
  console.log("Mock API Call:", params);
  
  // Simulasi network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  switch (params.action) {
    case "getProducts":
      let products = [...MOCK_PRODUCTS];
      if (params.categoryId) products = products.filter(p => p.categoryId === Number(params.categoryId));
      if (params.isPromo) products = products.filter(p => p.isPromo);
      if (params.isTrending) products = products.filter(p => p.isTrending);
      return products as any;
    
    case "getProduct":
      return MOCK_PRODUCTS.find(p => p.id === Number(params.id)) as any;
    
    case "getCategories":
      return MOCK_CATEGORIES as any;
    
    case "getUser":
      return {
        id: params.id,
        name: "Mock User",
        email: "user@example.com",
        points: 1000,
        xp: 500,
        level: 5
      } as any;

    case "getAvailableVouchers":
      return [
        { id: 1, title: "Diskon 10rb", points: 100 },
        { id: 2, title: "Gratis Ongkir", points: 200 }
      ] as any;

    default:
      return {} as any;
  }
}

export async function getProducts(filters?: any) {
  return callGAS({ action: "getProducts", ...filters });
}

export async function getProduct(id: number) {
  return callGAS({ action: "getProduct", id });
}

export async function getFeaturedProducts() {
  return getProducts({ limit: 10 });
}

export async function getPromoProducts() {
  return getProducts({ isPromo: true, limit: 10 });
}

export async function getTrendingProducts() {
  return getProducts({ isTrending: true, limit: 10 });
}

export async function getCategories() {
  return callGAS({ action: "getCategories" });
}

export async function getUser(id: string) {
  return callGAS({ action: "getUser", id });
}

export async function getAvailableVouchers() {
  return callGAS({ action: "getAvailableVouchers" });
}

export async function getUserVouchers(userId: string) {
  return callGAS({ action: "getUserVouchers", userId });
}

export async function getPointsHistory(userId: string) {
  return callGAS({ action: "getPointsHistory", userId });
}

export async function redeemVoucher(userId: string, voucherId: number) {
  console.log("Mock Redeem:", userId, voucherId);
  return { success: true };
}

export async function updateUserXP(userId: string, xpToAdd: number) {
  console.log("Mock XP Update:", userId, xpToAdd);
  return { success: true };
}

export async function initializeUser(userId: string, name?: string, email?: string) {
  console.log("Mock User Init:", userId, name, email);
  return { success: true };
}
