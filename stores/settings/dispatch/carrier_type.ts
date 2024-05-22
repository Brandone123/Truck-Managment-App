import { defineStore } from 'pinia';

interface CarrierTypeInfo {
    id: number
    code: string
    description: string | null

}

interface State {
    carrierTypeList: CarrierTypeInfo[]
}

export const useCarrierTypeStore = defineStore('carrierType', {
    state: (): State => ({
        carrierTypeList: [
            {
                id: 1,
                code: 'COD',
                description: null
            },
            {
                id: 2,
                code: 'Detention',
                description: null
            },
            {
                id: 3,
                code: 'Direct',
                description: null
            },
            {
                id: 4,
                code: 'Dry Run',
                description: null
            },
        ],
    }),

    getters: {
        getCarrierTypeList: (state) => {return state.carrierTypeList}
    },
    actions: {
        loadCarrierTypes() {
        },
    },
})
