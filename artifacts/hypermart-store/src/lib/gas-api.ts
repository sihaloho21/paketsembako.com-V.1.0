/**
 * Google Apps Script API Wrapper
 */

import { getConfig } from "./config";

export interface GASRequestParams {
  action: string;
  [key: string]: string | number | boolean | undefined;
}

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
 */
export async function callGAS<T = any>(params: GASRequestParams, body?: any): Promise<T> {
  const config = getConfig();
  if (!config) {
    throw new Error("Config not loaded. Call setupApiClient() first.");
  }

  const queryString = buildQueryString(params);
  const url = `${config.apiBaseUrl}?${queryString}`;

  try {
    const response = await fetch(url, {
      method: body ? "POST" : "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "text/plain;charset=utf-8", // GAS expects text/plain for POST to avoid CORS preflight
      },
      body: body ? JSON.stringify(body) : undefined,
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

export async function getProducts(filters?: {
  categoryId?: number;
  sort?: string;
  isPromo?: boolean;
  isTrending?: boolean;
  limit?: number;
}) {
  return callGAS({ action: "getProducts", ...filters });
}

export async function getProduct(id: number) {
  return callGAS({ action: "getProduct", id });
}

export async function getFeaturedProducts() {
  return callGAS({ action: "getProducts", limit: 10 });
}

export async function getPromoProducts() {
  return callGAS({ action: "getProducts", isPromo: true, limit: 10 });
}

export async function getTrendingProducts() {
  return callGAS({ action: "getProducts", isTrending: true, limit: 10 });
}

export async function getCategories() {
  return callGAS({ action: "getCategories" });
}

/**
 * Sync cart with GAS backend
 */
export async function fetchCart(userId: string) {
  return callGAS({ action: "getCart", userId });
}

export async function saveCartToBackend(userId: string, cart: any) {
  return callGAS({ action: "saveCart" }, { action: "saveCart", userId, cart });
}
