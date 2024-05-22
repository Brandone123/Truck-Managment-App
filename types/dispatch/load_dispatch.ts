import type { LoadReservationInfo } from "./load_reservation";

export interface LoadDispatchInfo {
  id: number;
  load_id: number;
  reservation_id: number;
  dispatched_at: string;
  dispatched_by: number;
  notes?: string | null;
  status: string;

  reservation?: LoadReservationInfo | null;
}