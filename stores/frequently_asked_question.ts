import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { FrequentlyAskedQuestionInfo } from '~/types/store/frequently_asked_question';

interface State {
  frequentlyAskedQuestionList: FrequentlyAskedQuestionInfo[];
  loading: boolean;
}

export const useFAQStore = defineStore('frequently_asked_question', {
  state: (): State => ({
    frequentlyAskedQuestionList: [],
    loading: false,
  }),

  getters: {
    getFAQList: (state) => { return state.frequentlyAskedQuestionList }
  },

  actions: {
    async fetchFAQList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/shared/faqs');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch FAQ list', 'error')
      } else {
        this.frequentlyAskedQuestionList = data.value as FrequentlyAskedQuestionInfo[];
      }
      this.loading = false
    },

    async createFAQ(payload: FrequentlyAskedQuestionInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch(`/api/shared/faqs`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create FAQ', 'error');
      } else {
        let response = data.value as FrequentlyAskedQuestionInfo;
        this.frequentlyAskedQuestionList.push(response)
        useLayoutStore().setStatusMessage('Duty created', 'primary');
      }
    },

    async updateFAQ(payload: FrequentlyAskedQuestionInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/shared/faqs/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update FAQ', 'error');
      } else {
        let response = data.value as FrequentlyAskedQuestionInfo
        let index = this.frequentlyAskedQuestionList.findIndex(item => item.id === response.id)
        if (index > -1) {
          this.frequentlyAskedQuestionList[index] = Object.assign({}, response)
        }
        useLayoutStore().setStatusMessage('Duty updated', 'primary');
      }
    },

    async deleteFAQ(faq_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/shared/faqs/${faq_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        console.error('Failed to delete FAQ', error.value);
        useLayoutStore().setStatusMessage('Failed to delete FAQ', 'error');
      }
      else {
        const index = this.frequentlyAskedQuestionList.findIndex((faq) => faq.id === faq_id);
        if (index > -1) {
          this.frequentlyAskedQuestionList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('FAQ deleted', 'primary');
      }
    },
  },
})