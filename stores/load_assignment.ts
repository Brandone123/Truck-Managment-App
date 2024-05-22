import { defineStore } from 'pinia';

import type { LoadInfo, StopInfo } from '~/types/dispatch/load'
interface State {
    loadTemplateList: LoadInfo[]
    loading: boolean;
}

export const useLoadInfoStore = defineStore('loadTemplate', {
    state: (): State => ({
        loading: false,
        loadTemplateList: [
        ]
    }),

    getters: {
        getloadTemplateList: (state) => { return state.loadTemplateList },
        getLoadById: (state) => {
            return (loadId: number) => state.loadTemplateList.find(load => load.id === loadId)
        }
    },
    actions: {
        async fetchLoadList() {
            this.loading = true

            const { data, error } = await useApiFetch('/api/dispatch/loads');

            this.loading = false

            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to fetch load list', 'error')
            } else {
                this.loadTemplateList = data.value as LoadInfo[];
            }
            this.loading = false
        },

        async updateLoadAssignment(payload: LoadInfo) {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch(`/api/dispatch/loads/${payload.id}`,{
              method: 'PUT',
              body: payload,
            });
            useLayoutStore().setOverlay(false)
            if (error.value) {
              useLayoutStore().setStatusMessage('Failed to update load assignment ', 'error')
            } else {
              
              let response = data.value as LoadInfo
              let index = this.loadTemplateList.findIndex(item => item.id === response.id)
              if (index > -1) {
                Object.assign(this.loadTemplateList[index], response)
              }
              useLayoutStore().setStatusMessage('Load assignment updated ', 'primary')
            }
            this.loading = false
        },
    },
})
