import { defineStore } from 'pinia';
import { useApiFetch } from "@/composables/useApiFetch";
import type { LoadInfo } from '@/types/dispatch/load';
import type { LoadReservationInfo } from '~/types/dispatch/load_reservation';
import type { LoadDispatchInfo } from '~/types/dispatch/load_dispatch';

interface State {
  scheduleLoadList: LoadInfo[];
  loading: boolean
}

export const useScheduleLoadStore = defineStore('schedule_load', {
  state: (): State => ({
    scheduleLoadList: [],
    loading: false
  }),

  getters: {
    getAvailableLoadList: (state) => { return state.scheduleLoadList }
  },

  actions: {
    async fetchAvailableLoadList() {
      this.loading = true
      const params = { Status: ['Booked', 'Reserved', 'Dispatched'] }

      const queryString = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => {
            queryString.append(key+ '[]', item);
          });
        } else {
          queryString.append(key, value);
        }
      });

      const { data, error } = await useApiFetch('/api/dispatch/loads' + '?' + queryString.toString());
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch load dispatch list', 'error')
      } else {
        this.scheduleLoadList = data.value as LoadInfo[];
      }
      this.loading = false
    },

    async updateStatus(payload: LoadInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/dispatch/loads/${payload.id}`,{
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update load status ', 'error')
      } else {
        
        let response = data.value as LoadInfo
        let index = this.scheduleLoadList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.scheduleLoadList[index], response)
        }
        useLayoutStore().setStatusMessage('Load status updated ', 'primary')
      }
      this.loading = false
    },
    
    async fetchLoadDispatch(load_id: number) {
      const { data, error } = await useApiFetch(`/api/dispatch/load-dispatches/${load_id}`);
      if (error.value) {
        // useLayoutStore().setStatusMessage('Failed to get load reservation', 'error');
      } else {
        let response = data.value as LoadDispatchInfo
        let index = this.scheduleLoadList.findIndex(item => item.id === load_id)
        if (index > -1) {
          this.scheduleLoadList[index].dispatch = response
        }
      }
    },


    async createDispatch(payload: LoadDispatchInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/dispatch/load-dispatches`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update load dispatch', 'error');
      } else {

        console.log(JSON.stringify(data.value))
        let response = data.value as LoadDispatchInfo
        let index = this.scheduleLoadList.findIndex(item => item.id === response.load_id)
        if (index > -1) {
          this.scheduleLoadList[index].dispatch = response

         await useScheduleLoadStore().getLoadById(response.load_id)
        }
        useLayoutStore().setStatusMessage('Load dispatch updated', 'primary');
      }
    },

    async getLoadById(loadId: number){
      const { data, error } = await useApiFetch(`/api/dispatch/loads/${loadId}`);
      if(error.value){
        useLayoutStore().setStatusMessage('Failed to get load details', 'error');
      }else{
        let response = data.value as LoadInfo
        let index = this.scheduleLoadList.findIndex(item => item.id === response.id)
        if (index > -1) {
          this.scheduleLoadList[index] = response
        }
      }
    },

    async updateDispatch(payload: LoadDispatchInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/dispatch/load-dispatches/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update load dispatch', 'error');
      } else {

        let response = data.value as LoadDispatchInfo
        let index = this.scheduleLoadList.findIndex(item => item.id === response.load_id)
        if (index > -1) {
          this.scheduleLoadList[index].dispatch = response
        }
        useLayoutStore().setStatusMessage('Load dispatch updated', 'primary');
      }
    },

    async fetchLoadReservation(load_id: number) {
      const { data, error } = await useApiFetch(`/api/dispatch/load-reservations/load/${load_id}`);
      if (error.value) {
        // useLayoutStore().setStatusMessage('Failed to get load reservation', 'error');
      } else {
        let response = data.value as LoadReservationInfo
        let index = this.scheduleLoadList.findIndex(item => item.id === load_id)
        if (index > -1) {
          this.scheduleLoadList[index].reservation = response
        }
      }
    },

    async createReservation(payload: LoadReservationInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/dispatch/load-reservations`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update load dispatch', 'error');
      } else {

        console.log(JSON.stringify(data.value))
        let response = data.value as LoadReservationInfo
        let index = this.scheduleLoadList.findIndex(item => item.id === response.load_id)
        if (index > -1) {
          this.scheduleLoadList[index].reservation = response
        }
        useLayoutStore().setStatusMessage('Load dispatch updated', 'primary');
      }
    },

    async updateReservation(payload: LoadReservationInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/dispatch/load-reservations/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update load reservation', 'error');
      } else {

        let response = data.value as LoadReservationInfo
        let index = this.scheduleLoadList.findIndex(item => item.id === response.load_id)
        if (index > -1) {
          this.scheduleLoadList[index].reservation = response
        }
        useLayoutStore().setStatusMessage('Load reservation updated', 'primary');
      }
    },

    async assignTruck(payload: any){
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/dispatch/loads/${payload.load_id}/assign/truck`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to assign truck', 'error');
      } else {

        let response = data.value as LoadInfo
        let index = this.scheduleLoadList.findIndex(item => item.id === response.id)
        if (index > -1) {
          this.scheduleLoadList[index] = response
        }
        useLayoutStore().setStatusMessage('Truck assigned', 'primary');
      }
    },


    async assignTrailer(payload: any){
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/dispatch/loads/${payload.load_id}/assign/trailer`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to assign trailer', 'error');
      } else {

        let response = data.value as LoadInfo
        let index = this.scheduleLoadList.findIndex(item => item.id === response.id)
        if (index > -1) {
          this.scheduleLoadList[index] = response
        }
        useLayoutStore().setStatusMessage('Trailer assigned', 'primary');
      }
    },

    async assignDriver(payload: any){
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/dispatch/loads/${payload.load_id}/assign/driver`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to assign driver', 'error');
      } else {

        let response = data.value as LoadInfo
        let index = this.scheduleLoadList.findIndex(item => item.id === response.id)
        if (index > -1) {
          this.scheduleLoadList[index] = response
        }
        useLayoutStore().setStatusMessage('Driver assigned', 'primary');
      }
    },

    // async deleteLoadReservation(load_reservation_id: number): Promise<void> {
    //   useLayoutStore().setOverlay(true)
    //   const { error } = await useApiFetch(`/api/dispatch/load-reservations/${load_reservation_id}`, {
    //     method: 'DELETE',
    //   });
    //   useLayoutStore().setOverlay(false)

    //   if (error.value) {
    //     console.error('Failed to delete load reservation', error.value);
    //     useLayoutStore().setStatusMessage('Failed to delete load reservation', 'error');
    //   }
    //   else {
    //     const index = this.loadReservationList.findIndex((load_reservation) => load_reservation.id === load_reservation_id);
    //     if (index > -1) {
    //       this.loadReservationList.splice(index, 1);
    //     }
    //     useLayoutStore().setStatusMessage('Load reservation deleted', 'primary');
    //   }
    // },


    // async dispatchLoad(payload: LoadDispatchInfo) {
    //   useLayoutStore().setOverlay(true)
    //   const { data, error } = await useApiFetch(`/api/dispatch/load/${payload.id}`, {
    //     method: 'PUT',
    //     body: payload,
    //   });
    //   useLayoutStore().setOverlay(false)

    //   if (error.value) {
    //     useLayoutStore().setStatusMessage('Failed to update load dispatch', 'error');
    //   } else {

    //     console.log(JSON.stringify(data.value))
    //     let response = data.value as LoadDispatchInfo
    //     let index = this.reservedLoadList.findIndex(item => item.id === response.id)
    //     if (index > -1) {
    //       Object.assign(this.reservedLoadList[index], response)
    //     }
    //     useLayoutStore().setStatusMessage('Load dispatch updated', 'primary');
    //   }
    // },
  },
})