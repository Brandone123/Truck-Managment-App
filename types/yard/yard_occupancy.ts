import type { VehicleInYardInfo } from "./yard";
export interface YardOccupancyInfo {
  id?: number | null;
  yardId: number | null;
  name: string | null;
  totalOccupancy: number | null;
  trucks: VehicleInYardInfo[] | null;
  trailers: VehicleInYardInfo[] | null;
  alerts: string[] | null;
}