import { defineStore } from 'pinia';

interface TrailerTypeInfo {
    id: number
    type: string
    height: number
    length: number
    description: string | null

}

interface State {
    trailerTypeList: TrailerTypeInfo[]
}

export const useTrailerTypeStore = defineStore('trailerType', {
    state: (): State => ({
        trailerTypeList: [
            {
                id: 1,
                type: 'DD',
                height: 0,
                length: 53,
                description: '53\' Flatbed'
            },
            {
                id: 2,
                type: 'F5',
                height: 0,
                length: 53,
                description: '53\' Flatbed'
            },
            {
                id: 3,
                type: 'R5',
                height: 110,
                length: 53,
                description: '53\' Reefer'
            },

        ],
    }),

    getters: {
        getTrailerTypeList: (state) => { return state.trailerTypeList }
    },
    actions: {
        loadTrailerTypes() {
        },
    },
})
