// Type declarations for runtime configuration
interface AppConfig {
  API_BASE_URL: string;
  WS_BASE_URL: string;
}

declare global {
  interface Window {
    APP_CONFIG?: AppConfig;
  }
}

export {};