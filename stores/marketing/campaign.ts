import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { MarketingCampaignInfo } from '~/types/marketing/campaign';

interface State {
  campaignList: MarketingCampaignInfo[];
  loading: boolean
}

export const useMarketingCampaignStore = defineStore('campaign', {
  state: (): State => ({
    campaignList: [],
    loading: false
  }),

  getters: {
    getCampaignList: (state) => { return state.campaignList },
    getCampaignById: (state) => {
        return (campaignId: number) => state.campaignList.find(campaign => campaign.id === campaignId)
    }
},
actions: {
    async fetchCampaignList() {
        this.loading = true
        const { data, error } = await useApiFetch('/api/marketing/campaigns');
        if (error.value) {
            useLayoutStore().setStatusMessage('Failed to fetch campaign list', 'error')
        } else {
            this.campaignList = data.value as MarketingCampaignInfo[];
        }
        this.loading = false
    },

    async createCampaign(payload: MarketingCampaignInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch('/api/marketing/campaigns', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Campaign', 'error');
      } else {
        let campaign = data.value as MarketingCampaignInfo;
        this.campaignList.push(campaign)
        useLayoutStore().setStatusMessage('Campaign created', 'primary');
      }
    },

    async updateCampaign(payload: MarketingCampaignInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/marketing/campaigns/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update campaign', 'error');
      } else {
        let response = data.value as MarketingCampaignInfo
        let index = this.campaignList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.campaignList[index], response)
        }
        useLayoutStore().setStatusMessage('Campaign updated', 'primary');
      }
    },

    async deleteCampaign(campaign_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/marketing/campaigns/${campaign_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete campaign', 'error');
      }
      else {
        const index = this.campaignList.findIndex((campaign) => campaign.id === campaign_id);
        if (index > -1) {
          this.campaignList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Campaign deleted', 'primary');
      }
    },
},
})
