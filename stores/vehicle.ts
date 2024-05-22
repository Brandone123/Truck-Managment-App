import { defineStore } from 'pinia';

export interface Address {
    id: number | null;
    name: string | null;
}

export interface ReverseGeo {
    formattedLocation: string | null;
}

export interface EngineStable {
    time?: string | null;
    value?: boolean | null;
}

export interface Samsara {
    vin: string | null;
}

export interface ObdOdometer {
    time: string | null;
    value: number | null;
}

export interface Gps {
    time: string | null;
    address?: Address;
    latitude: number | null;
    longitude: number | null;
    isEcuSpeed: boolean | null;
    reverseGeo?: ReverseGeo;
    headingDegrees: number | null;
    speedMilesPerHour: number | null;
}

export interface Diagnostics {
    id: number | null;
    gps?: Gps;
    name: string | null;
    engineStable?: EngineStable;
    externalIds?: Samsara;
    obdOdometerMeters?: ObdOdometer;
}

export interface AssetInfo {
    id: number | null;
    yard_id: number | null;
    asset_name: string | null;
    asset_type: string | null;
    diagnostic_type: string | null;
    recorded_at: string | null;
    diagnostics?:  string;//Diagnostics;
    status: string | null;
}

interface State {
    vehicleList: AssetInfo[],
    loading: boolean,
}

export const useVehicleStore = defineStore('vehicle', {
    state: (): State => ({
        loading: false,
        vehicleList: []
    }),

    getters: {
        getVehicleList: (state) => { return state.vehicleList }
    },
    actions: {

          async fetchVehicleList() {
            this.loading = true
            const { data, error } = await useApiFetch('/api/yardcheck/vehicles');
            if (error.value) {
              useLayoutStore().setStatusMessage('Failed to fetch Vehicle list', 'error')
            } else {
              this.vehicleList = data.value as AssetInfo[];
            }
            this.loading = false
          },
    },
})
