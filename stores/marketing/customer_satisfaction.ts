import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { CustomerSatisfactionInfo } from '~/types/marketing/customer_satisfaction';

interface State {
  feedbackList: CustomerSatisfactionInfo[];
  loading: boolean
}

export const useCustomerSatisfactionStore = defineStore('feedback', {
  state: (): State => ({
    feedbackList: [
            {
                id: 1,
                customer_id: 2,
                date: "2022-01-15",
                feedback_type: "Complaint",
                feedback_details: "The product quality was not satisfactory.",
                
            },
            {
                id: 2,
                customer_id: 1,
                date: "2024-02-05",
                feedback_type: "Complaint",
                feedback_details: "The product quality was not satisfactory.",
                
            },
            {
                id: 3,
                customer_id: 5,
                date: "2024-04-05",
                feedback_type: "Suggestion",
                feedback_details: "Receive the package the next two days",
                
            },
            {
                id: 4,
                customer_id: 7,
                date: "2023-07-19",
                feedback_type: "Complaint",
                feedback_details: "The product quality was not satisfactory.",
                
            },
            {
                id: 5,
                customer_id: 8,
                date: "2024-04-05",
                feedback_type: "Suggestion",
                feedback_details: "There was an issue with the shipment",
                
            },
            {
                id: 6,
                customer_id: 11,
                date: "2024-04-17",
                feedback_type: "Complaint",
                feedback_details: "The product quality was not satisfactory.",
                
            },
    ],
    loading: false
  }),

  getters: {
    getFeedbackList: (state) => { return state.feedbackList },
    getFeedbackById: (state) => {
        return (feedbackId: number) => state.feedbackList.find(feedback => feedback.id === feedbackId)
    }
},
actions: {
    createFeedback(payload: CustomerSatisfactionInfo) {
        this.$state.feedbackList.push(payload)
    },

    updateFeedback(payload: CustomerSatisfactionInfo) {
        const index = this.$state.feedbackList.findIndex((feedback) => feedback.id === payload.id);
        if (index > -1) {
            Object.assign(this.feedbackList[index], payload)
        }
      },
    deleteFeedback(feedbackId: number) {
        const index = this.$state.feedbackList.findIndex((feedback) => feedback.id === feedbackId);
        if (index > -1) {
            this.feedbackList.splice(index, 1);
        }
    },
},
})
