import { defineStore } from 'pinia';

interface ZoneInfo {
    id: number
    code: string
    description: string

}

interface State {
    zoneList: ZoneInfo[]
}

export const useZoneStore = defineStore('zone', {
    state: (): State => ({
        zoneList: [
            {
                id: 1,
                code: 'IS',
                description: 'In State'
            },
            {
                id: 2,
                code: 'LO',
                description: 'Local'
            },
            {
                id: 3,
                code: 'MW',
                description: 'Midwest US'
            },

        ],
    }),

    getters: {
        getZoneList: (state) => {return state.zoneList}
    },
    actions: {
        loadZones() {
        },
    },
})
