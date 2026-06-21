export type LicenseStatus = "active" | "disabled" | "expired";

export interface License {
  id: string;
  user_id: string;
  product_id: string;
  license_key: string;
  machine_limit: number;
  status: LicenseStatus;
  created_at: string;
  expires_at: string | null;
}
