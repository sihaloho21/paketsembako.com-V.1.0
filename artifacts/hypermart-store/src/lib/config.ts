/**
 * Configuration management untuk aplikasi
 * Fetch config.json saat aplikasi load dan setup base URL untuk API client
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

let cachedConfig: AppConfig | null = null;
const CONFIG_CACHE_KEY = "app_config_cache";
const CONFIG_VERSION_KEY = "app_config_version";

/**
 * Fetch dan cache konfigurasi dari public/config.json
 */
export async function loadConfig(): Promise<AppConfig> {
  try {
    // Cek cache di localStorage terlebih dahulu
    const cachedVersion = localStorage.getItem(CONFIG_VERSION_KEY);
    const cachedData = localStorage.getItem(CONFIG_CACHE_KEY);

    // Fetch config terbaru dari server
    const response = await fetch("/config.json", {
      cache: "no-cache", // Selalu fetch yang terbaru
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.statusText}`);
    }

    const config: AppConfig = await response.json();

    // Jika versi berbeda, reload aplikasi untuk memastikan config baru diterapkan
    if (cachedVersion && cachedVersion !== config.version && cachedData) {
      console.log("Config version changed, reloading application...");
      localStorage.setItem(CONFIG_VERSION_KEY, config.version);
      localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(config));
      // Reload aplikasi untuk menerapkan config baru
      window.location.reload();
      return config;
    }

    // Simpan config ke cache
    localStorage.setItem(CONFIG_VERSION_KEY, config.version);
    localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(config));
    cachedConfig = config;

    return config;
  } catch (error) {
    console.error("Error loading config:", error);

    // Fallback ke cache jika ada
    const cachedData = localStorage.getItem(CONFIG_CACHE_KEY);
    if (cachedData) {
      console.log("Using cached config");
      const parsedConfig = JSON.parse(cachedData) as AppConfig;
      cachedConfig = parsedConfig;
      return parsedConfig;
    }

    // Fallback ke default config
    const defaultConfig: AppConfig = {
      version: "1.0.0",
      apiBaseUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/usercontent",
      apiTimeout: 30000,
      features: {
        cart: true,
        wishlist: false,
        reviews: false,
      },
    };

    console.warn("Using default config");
    return defaultConfig;
  }
}

/**
 * Get config yang sudah di-cache
 */
export function getConfig(): AppConfig | null {
  return cachedConfig;
}

/**
 * Setup base URL untuk API client (React Query)
 */
export async function setupApiClient(): Promise<void> {
  const config = await loadConfig();
  // Import setBaseUrl dari custom-fetch
  const { setBaseUrl } = await import("@workspace/api-client-react");
  setBaseUrl(config.apiBaseUrl);
}
