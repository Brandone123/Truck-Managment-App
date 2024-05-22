import { defineStore } from 'pinia';

interface LoadStatusInfo {
    id: number
    status_id: number
    allow_driver_updates: boolean
    description: string | null
}

interface State {
    loadStatusList: LoadStatusInfo[]
}

export const useLoadStatusStore = defineStore('loadStatus', {
    state: (): State => ({
        loadStatusList: [
            {
                id: 1,
                status_id: 1,
                allow_driver_updates: false,
                description: 'Assigned'
            },
            {
                id: 2,
                status_id: 2,
                allow_driver_updates: false,
                description: 'Confirmed'
            },
            {
                id: 3,
                status_id: 3,
                allow_driver_updates: false, 
                description: 'At Origin'
            }
        ],
    }),

    getters: {
        getLoadStatusList: (state) => { return state.loadStatusList }
    },
    actions: {
        loadLoadStatuss() {
        },
    },
})
