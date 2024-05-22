import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { AdvertisingInfo } from '~/types/marketing/advertising';

interface State {
  channelList: AdvertisingInfo[];
  loading: boolean
}

export const useAdvertisingStore = defineStore('advertising', {
  state: (): State => ({
    channelList: [],
    loading: false
  }),

  getters: {
    getAdvertisingList: (state) => { return state.channelList },
    getAdvertisingById: (state) => {
        return (advertisingId: number) => state.channelList.find(advertising => advertising.id === advertisingId)
    }
},
actions: {
    async fetchChannelList() {
        this.loading = true
        const { data, error } = await useApiFetch('/api/marketing/advertising-channels');
        if (error.value) {
            useLayoutStore().setStatusMessage('Failed to fetch channel list', 'error')
        } else {
            this.channelList = data.value as AdvertisingInfo[];
        }
        this.loading = false
    },

    async createChannel(payload: AdvertisingInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch('/api/marketing/advertising-channels', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Channel', 'error');
      } else {
        let channel = data.value as AdvertisingInfo;
        this.channelList.push(channel)
        useLayoutStore().setStatusMessage('Channel created', 'primary');
      }
    },

    async updateChannel(payload: AdvertisingInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/marketing/advertising-channels/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update channel', 'error');
      } else {
        let response = data.value as AdvertisingInfo
        let index = this.channelList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.channelList[index], response)
        }
        useLayoutStore().setStatusMessage('Channel updated', 'primary');
      }
    },

    async deleteChannel(channel_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/marketing/advertising-channels/${channel_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete channel', 'error');
      }
      else {
        const index = this.channelList.findIndex((channel) => channel.id === channel_id);
        if (index > -1) {
          this.channelList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Channel deleted', 'primary');
      }
    },
},
})
