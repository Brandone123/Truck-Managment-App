import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { TimeoffRequest } from '~/types/attendance/timeoff_request';
import { useLayoutStore } from '~/stores/useLayoutStore';
interface State {
    timeoffRequestList: TimeoffRequest[],
    loading: boolean,
}

export const useTimeoffRequestStore = defineStore('timeoff_requests', {
    state: (): State => ({
        loading: false,
        timeoffRequestList: []
    }),

    getters: {
        getTimeoffRequestList: (state) => { return state.timeoffRequestList }
    },

    actions: {
        async loadTimeoffRequests() {
            this.loading = true
            // await new Promise(resolve => setTimeout(resolve, 5000));
            const { data, error } = await useApiFetch("/api/attendance/time-off");
            if (error.value) {
                useLayoutStore().setStatusMessage('Error loading TimeOff requests', 'error')
            } else {
                this.timeoffRequestList = data.value as TimeoffRequest[]
            }
            this.loading = false
        },

        async updateTimeoffRequest(request: TimeoffRequest): Promise<void> {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch(`/api/attendance/time-off/${request.id}`, {
                method: "PUT",
                body: request,
            });
            useLayoutStore().setOverlay(false)
            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to update TimeOff request', 'error')
            } else {
                useLayoutStore().setStatusMessage('TimeOff request updated', 'primary')
                let response = data.value as TimeoffRequest
                let index = this.timeoffRequestList.findIndex(item => item.id == response.id)
                if (index > -1) {
                    this.timeoffRequestList[index] = response
                }
            }

        },

        async addTimeoffRequest(request: any) {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch("/api/attendance/time-off", {
                method: "POST",
                body: request,
            });
            useLayoutStore().setOverlay(false)
            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to creare TimeOff request', 'error')
            } else {
                useLayoutStore().setStatusMessage('TimeOff request created', 'primary')
                let response = data.value as TimeoffRequest
                this.timeoffRequestList.push(response);
            }
        }
    },
})
