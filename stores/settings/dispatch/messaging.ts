import { defineStore } from 'pinia';

interface MessagingInfo {
    id: number
    driver_id: number
    cell_phone: string
    email: string
    gps: string | null
    mob_exp: string | null
    trucker_eld: string | null
    driver?: Object
}

interface State {
    messagingList: MessagingInfo[]
}

export const useMessagingStore = defineStore('messaging', {
    state: (): State => ({
        messagingList: [
            {
                id: 1,
                driver_id: 1,
                cell_phone: '1234567890',
                email: 'driver@exaple.com',
                gps: null,
                trucker_eld: null,
                mob_exp: '123421',
                driver: {
                    id: 1,
                    name: 'John Doe'
                }
            }
        ]
    }),

    getters: {
        getMessagingList: (state) => { return state.messagingList }
    },
    actions: {
        loadMessagingList() {
        },
    },
})
