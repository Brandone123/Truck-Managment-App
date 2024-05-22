import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { DailyDutyInfo } from '~/types/employeeInformationAndOperation/position';

interface State {
  dailyDutyList: DailyDutyInfo[];
  loading: boolean;
}

export const useDailyDutyStore = defineStore('daily_duty', {
  state: (): State => ({
    dailyDutyList: [],
    loading: false,
  }),

  getters: {
    getDailyDutyList: (state) => { return state.dailyDutyList }
  },

  actions: {
    async fetchDailyDutyList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/eio/duties');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch duty list', 'error')
      } else {
        this.dailyDutyList = data.value as DailyDutyInfo[];
      }
      this.loading = false
    },

    async createDuty(payload: DailyDutyInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch(`/api/eio/positions/${payload.position_id}/duties`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create duty', 'error');
      } else {
        let duty = data.value as DailyDutyInfo;
        this.dailyDutyList.push(duty)
        useLayoutStore().setStatusMessage('Duty created', 'primary');
      }
    },

    async updateDuty(payload: DailyDutyInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/eio/duties/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update duty', 'error');
      } else {
        let response = data.value as DailyDutyInfo
        let index = this.dailyDutyList.findIndex(item => item.id === response.id)
        if (index > -1) {
          this.dailyDutyList[index] = Object.assign({}, response)
        }
        useLayoutStore().setStatusMessage('Duty updated', 'primary');
      }
    },

    async deleteDuty(duty_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/eio/duties/${duty_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        console.error('Failed to delete duty', error.value);
        useLayoutStore().setStatusMessage('Failed to delete duty', 'error');
      }
      else {
        const index = this.dailyDutyList.findIndex((duty) => duty.id === duty_id);
        if (index > -1) {
          this.dailyDutyList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Duty deleted', 'primary');
      }
    },
  },
})