export interface DispatchLocationInfo {
    id: number;
    Name: string;
    LocationCode?: string | null;
    AddressLine: string;
    AddressLine_2?: string | null;
    City: string;
    State: string;
    PostalCode?: string | null;
    CountryCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    contact?: string | null;
    phone?: string | null;
    GeofenceRadius?: number | null;
  }