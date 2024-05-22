import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { CustomerInteractionInfo } from '~/types/marketing/customer_interaction';

interface State {
  interactionList: CustomerInteractionInfo[];
  loading: boolean
}

export const useCustomerInteractionStore = defineStore('interaction', {
  state: (): State => ({
    interactionList: [
            {
                id: 1,
                campaign_id: 1,
                customer_id: 2,
                date: "2022-01-15 09:30",
                interaction_type: "Email",
                interaction_details: "I have a question about my order.",
                
            },
            {
                id: 2,
                campaign_id: 1,
                customer_id: 1,
                date: "2022-01-15 09:32",
                interaction_type: "Chat",
                interaction_details: "I haven\'t received my package yet.",
                
            },
            {
                id: 3,
                campaign_id: 2,
                customer_id: 5,
                date: "2022-01-15 09:35",
                interaction_type: "Call",
                interaction_details: "Thank you for your assistance!",
                
            },
            {
                id: 4,
                campaign_id: 3,
                customer_id: 7,
                date: "2022-01-15 09:36",
                interaction_type: "Email",
                interaction_details: "My order number is 123456789.",
                
            },
            {
                id: 5,
                campaign_id: 3,
                customer_id: 8,
                date: "2022-01-15 09:38",
                interaction_type: "Call",
                interaction_details: "There was an issue with the shipment",
                
            },
            {
                id: 6,
                campaign_id: 1,
                customer_id: 11,
                date: "2022-01-15 09:40",
                interaction_type: "Chat",
                interaction_details: "Could you please provide me my order number?",
                
            },
            {
                id: 7,
                campaign_id: 4,
                customer_id: 6,
                date: "2022-01-15 09:42",
                interaction_type: "Chat",
                interaction_details: "Sure, take your time.",
                
            },
            {
                id: 8,
                campaign_id: 4,
                customer_id: 4,
                date: "2022-01-15 09:55",
                interaction_type: "Meeting",
                interaction_details: "How can I receive my package within the next two days",
                
            }
    ],
    loading: false
  }),

  getters: {
    getInteractionList: (state) => { return state.interactionList },
    getInteractionById: (state) => {
        return (interactionId: number) => state.interactionList.find(interaction => interaction.id === interactionId)
    }
},
actions: {
    createInteraction(payload: CustomerInteractionInfo) {
        this.$state.interactionList.push(payload)
    },

    updateInteraction(payload: CustomerInteractionInfo) {
        const index = this.$state.interactionList.findIndex((interaction) => interaction.id === payload.id);
        if (index > -1) {
            Object.assign(this.interactionList[index], payload)
        }
      },
    deleteInteraction(interactionId: number) {
        const index = this.$state.interactionList.findIndex((interaction) => interaction.id === interactionId);
        if (index > -1) {
            this.interactionList.splice(index, 1);
        }
    },
},
})
