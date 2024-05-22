import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { DispatchLocationInfo } from '~/types/dispatch/location';

interface State {
  dispatchLocationList: DispatchLocationInfo[];
  loading: boolean
}

export const useDispatchLocationStore = defineStore('dispatch_location', {
  state: (): State => ({
    dispatchLocationList: [],
    loading: false
  }),

  getters: {
    getDispatchLocationList: (state) => { return state.dispatchLocationList }
  },

  actions: {
    async fetchDispatchLocationList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/dispatch/locations');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch dispatch location list', 'error')
      } else {
        this.dispatchLocationList = data.value as DispatchLocationInfo[];
      }
      this.loading = false
    },

    async createDispatchLocation(payload: DispatchLocationInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch('/api/dispatch/locations', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create dispatch location', 'error');
        return {error: error.value}
      } else {
        let dispatch_location = data.value as DispatchLocationInfo;
        this.dispatchLocationList.push(dispatch_location)
        useLayoutStore().setStatusMessage('Dispatch location created', 'primary');
        return {data: data.value}
      }
    },

    async updateDispatchLocation(payload: DispatchLocationInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/dispatch/locations/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update dispatch location', 'error');
      } else {

        console.log(JSON.stringify(data.value))
        let response = data.value as DispatchLocationInfo
        let index = this.dispatchLocationList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.dispatchLocationList[index], response)
        }
        useLayoutStore().setStatusMessage('Dispatch location updated', 'primary');
      }
    },

    async deleteDispatchLocation(dispatch_location_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/dispatch/locations/${dispatch_location_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        console.error('Failed to delete dispatch location', error.value);
        useLayoutStore().setStatusMessage('Failed to delete dispatch location', 'error');
      }
      else {
        const index = this.dispatchLocationList.findIndex((dispatch_location) => dispatch_location.id === dispatch_location_id);
        if (index > -1) {
          this.dispatchLocationList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Dispatch location deleted', 'primary');
      }
    },
  },
})
