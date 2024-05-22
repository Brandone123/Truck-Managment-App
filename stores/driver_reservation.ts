import { defineStore } from 'pinia';
interface DriverReservationInfo {
    reservation_id: number;
    pay_code: string;
    date: string;
    unit: number;
    driver: number;
    co_driver: number;
    truck: number;
    trailer: number;
    trailer_preloaded: boolean;
    trailer2: number;
    auto_dispatch: boolean;
    notes: string;
    posted_by: string;
    status: string;
    batch: string;
}


interface State {
    driverReservationList: DriverReservationInfo[]
}

export const useDriverReservationStore = defineStore('driverReservation', {
    state: (): State => ({
        driverReservationList: [
            {
                reservation_id: 1,
                pay_code: "ABC123",
                date: "2023-12-01T09:00:00",
                unit: 1,
                driver: 101,
                co_driver: 102,
                truck: 201,
                trailer: 301,
                trailer_preloaded: true,
                trailer2: 302,
                auto_dispatch: false,
                notes: "Reservation notes",
                posted_by: "John Doe",
                status: "Active",
                batch: "Batch-1"
            },
            {
                reservation_id: 2,
                pay_code: "DEF456",
                date: "2023-12-02T15:30:00",
                unit: 2,
                driver: 103,
                co_driver: 104,
                truck: 202,
                trailer: 303,
                trailer_preloaded: false,
                trailer2: 0,
                auto_dispatch: true,
                notes: "Reservation details",
                posted_by: "Jane Smith",
                status: "Pending",
                batch: "Batch-2"
            }
        ]
    }),

    getters: {
        getDriverReservationList: (state) => { return state.driverReservationList }
    },
    actions: {
        loadDriverReservations() {
        },
    },
})
