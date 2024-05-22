import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { PositionInfo, DailyDutyInfo } from '~/types/employeeInformationAndOperation/position';

interface State {
  positionList: PositionInfo[];
  loading: boolean;
}

export const usePositionStore = defineStore('position', {
  state: (): State => ({
    positionList: [],
    loading: false,
  }),

  getters: {
    getPositionList: (state) => { return state.positionList }
  },

  actions: {
    async fetchPositionList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/eio/positions');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch position list', 'error')
      } else {
        this.positionList = data.value as PositionInfo[];
      }
      this.loading = false
    },

    async createPosition(payload: PositionInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch('/api/eio/positions', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create position', 'error');
      } else {
        let position = data.value as PositionInfo;
        this.positionList.push(position)
        useLayoutStore().setStatusMessage('Position created', 'primary');
      }
    },

    async updatePosition(payload: PositionInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/eio/positions/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update position', 'error');
      } else {

        console.log(JSON.stringify(data.value))
        let response = data.value as PositionInfo
        let index = this.positionList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.positionList[index], response)
        }
        useLayoutStore().setStatusMessage('Position updated', 'primary');
      }
    },

    async deletePosition(position_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/eio/positions/${position_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        console.error('Failed to delete position', error.value);
        useLayoutStore().setStatusMessage('Failed to delete position', 'error');
      }
      else {
        const index = this.positionList.findIndex((position) => position.id === position_id);
        if (index > -1) {
          this.positionList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Position deleted', 'primary');
      }
    },
    //daily duties related to position
    // async createDuty(payload: DailyDutyInfo) {
    //   useLayoutStore().setOverlay(true)

    //   const { error, data } = await useApiFetch(`/api/eio/positions/${payload.position_id}/duties`, {
    //     method: 'POST',
    //     body: payload,
    //   });
    //   useLayoutStore().setOverlay(false)

    //   if (error.value) {
    //     useLayoutStore().setStatusMessage('Failed to create duty', 'error');
    //   } else {
    //     let response = data.value as DailyDutyInfo;
    //     const positionIndex = this.positionList.findIndex((position: PositionInfo) => position.id === response.position_id);
    //     if (positionIndex > -1) {
    //       this.positionList[positionIndex]?.dailyDuties?.push(response)
    //       useLayoutStore().setStatusMessage('Duty created', 'primary');
    //     }
    //   }
    // },

    // async updateDuty(payload: DailyDutyInfo) {
    //   useLayoutStore().setOverlay(true)
    //   const { data, error } = await useApiFetch(`/api/eio/duties/${payload.id}`, {
    //     method: 'PUT',
    //     body: payload,
    //   });
    //   useLayoutStore().setOverlay(false)

    //   if (error.value) {
    //     useLayoutStore().setStatusMessage('Failed to update duty', 'error');
    //   } else {
    //     let response = data.value as DailyDutyInfo
    //     const positionIndex = this.positionList.findIndex((position: PositionInfo) => position.id === response.position_id);
    //     if (positionIndex > -1) {
    //       const dailyDutyIndex = this.positionList[positionIndex].dailyDuties?.findIndex((duty: DailyDutyInfo) => duty.id == response.id) ?? -1
    //       if (dailyDutyIndex > -1) {
    //         Object.assign(this.positionList[positionIndex].dailyDuties[dailyDutyIndex], response)
    //         useLayoutStore().setStatusMessage('Duty updated', 'primary');
    //       }
    //     }
    //   }
    // },

    // async deleteDuty(position_id: number, duty_id: number): Promise<void> {
    //   useLayoutStore().setOverlay(true)
    //   const { error } = await useApiFetch(`/api/eio/duties/${duty_id}`, {
    //     method: 'DELETE',
    //   });
    //   useLayoutStore().setOverlay(false)

    //   if (error.value) {
    //     console.error('Failed to delete duty', error.value);
    //     useLayoutStore().setStatusMessage('Failed to delete duty', 'error');
    //   }
    //   else {
    //     const positionIndex = this.positionList.findIndex((position: PositionInfo) => position.id === position_id);
    //     if (positionIndex > -1) {
    //       const dutyIndex = this.positionList[positionIndex]?.dailyDuties?.findIndex((duty: DailyDutyInfo) => duty.id == duty_id) ?? -1
    //       if (dutyIndex > -1) {
    //         this.positionList[positionIndex].dailyDuties?.splice(dutyIndex, 1)
    //         useLayoutStore().setStatusMessage('Duty deleted', 'primary');
    //       }
    //     }
    //   }
    // },
  },
})