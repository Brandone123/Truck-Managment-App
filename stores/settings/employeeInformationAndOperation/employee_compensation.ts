import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { EmployeeCompensationInfo } from '~/types/employeeInformationAndOperation/employee_compensation';

interface State {
  employeeCompensationList: EmployeeCompensationInfo[];
  loading: boolean;
}

export const useEmployeeCompensationStore = defineStore('employee_compensation', {
  state: (): State => ({
    employeeCompensationList: [],
    loading: false,
  }),

  getters: {
    getEmployeeCompensationList: (state) => { return state.employeeCompensationList }
  },

  actions: {
    clearEmployeeCompensationList() {
      this.employeeCompensationList = [];
    },

    async fetchEmployeeCompensationList(employeeId: number) {
      this.loading = true
      const { data, error } = await useApiFetch(`/api/eio/compensations/${employeeId}`);
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch employee compensation list', 'error')
      } else {
        this.employeeCompensationList = data.value as EmployeeCompensationInfo[];
      }
      this.loading = false
    },

    async createEmployeeCompensation(payload: EmployeeCompensationInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch(`/api/eio/compensations`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create employee compensation', 'error');
      } else {
        let response = data.value as EmployeeCompensationInfo;
        this.employeeCompensationList.push(response)
        useLayoutStore().setStatusMessage('employee compensation created', 'primary');
      }
    },

    async updateEmployeeCompensation(payload: EmployeeCompensationInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/eio/compensations/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update employee compensation', 'error');
      } else {
        let response = data.value as EmployeeCompensationInfo
        let index = this.employeeCompensationList.findIndex(item => item.id === response.id)
        if (index > -1) {
          this.employeeCompensationList[index] = Object.assign({}, response)
        }
        useLayoutStore().setStatusMessage('Employee compensation updated', 'primary');
      }
    },

    async deleteEmployeeCompensation(compliance_and_ethics_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/eio/compensations/${compliance_and_ethics_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete employee compensation', 'error');
      }
      else {
        const index = this.employeeCompensationList.findIndex((item) => item.id === compliance_and_ethics_id);
        if (index > -1) {
          this.employeeCompensationList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Employee compensation deleted', 'primary');
      }
    },



    // BULK ACTIONS

    async bulkDeleteEmployeeCompensation(employeeCompensationIds: number[]): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch('/api/eio/compensations/bulk_delete', {
        method: 'POST',
        body: { ids: employeeCompensationIds }
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete employee compensations', 'error');
      }
      else {
        employeeCompensationIds.forEach(compensationId => {
          let index = this.employeeCompensationList.findIndex((item) => item.id === compensationId);
          if (index > -1) {
            this.employeeCompensationList.splice(index, 1);
          }
        })
        useLayoutStore().setStatusMessage('Employment compensations deleted', 'primary');
      }
    },

    async bulkUpdateEmployeeCompensation(payload: { ids: Number[], data: EmployeeCompensationInfo }) {
      return new Promise<{ success?: Boolean, error?: Boolean, }>(async (resolve, reject) => {
        useLayoutStore().setOverlay(true)
        const { data, error } = await useApiFetch('/api/eio/compensations/bulk_update', {
          method: 'POST',
          body: payload,
        });
        useLayoutStore().setOverlay(false)

        if (error.value) {
          useLayoutStore().setStatusMessage('Failed to update employee compensations', 'error');
          reject({ error: true })
        } else {
          let response = data.value as EmployeeCompensationInfo[]
          response.forEach(EmploymentHistory => {
            let index = this.employeeCompensationList.findIndex(item => item.id === EmploymentHistory.id)
            if (index > -1) {
              this.employeeCompensationList[index] = Object.assign({}, EmploymentHistory)
            }
          })
          useLayoutStore().setStatusMessage('Employment compensations updated', 'primary');
          resolve({ success: true })
        }
      })
    }
  }
})