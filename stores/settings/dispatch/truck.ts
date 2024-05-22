import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { TruckInfo } from '~/types/dispatch/truck';

interface State {
  truckList: TruckInfo[];
  loading: boolean
}

export const useTruckStore = defineStore('truck', {
  state: (): State => ({
    truckList: [],
    loading: false
  }),

  getters: {
    getTruckList: (state) => { return state.truckList }
  },

  actions: {
    async fetchTruckList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/shared/trucks');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch truck list', 'error')
      } else {
        this.truckList = data.value as TruckInfo[];
      }
      this.loading = false
    },

    async createTruck(payload: TruckInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch('/api/shared/trucks', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create truck', 'error');
      } else {
        let truck = data.value as TruckInfo;
        this.truckList.push(truck)
        useLayoutStore().setStatusMessage('Truck created', 'primary');
      }
    },

    async updateTruck(payload: TruckInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/shared/trucks/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update truck', 'error');
      } else {

        console.log(JSON.stringify(data.value))
        let response = data.value as TruckInfo
        let index = this.truckList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.truckList[index], response)
        }
        useLayoutStore().setStatusMessage('Truck updated', 'primary');
      }
    },

    async deleteTruck(truck_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/shared/trucks/${truck_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        console.error('Failed to delete truck', error.value);
        useLayoutStore().setStatusMessage('Failed to delete truck', 'error');
      }
      else {
        const index = this.truckList.findIndex((truck) => truck.id === truck_id);
        if (index > -1) {
          this.truckList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Truck deleted', 'primary');
      }
    },
  },
})
