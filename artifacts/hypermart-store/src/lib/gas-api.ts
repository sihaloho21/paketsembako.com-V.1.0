/**
 * Google Apps Script API Wrapper
 * Menyediakan helper functions untuk memanggil endpoint Google Apps Script
 */

import { getConfig } from "./config";

export interface GASRequestParams {
  action: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Helper untuk membuat URL dengan query parameters
 */
function buildQueryString(params: GASRequestParams): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

/**
 * Fetch data dari Google Apps Script
 * @param params - Object berisi action dan parameter lainnya
 * @returns Promise dengan data yang di-return dari GAS
 */
export async function callGAS<T = any>(params: GASRequestParams): Promise<T> {
  const config = getConfig();
  if (!config) {
    throw new Error("Config not loaded. Call setupApiClient() first.");
  }

  const queryString = buildQueryString(params);
  const url = `${config.apiBaseUrl}?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`GAS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("Error calling GAS API:", error);
    throw error;
  }
}

/**
 * Fetch semua produk dengan filter opsional
 */
export async function getProducts(filters?: {
  categoryId?: number;
  sort?: string;
  isPromo?: boolean;
  isTrending?: boolean;
  limit?: number;
}) {
  return callGAS({
    action: "getProducts",
    ...filters,
  });
}

/**
 * Fetch detail produk berdasarkan ID
 */
export async function getProduct(id: number) {
  return callGAS({
    action: "getProduct",
    id,
  });
}

/**
 * Fetch produk featured
 */
export async function getFeaturedProducts() {
  return callGAS({
    action: "getProducts",
    limit: 10,
  });
}

/**
 * Fetch produk promo
 */
export async function getPromoProducts() {
  return callGAS({
    action: "getProducts",
    isPromo: true,
    limit: 10,
  });
}

/**
 * Fetch produk trending
 */
export async function getTrendingProducts() {
  return callGAS({
    action: "getProducts",
    isTrending: true,
    limit: 10,
  });
}

/**
 * Fetch semua kategori
 */
export async function getCategories() {
  return callGAS({
    action: "getCategories",
  });
}

/**
 * Fetch profil user berdasarkan ID
 */
export async function getUser(id: string) {
  return callGAS({
    action: "getUser",
    id,
  });
}

/**
 * Fetch semua voucher yang tersedia untuk ditukar
 */
export async function getAvailableVouchers() {
  return callGAS({
    action: "getAvailableVouchers",
  });
}

/**
 * Fetch voucher yang sudah ditukar oleh user
 */
export async function getUserVouchers(userId: string) {
  return callGAS({
    action: "getUserVouchers",
    userId,
  });
}

/**
 * Fetch riwayat poin user
 */
export async function getPointsHistory(userId: string) {
  return callGAS({
    action: "getPointsHistory",
    userId,
  });
}

/**
 * Tukar poin user dengan voucher
 */
export async function redeemVoucher(userId: string, voucherId: number) {
  const config = getConfig();
  if (!config) {
    throw new Error("Config not loaded. Call setupApiClient() first.");
  }

  const url = `${config.apiBaseUrl}?action=redeemVoucher`;

  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        voucherId,
      }),
    });

    if (!response.ok) {
      throw new Error(`GAS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error redeeming voucher:", error);
    throw error;
  }
}

/**
 * Update XP user
 */
export async function updateUserXP(userId: string, xpToAdd: number) {
  const config = getConfig();
  if (!config) {
    throw new Error("Config not loaded. Call setupApiClient() first.");
  }

  const url = `${config.apiBaseUrl}?action=updateUserXP`;

  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        xpToAdd,
      }),
    });

    if (!response.ok) {
      throw new Error(`GAS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user XP:", error);
    throw error;
  }
}

/**
 * Inisialisasi user baru atau cek apakah user sudah terdaftar
 */
export async function initializeUser(userId: string, name?: string, email?: string) {
  return callGAS({
    action: "initializeUser",
    id: userId,
    name,
    email,
  });
}
