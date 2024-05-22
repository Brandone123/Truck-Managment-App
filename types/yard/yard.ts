export interface YardInfo {
  id: number | null;
  name: string | null;
  location: string | null;
  capacity: number | null;
  geofence_polygon: string | null;
}

export interface TelematicsInfo {
  diagnostics: any,
  asset_name: string,
  asset_type: string,
  diagnostic_type: string,
  recorded_at: string
}

export interface VehicleInfo {
  id: number | null;
  license_plate: string | null,
  make: string | null,
  model: string | null,
  year: string | null,
  vin: string | null,
  serial: string | null,
  name: string,
  telematics?: TelematicsInfo;
}

export interface YardDetailInfo {
  id: number | null;
  name: string | null;
  location: string | null;
  capacity: number | null;
  vehicles: VehicleInYardInfo;
}

export interface VehicleInYardInfo {
  vehicle_id?: string | null;
  asset_type?: string | null;
  entry_time?: string | null;
  vehicle_details?: VehicleInfo;
}