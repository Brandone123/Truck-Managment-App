import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { EmploymentHistoryInfo } from '~/types/employeeInformationAndOperation/employment_history';

interface State {
  employmentHistoryList: EmploymentHistoryInfo[];
  loading: boolean;
}

export const useEmploymentHistoryStore = defineStore('employment_history', {
  state: (): State => ({
    employmentHistoryList: [],
    loading: false,
  }),

  getters: {
    getEmploymentHistoryList: (state) => { return state.employmentHistoryList }
  },

  actions: {

    clearEmploymentHistoryList() {
      this.employmentHistoryList = [];
    },

    async fetchEmploymentHistoryList(employeeId: number) {
      this.loading = true
      const { data, error } = await useApiFetch(`/api/eio/employment-history/${employeeId}`);
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch employment history list', 'error')
      } else {
        this.employmentHistoryList = data.value as EmploymentHistoryInfo[];
      }
      this.loading = false
    },

    async createEmploymentHistory(payload: EmploymentHistoryInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch(`/api/eio/employment-history`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create employment history', 'error');
      } else {
        let response = data.value as EmploymentHistoryInfo;
        this.employmentHistoryList.push(response)
        useLayoutStore().setStatusMessage('employment history created', 'primary');
      }
    },

    async updateEmploymentHistory(payload: EmploymentHistoryInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/eio/employment-history/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update employment history', 'error');
      } else {
        let response = data.value as EmploymentHistoryInfo
        let index = this.employmentHistoryList.findIndex(item => item.id === response.id)
        if (index > -1) {
          this.employmentHistoryList[index] = Object.assign({}, response)
        }
        useLayoutStore().setStatusMessage('Employment history updated', 'primary');
      }
    },

    async deleteEmploymentHistory(employmet_history_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/eio/employment-history/${employmet_history_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete employment history', 'error');
      }
      else {
        const index = this.employmentHistoryList.findIndex((item) => item.id === employmet_history_id);
        if (index > -1) {
          this.employmentHistoryList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Employment history deleted', 'primary');
      }
    },



    // BULK ACTIONS

    async bulkDeleteEmploymentHistory(employmentHistoryIds: number[]): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch('/api/eio/employment-history/bulk_delete', {
        method: 'POST',
        body: { ids: employmentHistoryIds }
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete employment histories', 'error');
      }
      else {
        employmentHistoryIds.forEach(employmentHistoryId => {
          let index = this.employmentHistoryList.findIndex((item) => item.id === employmentHistoryId);
          if (index > -1) {
            this.employmentHistoryList.splice(index, 1);
          }
        })
        useLayoutStore().setStatusMessage('Employment histories deleted', 'primary');
      }
    },

    async bulkUpdateEmploymentHistory(payload: { ids: Number[], data: EmploymentHistoryInfo }) {
      return new Promise<{ success?: Boolean, error?: Boolean, }>(async (resolve, reject) => {
        useLayoutStore().setOverlay(true)
        const { data, error } = await useApiFetch('/api/eio/employment-history/bulk_update', {
          method: 'POST',
          body: payload,
        });
        useLayoutStore().setOverlay(false)

        if (error.value) {
          useLayoutStore().setStatusMessage('Failed to update employment histories', 'error');
          reject({ error: true })
        } else {
          let response = data.value as EmploymentHistoryInfo[]
          response.forEach(EmploymentHistory => {
            let index = this.employmentHistoryList.findIndex(item => item.id === EmploymentHistory.id)
            if (index > -1) {
              this.employmentHistoryList[index] = Object.assign({}, EmploymentHistory)
            }
          })
          useLayoutStore().setStatusMessage('Employment histories updated', 'primary');
          resolve({ success: true })
        }
      })
    }


  }
})