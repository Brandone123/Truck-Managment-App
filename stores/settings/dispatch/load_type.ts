import { defineStore } from 'pinia';

interface LoadTypeInfo {
    id: number
    code: string
    description: string | null

}

interface State {
    loadTypeList: LoadTypeInfo[]
}

export const useLoadTypeStore = defineStore('loadType', {
    state: (): State => ({
        loadTypeList: [
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
        getLoadTypeList: (state) => {return state.loadTypeList}
    },
    actions: {
        loadLoadTypes() {
        },
    },
})
