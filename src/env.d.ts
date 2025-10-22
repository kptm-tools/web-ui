declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

interface ImportMetaEnv {
  readonly VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED?: string;
  readonly VITE_PRISM_MODE?: string;
  readonly VITE_BYPASS_AUTH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Runtime config injected via public/config.js
interface AppRuntimeConfig {
  API_BASE_URL: string;
  WS_BASE_URL: string;
  FEATURE_COMPLIANCE_FRAMEWORK_ENABLED: string;
}

interface Window {
  APP_CONFIG?: AppRuntimeConfig;
}
