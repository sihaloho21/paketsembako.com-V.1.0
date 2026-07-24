/**
 * API Wrapper for Frontend
 * Backend functionality has been removed.
 */

export interface GASRequestParams {
  action: string;
  [key: string]: string | number | boolean | undefined;
}

export async function callGAS<T = any>(_params: GASRequestParams): Promise<T> {
  return Promise.resolve({} as T);
}

export async function getProducts(_filters?: any) {
  return Promise.resolve([]);
}

export async function getProduct(_id: number) {
  return Promise.resolve(null);
}

export async function getFeaturedProducts() {
  return Promise.resolve([]);
}

export async function getPromoProducts() {
  return Promise.resolve([]);
}

export async function getTrendingProducts() {
  return Promise.resolve([]);
}

export async function getCategories() {
  return Promise.resolve([]);
}

export async function getUser(_id: string) {
  return Promise.resolve(null);
}

export async function getAvailableVouchers() {
  return Promise.resolve([]);
}

export async function getUserVouchers(_userId: string) {
  return Promise.resolve([]);
}

export async function getPointsHistory(_userId: string) {
  return Promise.resolve([]);
}

export async function redeemVoucher(_userId: string, _voucherId: number) {
  return Promise.resolve({ success: true });
}

export async function updateUserXP(_userId: string, _xpToAdd: number) {
  return Promise.resolve({ success: true });
}

export async function initializeUser(_userId: string, _name?: string, _email?: string) {
  return Promise.resolve({ success: true });
}
