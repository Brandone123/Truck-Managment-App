import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { EmployeeFeedbackInfo } from '~/types/employeeInformationAndOperation/employee_feedback';

interface State {
  employeeFeedbackList: EmployeeFeedbackInfo[];
  loading: boolean;
}

export const useEmployeeFeedbackStore = defineStore('employee_feedback', {
  state: (): State => ({
    employeeFeedbackList: [],
    loading: false,
  }),

  getters: {
    getEmployeeFeedbackList: (state) => { return state.employeeFeedbackList }
  },

  actions: {
    async fetchEmployeeFeedbackList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/eio/feedback');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch employee feedback list', 'error')
      } else {
        this.employeeFeedbackList = data.value as EmployeeFeedbackInfo[];
      }
      this.loading = false
    },

    async createEmployeeFeedback(payload: EmployeeFeedbackInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch(`/api/eio/feedback`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create employee feedback', 'error');
      } else {
        let response = data.value as EmployeeFeedbackInfo;
        this.employeeFeedbackList.push(response)
        useLayoutStore().setStatusMessage('employee feedback created', 'primary');
      }
    },

    async updateEmployeeFeedback(payload: EmployeeFeedbackInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/eio/feedback/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update employee feedback', 'error');
      } else {
        let response = data.value as EmployeeFeedbackInfo
        let index = this.employeeFeedbackList.findIndex(item => item.id === response.id)
        if (index > -1) {
          this.employeeFeedbackList[index] = Object.assign({}, response)
        }
        useLayoutStore().setStatusMessage('Employee feedback updated', 'primary');
      }
    },

    async deleteEmployeeFeedback(compliance_and_ethics_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/eio/feedback/${compliance_and_ethics_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete employee feedback', 'error');
      }
      else {
        const index = this.employeeFeedbackList.findIndex((item) => item.id === compliance_and_ethics_id);
        if (index > -1) {
          this.employeeFeedbackList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Employee feedback deleted', 'primary');
      }
    },

        // BULK ACTIONS

        async bulkDeleteEmployeeFeedback(complianceAndEthicsIds: number[]): Promise<void> {
          useLayoutStore().setOverlay(true)
          const { error } = await useApiFetch('/api/eio/feedback/bulk_delete', {
            method: 'POST',
            body: { ids: complianceAndEthicsIds }
          });
          useLayoutStore().setOverlay(false)
    
          if (error.value) {
            useLayoutStore().setStatusMessage('Failed to delete feedback', 'error');
          }
          else {
            complianceAndEthicsIds.forEach(employmentHistoryId => {
              let index = this.employeeFeedbackList.findIndex((item) => item.id === employmentHistoryId);
              if (index > -1) {
                this.employeeFeedbackList.splice(index, 1);
              }
            })
            useLayoutStore().setStatusMessage('Feedback deleted', 'primary');
          }
        },
    
        async bulkUpdateEmployeeFeedback(payload: { ids: Number[], data: EmployeeFeedbackInfo }) {
          return new Promise<{ success?: Boolean, error?: Boolean, }>(async (resolve, reject) => {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch('/api/eio/feedback/bulk_update', {
              method: 'POST',
              body: payload,
            });
            useLayoutStore().setOverlay(false)
    
            if (error.value) {
              useLayoutStore().setStatusMessage('Failed to update feedback records', 'error');
              reject({ error: true })
            } else {
              let response = data.value as EmployeeFeedbackInfo[]
              response.forEach(feedback => {
                let index = this.employeeFeedbackList.findIndex(item => item.id === feedback.id)
                if (index > -1) {
                  this.employeeFeedbackList[index] = Object.assign({}, feedback)
                }
              })
              useLayoutStore().setStatusMessage('Feedback records updated', 'primary');
              resolve({ success: true })
            }
          })
        }

  },
})