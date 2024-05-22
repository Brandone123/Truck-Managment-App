import { defineStore } from 'pinia';

interface RateTypeInfo {
    id: number
    code: string

}

interface State {
    rateTypeList: RateTypeInfo[]
}

export const useRateTypeStore = defineStore('rateType', {
    state: (): State => ({
        rateTypeList: [
            {
                id: 1,
                code: 'Cwt',
            },
            {
                id: 2,
                code: 'Flat',
            },
            {
                id: 3,
                code: 'Miles',
            },
            {
                id: 4,
                code: 'Piece',
            },
            {
                id: 5,
                code: 'Pound',
            },
            {
                id: 6,
                code: 'Space',
            },
            {
                id: 7,
                code: 'Ton',
            },
        ],
    }),

    getters: {
        getRateTypeList: (state) => {return state.rateTypeList}
    },
    actions: {
        loadRateTypes() {
        },
    },
})
