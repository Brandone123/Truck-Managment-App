import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { LeaveTypeInfo } from '~/types/attendance/leave_type';

interface State {
  leaveTypeList: LeaveTypeInfo[];
  loading: boolean
}

export const useLeaveTypeStore = defineStore('leave_type', {
  state: (): State => ({
    leaveTypeList: [],
    loading: false
  }),

  getters: {
    getLeaveTypeList: (state) => { return state.leaveTypeList }
  },

  actions: {
    async fetchLeaveTypeList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/attendance/time-off/leave-type');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch leave type list', 'error')
      } else {
        this.leaveTypeList = data.value as LeaveTypeInfo[];
      }
      this.loading = false
    },

    async createLeaveType(payload: LeaveTypeInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch('/api/attendance/time-off/leave-type', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create leave type', 'error');
      } else {
        let leave_type = data.value as LeaveTypeInfo;
        this.leaveTypeList.push(leave_type)
        useLayoutStore().setStatusMessage('Leave type created', 'primary');
      }
    },

    async updateLeaveType(payload: LeaveTypeInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/attendance/time-off/leave-type/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update leave type', 'error');
      } else {

        console.log(JSON.stringify(data.value))
        let response = data.value as LeaveTypeInfo
        let index = this.leaveTypeList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.leaveTypeList[index], response)
        }
        useLayoutStore().setStatusMessage('Leave type updated', 'primary');
      }
    },

    async deleteLeaveType(leave_type_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/attendance/time-off/leave-type/${leave_type_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        console.error('Failed to delete leave type', error.value);
        useLayoutStore().setStatusMessage('Failed to delete leave type', 'error');
      }
      else {
        const index = this.leaveTypeList.findIndex((leave_type) => leave_type.id === leave_type_id);
        if (index > -1) {
          this.leaveTypeList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Leave type deleted', 'primary');
      }
    },
  },
})
