import { defineStore } from 'pinia';

interface TruckTypeInfo {
    id: number
    type: string
    description: string | null

}

interface State {
    truckTypeList: TruckTypeInfo[]
}

export const useTruckTypeStore = defineStore('truckType', {
    state: (): State => ({
        truckTypeList: [
            {
                id: 1,
                type: 'B1',
                description: 'Box Truck 16'
            },
            {
                id: 2,
                type: 'B2',
                description: 'Box Truck 24'
            },
            {
                id: 3,
                type: 'RN',
                description: 'Local Day Cab'
            },
            {
                id: 4,
                type: 'RS',
                description: 'Over The Road Truck'
            },
        ],
    }),

    getters: {
        getTruckTypeList: (state) => {return state.truckTypeList}
    },
    actions: {
        loadTruckTypes() {
        },
    },
})
