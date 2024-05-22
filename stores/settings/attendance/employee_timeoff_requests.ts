import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { TimeoffRequest } from '~/types/attendance/timeoff_request';
import { useLayoutStore } from '~/stores/useLayoutStore';
interface State {
    employeeTimeoffRequestList: TimeoffRequest[],
    loading: boolean,
}

export const useEmployeeTimeoffRequestStore = defineStore('employee_timeoff_requests', {
    state: (): State => ({
        loading: false,
        employeeTimeoffRequestList: []
    }),

    getters: {
        getEmployeeTimeoffRequestList: (state) => { return state.employeeTimeoffRequestList }
    },

    actions: {
        async fetchEmployeeTimeoffRequests() {
            this.loading = true
            const { data, error } = await useApiFetch("/api/attendance/time-off/employee-requests");
            if (error.value) {
                useLayoutStore().setStatusMessage('Error loading TimeOff requests', 'error')
            } else {
                this.employeeTimeoffRequestList = data.value as TimeoffRequest[]
            }
            this.loading = false
        },

        async updateEmployeeTimeoffRequest(request: TimeoffRequest): Promise<void> {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch(`/api/attendance/time-off/employee-requests/${request.id}`, {
                method: "PUT",
                body: request,
            });
            useLayoutStore().setOverlay(false)
            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to update TimeOff request', 'error')
            } else {
                useLayoutStore().setStatusMessage('TimeOff request updated', 'primary')
                let response = data.value as TimeoffRequest
                let index = this.employeeTimeoffRequestList.findIndex(item => item.id == response.id)
                if (index > -1) {
                    this.employeeTimeoffRequestList[index] = response
                }
            }

        },

        async addEmployeeTimeoffRequest(request: any) {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch("/api/attendance/time-off/employee-requests", {
                method: "POST",
                body: request,
            });
            useLayoutStore().setOverlay(false)
            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to creare TimeOff request', 'error')
            } else {
                useLayoutStore().setStatusMessage('TimeOff request created', 'primary')
                let response = data.value as TimeoffRequest
                this.employeeTimeoffRequestList.push(response);
            }
        }
    },
})
