import { defineStore } from 'pinia';

import type { LoadInfo, StopInfo } from '~/types/dispatch/load'
interface State {
    loadTemplateList: LoadInfo[]
}

export const useLoadTemplateStore = defineStore('loadTemplate', {
    state: (): State => ({
        loadTemplateList: [
            {
                id: 1111,
                customer_id: 2,
                customer: { id: 2, name: 'Customer 2' },
                route_id: 1,
                // route: {
                //     id: 1,
                //     name: 'route1',
                // },

                stops: [{
                    id: 1,
                    stop: 'shipper',
                    stop_number: 1,
                    // available_from: '2023-12-08',
                    // available_through: '2023-12-08',
                    // time_from: '13:00',
                    // time_to: '13:00',
                    appointment_required: true,
                    // appointment_reference: '',
                    shipper: 1,
                    address: '2100 DOVE ST',
                    city: 'PORT HURON',
                    state: 1,
                    zip: 48060,
                    zone: null,
                    // mi: '',
                    phone: '123456789',
                    contact: '123456789',
                    reference: '',
                    notes: '',
                    location_notes: '',
                    directions: '',
                },
                {
                    id: 2,
                    stop: 'consignee',
                    stop_number: 2,
                    // available_from: '2023-12-08',
                    // available_through: '2023-12-08',
                    // time_from: '18:00',
                    // time_to: '18:00',
                    appointment_required: true,
                    // appointment_reference: '',
                    shipper: 2,
                    address: '43123 18TH ST',
                    city: 'KANSAS CITY',
                    state: 1,
                    zip: 64123,
                    zone: null,
                    // mi: '',
                    phone: '123456789',
                    contact: '123456789',
                    reference: '',
                    notes: '',
                    location_notes: '',
                    directions: '',
                },
                {
                    id: 3,
                    stop: 'consignee',
                    stop_number: 3,
                    // available_from: '2023-12-08',
                    // available_through: '2023-12-08',
                    // time_from: '18:00',
                    // time_to: '18:00',
                    appointment_required: true,
                    // appointment_reference: '',
                    shipper: 2,
                    address: '43123 18TH ST',
                    city: 'KANSAS CITY 1',
                    state: 1,
                    zip: 64123,
                    zone: null,
                    // mi: '',
                    phone: '123456789',
                    contact: '123456789',
                    reference: '',
                    notes: '',
                    location_notes: '',
                    directions: '',
                }],
            },
            {
                id: 1111,
                customer_id: 2,
                customer: { id: 2, name: 'Customer 2' },
                route_id: 1,
                // route: {
                //     id: 1,
                //     name: 'route1',
                // },

                stops: [{
                    id: 1,
                    stop: 'shipper',
                    stop_number: 1,
                    // available_from: '2023-12-08',
                    // available_through: '2023-12-08',
                    // time_from: '13:00',
                    // time_to: '13:00',
                    appointment_required: true,
                    // appointment_reference: '',
                    shipper: 1,
                    address: '2100 DOVE ST',
                    city: 'PORT HURON',
                    state: 1,
                    zip: 48060,
                    zone: null,
                    // mi: '',
                    phone: '123456789',
                    contact: '123456789',
                    reference: '',
                    notes: '',
                    location_notes: '',
                    directions: '',
                },
                {
                    id: 2,
                    stop: 'consignee',
                    stop_number: 2,
                    // available_from: '2023-12-08',
                    // available_through: '2023-12-08',
                    // time_from: '18:00',
                    // time_to: '18:00',
                    appointment_required: true,
                    // appointment_reference: '',
                    shipper: 2,
                    address: '43123 18TH ST',
                    city: 'KANSAS CITY',
                    state: 1,
                    zip: 64123,
                    zone: null,
                    // mi: '',
                    phone: '123456789',
                    contact: '123456789',
                    reference: '',
                    notes: '',
                    location_notes: '',
                    directions: '',
                }],
            },
        ]

    }),

    getters: {
        getloadTemplateList: (state) => { return state.loadTemplateList },
        getLoadById: (state) => {
            return (loadId: number) => state.loadTemplateList.find(load => load.id === loadId)
        }
    },
    actions: {
        createLoadTemplate(payload: LoadInfo) {
            this.$state.loadTemplateList.push(payload)
        },
        updateLoadTemplate(payload: LoadInfo) {
            let index = this.$state.loadTemplateList.findIndex(template => template.id === payload.id)
            if (index > -1) {
                Object.assign(this.$state.loadTemplateList[index], payload)
            }
        },
        deleteLoadTemplate(template_id: number) {
            let index = this.$state.loadTemplateList.findIndex(template => template.id === template_id)
            if (index > -1) {
                this.$state.loadTemplateList.splice(index, 1)
            }
        }
    },
})
