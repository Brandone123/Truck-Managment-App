import type { TrailerInfo } from "./trailer";
import type { TruckInfo } from "./truck";
import type { DriverInfo } from "../store/driver";

export interface LoadReservationInfo {
  id: number;
  load_id: number;
  driver_id: number;
  truck_id: number | null;
  trailer_id: number | null;
  status: string; // e.g., reserved, accepted, rejected

  truck?: TruckInfo | null;
  trailer?: TrailerInfo | null;
  driver?: DriverInfo | null;
};