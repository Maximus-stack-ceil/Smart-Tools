/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADSTERRA_BANNER_KEY?: string;
  readonly VITE_ADSTERRA_NATIVE_SCRIPT_URL?: string;
  readonly VITE_ADSTERRA_NATIVE_CONTAINER_ID?: string;
  [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
