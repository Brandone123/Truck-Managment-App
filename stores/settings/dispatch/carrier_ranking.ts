import { defineStore } from 'pinia';

interface CarrierRankingInfo {
    id: number
    code: string
    order: number
    description: string | null

}

interface State {
    carrierRankingList: CarrierRankingInfo[]
}

export const useCarrierRankingStore = defineStore('carrierRanking', {
    state: (): State => ({
        carrierRankingList: [
            {
                id: 1,
                code: 'AA',
                order: 1,
                description: 'Excellent'
            },
            {
                id: 2,
                code: 'A',
                order: 2,
                description: 'Fine'
            },
            {
                id: 3,
                code: 'B',
                order: 3,
                description: 'Good'
            },
            {
                id: 4,
                code: 'C',
                order: 4,
                description: 'Average'
            },
        ],
    }),

    getters: {
        getCarrierRankingList: (state) => { return state.carrierRankingList }
    },
    actions: {
        loadCarrierRankings() {
        },
    },
})
