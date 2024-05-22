import { defineStore } from 'pinia';

interface CommodityInfo {
    id: number
    description: string | null
    hazmat_code: string | null
    class: string | null
    type: string | null
}

interface State {
    commodityList: CommodityInfo[]
}

export const useCommodityStore = defineStore('commodity', {
    state: (): State => ({
        commodityList: [
            {
                id: 1,
                description: 'Auto Parts',
                hazmat_code: null,
                class: null,
                type: 'General Commoditites'
            },
            {
                id: 2,
                description: 'Auto Parts',
                hazmat_code: null,
                class: null,
                type: null
            }, {
                id: 3,
                description: 'Auto Parts',
                hazmat_code: null,
                class: null,
                type: 'General Commoditites'
            },
        ],
    }),

    getters: {
        getCommodityList: (state) => { return state.commodityList },
        getCommodityById: (state) => {
            return (commodityId: number) => state.commodityList.find(commodity => commodity.id === commodityId)
        }
    },
    actions: {
        loadCommodities() {
        },
    },
})
