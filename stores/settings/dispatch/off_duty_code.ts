import { defineStore } from 'pinia';

interface OffDutyCodeInfo {
    id: number
    code: string
    description: string | null

}

interface State {
    offDutyCodeList: OffDutyCodeInfo[]
}

export const useOffDutyCodeStore = defineStore('OffDutyCode', {
    state: (): State => ({
        offDutyCodeList: [
            {
                id: 1,
                code: 'LOA',
                description: 'Leave Of Absence'
            },
            {
                id: 2,
                code: 'LOG',
                description: '34 Hour Restart'
            },
            {
                id: 3,
                code: 'MED',
                description: 'Medical Reasons'
            },
            {
                id: 4,
                code: 'SUS',
                description: 'Suspension'
            },
        ],
    }),

    getters: {
        getOffDutyCodeList: (state) => {return state.offDutyCodeList}
    },
    actions: {
        loadOffDutyCodes() {
        },
    },
})
