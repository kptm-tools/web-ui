// Type declarations for runtime configuration
interface AppConfig {
  API_BASE_URL: string;
  WS_BASE_URL: string;
  FEATURE_COMPLIANCE_FRAMEWORK_ENABLED: string;
}

declare global {
  interface Window {
    APP_CONFIG?: AppConfig;
  }
}

export { AppConfig };
