import { defineStore } from 'pinia';

export interface ShipmentStatusInfo {
    id: number | null;
    load_id: number | null;
    location_id: number | null;
    Status: string | null;
    StatusDateTime: string | null;
    StatusNotes: string | null;
}

interface State {
    shipmentStatusList: ShipmentStatusInfo[],
    loading: boolean,
}

export const useShipmentStatusStore = defineStore('shipment_status', {
    state: (): State => ({
        loading: false,
        shipmentStatusList: []
    }),

    getters: {
        getShipmentStatusList: (state) => { return state.shipmentStatusList }
    },
    actions: {

          async fetchShipmentStatusList() {
            this.loading = true
            const { data, error } = await useApiFetch('/api/dispatch/shipment-status');
            console.log(data.value);
            if (error.value) {
              useLayoutStore().setStatusMessage('Failed to fetch Shipment Status list', 'error')
            } else {
              this.shipmentStatusList = data.value as ShipmentStatusInfo[];
            }
            this.loading = false
          },
    },
})
