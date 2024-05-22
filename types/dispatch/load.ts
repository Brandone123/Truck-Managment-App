import type { LoadReservationInfo } from "./load_reservation";
import type { LoadDispatchInfo } from "./load_dispatch";

export interface LoadRouteInfo {
  id?: number | null;
  route_number?: string | null;
  directions: google.maps.DirectionsResult
}

export interface EdiCommunicationInfo {
  stop_id : number;
  MessageType: string;
  TransactionSetID: string | null;
  ReferenceID: string | null;
  Status: string;
  Payload: string | null;
  SentReceivedDateTime: string;
}
export interface LocationInfo {
    id: number;
    Name: string;
    LocationCode: string | null;
    AddressLine: string;
    City: string;
    State: string;
    PostalCode: string;
    CountryCode: string;
    latitude: number;
    longitude: number;
  }
  
export interface  StopInfo {
    id: number;
    load_id: number;
    location_id: number;
    sequence: number;
    scheduled_arrival_datetime: Date;
    actual_arrival_datetime: Date | null;
    scheduled_departure_datetime: Date;
    actual_departure_datetime: Date | null;
    StopReferenceNumber: string | null;
    StopNotes: string | null;
    stop_type: string;

    earliest_date: string | null;
    earliest_time: string | null;
    latest_date: string | null;
    latest_time: string | null;
    stop_reason: string | null;

    location: LocationInfo;
  }
export interface RouteInfo {
    id: number | null;
    name: string | null;
}

export interface CommodityInfo {
    id?: number | null;
    matrix?: number | null;
    commodity?: number | null;
    reference?: string | null;
    description?: string | null;
    notes?: string | null;
    actual_weight?: number | null;
    tarrif_weight?: number | null;
    as_weight?: number | null;
    pieces?: number | null;
    space?: string | null;
    seats?: string | null;
    value?: string | null;
    measure?: string | null;
    length?: string | null;
    width?: string | null;
    height?: string | null;
    volume?: string | null;
    stackable?: boolean
    floor_board?: boolean;
}
export interface LoadInfo {
    id: number | null;
    customer_id: number | null;
    tender_id: number | null;
    route_number: string | null;
    reference_number: string | null;
    Status: string | null;
    actual_pickup_datetime: string | null;
    actual_delivery_datetime: string | null;
    current_driver_id: string | null;
    current_truck_id: string | null;
    current_trailer_id: string | null;
    SpecialInstructions: string | null;
    TotalWeight: string | null;
    TotalCharges: string | null;
    WeightUnit: string | null;
    ChargesUnit: string | null;
    ScheduledDate: string | null;
    ScheduledTime: string | null;
    equipment_id: number | null;
    notes: string | null;

    stops: StopInfo[];
    load_route?: LoadRouteInfo;
    edi_communication?: EdiCommunicationInfo[];

    reservation?: LoadReservationInfo| null;
    dispatch?: LoadDispatchInfo | null;
    carrier_id?: number | null,
    dispatcher_id?: number | null,
}
