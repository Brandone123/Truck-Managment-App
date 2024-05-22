import { defineStore } from 'pinia';
import type { CarrierInfo } from '~/types/dispatch/carrier';

interface State {
    carrierList: CarrierInfo[]
    loading: boolean
}

export const useCarrierStore = defineStore('carrier', {
    state: (): State => ({
        carrierList: [],
        loading: false
    }),

    getters: {
        getCarrierList: (state) => {return state.carrierList}
    },
    actions: {
        async fetchCarrierList(){
            this.loading = true
            const {data, error} = await useApiFetch('/api/dispatch/carriers');
            if(error.value){
              useLayoutStore().setStatusMessage('Failed to fetch carrier list', 'error')
            }else {
              this.carrierList = data.value as CarrierInfo[];
            }
            this.loading = false
          },
          async createCarrier(payload: CarrierInfo) {
            useLayoutStore().setOverlay(true)
          
            const  { error, data } = await useApiFetch('/api/dispatch/carriers', {
              method: 'POST',
              body: payload,
            });
            useLayoutStore().setOverlay(false)
      
            if (error.value) {
              useLayoutStore().setStatusMessage('Failed to create Carrier', 'error');
            } else {
              let carrier = data.value as CarrierInfo;
              this.carrierList.push(carrier)
              useLayoutStore().setStatusMessage('Carrier created', 'primary');
            }
          },
      
          async updateCarrier(payload: CarrierInfo) {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch(`/api/dispatch/carriers/${payload.id}`, {
              method: 'PUT',
              body: payload,
            });
            useLayoutStore().setOverlay(false)
      
            if (error.value) {
              useLayoutStore().setStatusMessage('Failed to update carrier', 'error');
            } else {
              let response = data.value as CarrierInfo
              let index = this.carrierList.findIndex(item => item.id === response.id)
              if (index > -1) {
                Object.assign(this.carrierList[index], response)
              }
              useLayoutStore().setStatusMessage('Carrier updated', 'primary');
            }
          },
      
          async deleteCarrier(carrier_id: number): Promise<void> {
            useLayoutStore().setOverlay(true)
            const { error } = await useApiFetch(`/api/dispatch/carriers/${carrier_id}`, {
              method: 'DELETE',
            });
            useLayoutStore().setOverlay(false)
      
            if (error.value) {
              useLayoutStore().setStatusMessage('Failed to delete carrier', 'error');
            }
            else {
              const index = this.carrierList.findIndex((carrier) => carrier.id === carrier_id);
              if (index > -1) {
                this.carrierList.splice(index, 1);
              }
              useLayoutStore().setStatusMessage('Carrier deleted', 'primary');
            }
          },


    },
})
