/**
 * Configuration management untuk aplikasi
 */

export interface AppConfig {
  version: string;
  apiBaseUrl: string;
  apiTimeout: number;
  features: {
    cart: boolean;
    wishlist: boolean;
    reviews: boolean;
  };
}

const defaultConfig: AppConfig = {
  version: "1.0.0",
  apiBaseUrl: "",
  apiTimeout: 30000,
  features: {
    cart: true,
    wishlist: false,
    reviews: false,
  },
};

let cachedConfig: AppConfig = defaultConfig;

/**
 * Get config
 */
export function getConfig(): AppConfig {
  return cachedConfig;
}

/**
 * Setup API client (No-op for frontend-only)
 */
export async function setupApiClient(): Promise<void> {
  // No-op
  return Promise.resolve();
}
