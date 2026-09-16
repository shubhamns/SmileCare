/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_GRAPHQL_URL?: string;
  readonly VITE_PATIENT_ROUTE?: string;
  readonly VITE_DOCTOR_ROUTE?: string;
  readonly VITE_ADMIN_ROUTE?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
