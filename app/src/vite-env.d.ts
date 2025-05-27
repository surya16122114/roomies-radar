// vite-env.d.ts (or any .d.ts file in your src folder)
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // add other VITE_ env vars if needed
    readonly VITE_PUBLIC_URL : string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }