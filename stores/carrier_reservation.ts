import { defineStore } from 'pinia';
interface CarrierReservationInfo {
    carrier_reservation_id?: number;
    pay_code?: string;
    date?: string;
    carrier?: number;
    phone?: string;
    // "800": string;
    fax?: string;
    contact?: string;
    ref_no?: string;
    driver?: number;
    cell?: string;
    truck?: number;
    trailer?: number;
    notes?: string;
    pay_source?: string;
    pay_matrix?: string;
    pay_type?: string;
    miles?: number;
    pay_rate?: number;
    total_pay?: number;
    posted_by?: string;
    status?: string;
    batch?: string;
}

interface State {
    carrierReservationList: CarrierReservationInfo[]
}

export const useCarrierReservationStore = defineStore('carrierReservation', {
    state: (): State => ({
        carrierReservationList: [
            {
                carrier_reservation_id: 1,
                pay_code: "ABC123",
                date: "2023-12-01T10:30:00Z",
                carrier: 1,
                phone: "123-456-7890",
                // "800": "800-123-4567",
                fax: "987-654-3210",
                contact: "John Doe",
                ref_no: "REF001",
                driver: 1,
                cell: "555-123-4567",
                truck: 1,
                trailer: 1,
                notes: "Sample notes 1",
                pay_source: "Source 1",
                pay_matrix: "Matrix 1",
                pay_type: "Type 1",
                miles: 100.5,
                pay_rate: 10.25,
                total_pay: 1028.13,
                posted_by: "Jane Smith",
                status: "Posted",
                batch: "Batch 1"
            },
            {
                carrier_reservation_id: 2,
                pay_code: "DEF456",
                date: "2023-12-02T14:45:00Z",
                carrier: 2,
                phone: "987-654-3210",
                // "800": "800-987-6543",
                fax: "123-456-7890",
                contact: "Jane Smith",
                ref_no: "REF002",
                driver: 2,
                cell: "555-987-6543",
                truck: 2,
                trailer: 2,
                notes: "Sample notes 2",
                pay_source: "Source 2",
                pay_matrix: "Matrix 2",
                pay_type: "Type 2",
                miles: 200.75,
                pay_rate: 12.5,
                total_pay: 2515.94,
                posted_by: "John Doe",
                status: "Posted",
                batch: "Batch 2"
            }
        ]
    }),

    getters: {
        getCarrierReservationList: (state) => { return state.carrierReservationList }
    },
    actions: {
        loadCarrierReservations() {
        },
    },
})
