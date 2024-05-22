export interface DriverInfo {
    id: number | null;
    user_id?: number | null;
    name: string | null;
    phone?: string | null;
    email?: string | null;
    license_number?: string | null;
    license_state?: string | null;
    samsara_status?: string | null;
    category?: string | null;
    cdl_expiration?: string | null;
    mvr_due?: string | null;
    hazmat_expiration?: string | null;
    physical_due?: string | null;
    user?: {
      id?: number | null;
      name?: string | null;
      email?: string | null;
      designation?: string | null;
    };
  }