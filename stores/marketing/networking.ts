import { defineStore } from 'pinia';
import type { NetworkingInfo } from '~/types/marketing/networking';


interface State {
    networkingList: NetworkingInfo[];
    loading: boolean;
  }
  
  export const useNetworkingStore = defineStore('networkingMarketing', {
    state: (): State => ({
      networkingList: [
        {
          id: 1,
          event_name: "Annual Trucking Conference",
          date: "Banner",
          link: "http://localhost:3000/marketing",
          description: "A conference for trucking industry leaders.",
        },
        {
          id: 2,
          event_name: "Annual Driver Conference",
          date: "Video",
          link: "http://localhost:3000/marketing",
          description: "A conference for driver leaders.",
        },
        {
          id: 3,
          event_name: "Annual Dispatcher Conference",
          date: "Text",
          link: "http://localhost:3000/marketing",
          description: "A conference for dispatcher leaders.",
        }
      ],
      loading: false,
    }),
  
    getters: {
      getNetworkingList: (state) => state.networkingList,
      getNetworkingById: (state) => (networkingId: number) =>
        state.networkingList.find((networking) => networking.id === networkingId),
    },
  
    actions: {
      createNetworking(payload: NetworkingInfo) {
        this.$state.networkingList.push(payload);
      },
  
      updateNetworking(payload: NetworkingInfo) {
        const index = this.$state.networkingList.findIndex((networking) => networking.id === payload.id);
        if (index > -1) {
          Object.assign(this.$state.networkingList[index], payload);
        }
      },
  
      deleteNetworking(networkingId: number) {
        const index = this.$state.networkingList.findIndex((networking) => networking.id === networkingId);
        if (index > -1) {
          this.$state.networkingList.splice(index, 1);
        }
      },
    },
  });