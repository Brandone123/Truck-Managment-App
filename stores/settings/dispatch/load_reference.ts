import { defineStore } from 'pinia';

interface LoadReferenceInfo {
    id: number,
    description:string | null
    invoice: boolean,
    disp_conf: boolean,
    trans_ag: boolean,
    edi_210: boolean,
    edi_214: boolean,
    tl: boolean

}

interface State {
    loadReferenceList: LoadReferenceInfo[]
}

export const useLoadReferenceStore = defineStore('loadReference', {
    state: (): State => ({
        loadReferenceList: [
            {
                id: 1,
                description: 'Acc Reference',
                invoice: true,
                disp_conf: false,
                trans_ag: false,
                edi_210: true,
                edi_214: true,
                tl: true
            },
        ],
    }),

    getters: {
        getLoadReferenceList: (state) => {return state.loadReferenceList}
    },
    actions: {
        loadLoadReferences() {
        },
    },
})
