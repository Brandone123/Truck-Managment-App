import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { LeaveApproverInfo } from '~/types/attendance/leave_approver';

interface State {
  leaveApproverList: LeaveApproverInfo[];
  loading: boolean
}

export const useLeaveApproverStore = defineStore('leave_approver', {
  state: (): State => ({
    leaveApproverList: [],
    loading: false
  }),

  getters: {
    getLeaveApproverList: (state) => { return state.leaveApproverList }
  },

  actions: {
    async fetchLeaveApproverList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/attendance/time-off/leave-approver');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch leave policy list', 'error')
      } else {
        this.leaveApproverList = data.value as LeaveApproverInfo[];
      }
      this.loading = false
    },

    async createLeaveApprover(payload: LeaveApproverInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch('/api/attendance/time-off/leave-approver', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create leave policy', 'error');
      } else {
        let leave_policy = data.value as LeaveApproverInfo;
        this.leaveApproverList.push(leave_policy)
        useLayoutStore().setStatusMessage('Leave policy created', 'primary');
      }
    },

    async updateLeaveApprover(payload: LeaveApproverInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/attendance/time-off/leave-approver/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update leave policy', 'error');
      } else {

        console.log(JSON.stringify(data.value))
        let response = data.value as LeaveApproverInfo
        let index = this.leaveApproverList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.leaveApproverList[index], response)
        }
        useLayoutStore().setStatusMessage('Leave policy updated', 'primary');
      }
    },

    async deleteLeaveApprover(leave_policy_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/attendance/time-off/leave-approver/${leave_policy_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        console.error('Failed to delete leave policy', error.value);
        useLayoutStore().setStatusMessage('Failed to delete leave policy', 'error');
      }
      else {
        const index = this.leaveApproverList.findIndex((leave_policy) => leave_policy.id === leave_policy_id);
        if (index > -1) {
          this.leaveApproverList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Leave policy deleted', 'primary');
      }
    },
  },
})
