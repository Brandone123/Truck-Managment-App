import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { LeadGenerationInfo } from '~/types/marketing/lead_generation';

interface State {
  leadGenerationList: LeadGenerationInfo[];
  loading: boolean
}

export const useLeadGenerationStore = defineStore('lead_generation', {
  state: (): State => ({
    leadGenerationList: [
            {
                id: 1,
                campaign_id: 1,
                date: "2022-01-15",
                lead_source: "Website",
                lead_details: "Lead score",
                
            },
            {
                id: 2,
                campaign_id: 1,
                date: "2022-01-15",
                lead_source: "Social media",
                lead_details: "Contact information.",
                
            },
            {
                id: 3,
                campaign_id: 2,
                date: "2022-01-15",
                lead_source: "Event",
                lead_details: "Contacted via email.",
                
            },
            {
                id: 4,
                campaign_id: 3,
                date: "2022-01-15",
                lead_source: "Website",
                lead_details: "Lead score",
                
            },
            {
                id: 5,
                campaign_id: 3,
                date: "2022-01-15",
                lead_source: "Event",
                lead_details: "Contacted via email.",
                
            },
            {
                id: 6,
                campaign_id: 1,
                 date: "2022-01-15",
                lead_source: "Social media",
                lead_details: "Contact information.",
                
            },
            {
                id: 7,
                campaign_id: 4,
                date: "2022-01-15",
                lead_source: "Social media",
                lead_details: "Contact information.",
                
            },
            {
                id: 8,
                campaign_id: 4,
                date: "2022-01-15",
                lead_source: "Website",
                lead_details: "Lead score",
                
            }
    ],
    loading: false
  }),

  getters: {
    getLeadGenerationList: (state) => { return state.leadGenerationList },
    getLeadGenerationById: (state) => {
        return (leadId: number) => state.leadGenerationList.find(lead => lead.id === leadId)
    }
},
actions: {
    createLeadGeneration(payload: LeadGenerationInfo) {
        this.$state.leadGenerationList.push(payload)
    },

    updateLeadGeneration(payload: LeadGenerationInfo) {
        const index = this.$state.leadGenerationList.findIndex((lead) => lead.id === payload.id);
        if (index > -1) {
            Object.assign(this.leadGenerationList[index], payload)
          }
      },
    deleteLeadGeneration(leadId: number) {
        const index = this.leadGenerationList.findIndex((lead) => lead.id === leadId);
        if (index > -1) {
            this.leadGenerationList.splice(index, 1);
        }
    },
},
})
