import { defineStore } from 'pinia';

import type { LoadInfo, LoadRouteInfo, EdiCommunicationInfo } from '~/types/dispatch/load'
interface State {
    loadList: LoadInfo[];
    loading: boolean;
    loadRoutes: LoadRouteInfo[]
    truckTelematics: Object | null;
    loadingTruckTelematics: boolean;
}

export const useLoadStore = defineStore('load', {
    state: (): State => ({
        loadList: [],
        loading: false,
        loadRoutes: [],

        //truck telematics
        truckTelematics: null,
        loadingTruckTelematics: false
    }),

    getters: {
        getloadList: (state) => { return state.loadList },
        getLoadById: (state) => {
            return (loadId: number) => state.loadList.find(load => load.id === loadId)
        },

        getLoadRoute: (state) => {
            return (route_number: string) => state.loadRoutes.find(route => route.route_number === route_number)
        }
    },
    actions: {
        async fetchLoadList() {
            this.loading = true

            const queryString = new URLSearchParams();
            queryString.append('Status', 'Dispatched')

            const { data, error } = await useApiFetch('/api/dispatch/loads' + '?' + queryString.toString());

            this.loading = false

            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to fetch load list', 'error')
            } else {
                this.loadList = data.value as LoadInfo[];
            }
            this.loading = false
        },

        async updateLoad(payload: LoadInfo) {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch(`/api/dispatch/loads/${payload.id}`, {
                method: 'PUT',
                body: payload,
            });
            useLayoutStore().setOverlay(false)

            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to update load', 'error');
            } else {
                let response = data.value as LoadInfo
                let index = this.loadList.findIndex(item => item.id === response.id)
                if (index > -1) {
                    Object.assign(this.loadList[index], response)
                }
                useLayoutStore().setStatusMessage('load updated', 'primary');
            }
        },


        async sendEDIArriveMessage(payload: any) {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch('/api/dispatch/loads/send-arrive-message', {
                method: 'POST',
                body: payload,
            })
            useLayoutStore().setOverlay(false)
            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to send EDI Message', 'error')
            } else {
                useLayoutStore().setStatusMessage('EDI Message Sent', 'primary')
                this.loadList.find(load => load.tender_id == payload.loadTenderId)?.edi_communication?.push(data.value as EdiCommunicationInfo)
            }
        },

        async sendEDIDepartMessage(payload: any) {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch('/api/dispatch/loads/send-depart-message', {
                method: 'POST',
                body: payload,
            })
            useLayoutStore().setOverlay(false)
            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to send EDI Message', 'error')
            } else {
                useLayoutStore().setStatusMessage('EDI Message Sent', 'primary')
                this.loadList.find(load => load.tender_id == payload.loadTenderId)?.edi_communication?.push(data.value as EdiCommunicationInfo)
            }
        },

        async sendEDIInTransitMessage(payload: any) {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch('/api/dispatch/loads/send-intransit-message', {
                method: 'POST',
                body: payload,
            })
            useLayoutStore().setOverlay(false)
            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to send EDI Message', 'error')
            } else {
                useLayoutStore().setStatusMessage('EDI Message Sent', 'primary')
                this.loadList.find(load => load.tender_id == payload.loadTenderId)?.edi_communication?.push(data.value as EdiCommunicationInfo)
            }
        },

        async sendEDIExceptionMessage(payload: any) {
            useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch('/api/dispatch/loads/send-exception-message', {
                method: 'POST',
                body: payload,
            })
            useLayoutStore().setOverlay(false)
            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to send EDI Message', 'error')
            } else {
                useLayoutStore().setStatusMessage('EDI Message Sent', 'primary')
                this.loadList.find(load => load.tender_id == payload.loadTenderId)?.edi_communication?.push(data.value as EdiCommunicationInfo)
            }
        },

        async createLoadRoute(payload: any) {
            // useLayoutStore().setOverlay(true)
            const { data, error } = await useApiFetch('/api/dispatch/load_routes', {
                method: 'POST',
                body: payload,
            })
            // useLayoutStore().setOverlay(false)
            if (error.value) {
                useLayoutStore().setStatusMessage('Failed to get load route', 'error')
            } else {
                // useLayoutStore().setStatusMessage('Load route created', 'primary')
                this.loadList.forEach((load, index) => {
                    if (load.route_number === payload.route_number) {
                        load.load_route = data.value as any
                    }
                });
            }
        },

        async findLoadRouteByNumber(route_number: string, load_id: number) {
            try {
                //useLayoutStore().setOverlay(true);
                const { data, error } = await useApiFetch(`/api/dispatch/load_routes_by_number/${route_number}`);
                //useLayoutStore().setOverlay(false);
                if (error.value) {
                    //  useLayoutStore().setStatusMessage('Failed to get route information', 'error');
                    throw error.value
                }

                const route: LoadRouteInfo = data.value as LoadRouteInfo;

                if (!route.id) {
                    throw new Error('Route with specified number not found!');
                }

                this.loadRoutes.push(route)

                return { data: route };
            } catch (err) {
                return { error: err }
            }
        },


        async fetchTruckTelematics(truck_id: number) {
            //useLayoutStore().setOverlay(true);
            this.loadingTruckTelematics = true
            const { data, error } = await useApiFetch(`/api/dispatch/telematics/truck/${truck_id}`);
            this.loadingTruckTelematics = false
            if (error.value) {
                console.log('unable to get truck telematics info: ')
                console.log(error.value)
            } else {
                this.truckTelematics = data.value as any
            }
        },

        createLoad(payload: LoadInfo) {
            this.$state.loadList.push(payload)
        },
    },
})
