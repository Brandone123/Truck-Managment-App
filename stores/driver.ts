import { defineStore } from 'pinia';
import { useApiFetch } from '~/composables/useApiFetch';
import { useLayoutStore } from '~/stores/useLayoutStore';
import type { DriverInfo } from '@/types/store/driver';

interface State {
  driverList: DriverInfo[];
  loading: boolean
}

export const useDriverStore = defineStore('driver', {
  state: (): State => ({
    driverList: [],
    loading: false,
  }),

  getters: {
    getDriverList: (state) => { return state.driverList }
  },

  actions: {
    async fetchDriverList(){
      this.loading = true
      const {data, error} = await useApiFetch('/api/shared/drivers');
      if(error.value){
        useLayoutStore().setStatusMessage('Failed to fetch driver list', 'error')
      }else {
        this.driverList = data.value as DriverInfo[];
      }
      this.loading = false
    },

    async createDriver(payload: DriverInfo) {
      useLayoutStore().setOverlay(true)
    
      const  { error, data } = await useApiFetch('/api/shared/drivers', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Driver', 'error');
      } else {
        let driver = data.value as DriverInfo;
        this.driverList.push(driver)
        useLayoutStore().setStatusMessage('Driver created', 'primary');
      }
    },

    async updateDriver(payload: DriverInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/shared/drivers/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update driver', 'error');
      } else {
        let response = data.value as DriverInfo
        let index = this.driverList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.driverList[index], response)
        }
        useLayoutStore().setStatusMessage('Driver updated', 'primary');
      }
    },

    async deleteDriver(driver_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/shared/drivers/${driver_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete driver', 'error');
      }
      else {
        const index = this.driverList.findIndex((driver) => driver.id === driver_id);
        if (index > -1) {
          this.driverList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Driver deleted', 'primary');
      }
    },

    // Please add the bulk-update in the data base
    async bulkUpdatedriver(payload: { ids: number[], data: Partial<DriverInfo> }) {
      useLayoutStore().setOverlay(true);
      const { data, error } = await useApiFetch('/api/shared/drivers/bulk-update', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false);

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to bulk update drivers', 'error');
      } else {
        let response = data.value as DriverInfo
        let index = this.driverList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.driverList[index], response)
        }
        useLayoutStore().setStatusMessage('Drivers bulk updated', 'primary');
      }
    },

     // Please add the bulk-delete in the data base
    async bulkDeleteDriver(driverIds: number[]) {
      useLayoutStore().setOverlay(true);

      const { error } = await useApiFetch('/api/shared/drivers/bulk-delete', {
        method: 'POST',
        body: { driverIds },
      });

      useLayoutStore().setOverlay(false);

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to bulk delete drivers', 'error');
      } else {
        useLayoutStore().setStatusMessage('Drivers bulk deleted', 'primary');
      }
    },
  },
});