import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { LeavePolicyInfo, EmployeeLeavePolicyInfo } from '~/types/attendance/leave_policy';

interface State {
  leavePolicyList: LeavePolicyInfo[];
  loading: boolean;
  employeeLeavePolicy: EmployeeLeavePolicyInfo | null;
}

export const useLeavePolicyStore = defineStore('leave_policy', {
  state: (): State => ({
    leavePolicyList: [],
    loading: false,
    employeeLeavePolicy: null
  }),

  getters: {
    getLeavePolicyList: (state) => { return state.leavePolicyList }
  },

  actions: {
    async fetchLeavePolicyList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/attendance/time-off/leave-policy');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch leave policy list', 'error')
      } else {
        this.leavePolicyList = data.value as LeavePolicyInfo[];
      }
      this.loading = false
    },

    async createLeavePolicy(payload: LeavePolicyInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch('/api/attendance/time-off/leave-policy', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create leave policy', 'error');
      } else {
        let leave_policy = data.value as LeavePolicyInfo;
        this.leavePolicyList.push(leave_policy)
        useLayoutStore().setStatusMessage('Leave policy created', 'primary');
      }
    },

    async updateLeavePolicy(payload: LeavePolicyInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/attendance/time-off/leave-policy/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update leave policy', 'error');
      } else {

        console.log(JSON.stringify(data.value))
        let response = data.value as LeavePolicyInfo
        let index = this.leavePolicyList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.leavePolicyList[index], response)
        }
        useLayoutStore().setStatusMessage('Leave policy updated', 'primary');
      }
    },

    async deleteLeavePolicy(leave_policy_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/attendance/time-off/leave-policy/${leave_policy_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        console.error('Failed to delete leave policy', error.value);
        useLayoutStore().setStatusMessage('Failed to delete leave policy', 'error');
      }
      else {
        const index = this.leavePolicyList.findIndex((leave_policy) => leave_policy.id === leave_policy_id);
        if (index > -1) {
          this.leavePolicyList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Leave policy deleted', 'primary');
      }
    },

    getEmployeeLeaveStatus(employee_id: number) {
      return new Promise(async (resolve, reject) => {
        const { error, data } = await useApiFetch(`/api/attendance/time-off/employee-leave-status/${employee_id}`)

        if (error.value) {
          useLayoutStore().setStatusMessage('Failed get employee\'s leave policy information', 'error');
          reject(error.value)
        }
        else {
          this.employeeLeavePolicy = data.value as EmployeeLeavePolicyInfo
          resolve(data.value)
        }
      })

    }
  },
})
