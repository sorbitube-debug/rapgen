/// <reference types="vite/client" />

/** مقادیر از vite.config define در بیلد جایگزین می‌شوند */
declare const process: {
  env: {
    SUPABASE_URL?: string;
    SUPABASE_KEY?: string;
    GEMINI_API_KEY?: string;
    API_KEY?: string;
  };
};
