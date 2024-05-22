import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { BenefitInfo } from '~/types/employeeInformationAndOperation/benefit';

interface State {
  benefitList: BenefitInfo[];
  loading: boolean;
}

export const useBenefitStore = defineStore('benefit', {
  state: (): State => ({
    benefitList: [],
    loading: false,
  }),

  getters: {
    getBenefitList: (state) => { return state.benefitList }
  },

  actions: {
    async fetchBenefitList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/eio/benefits');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch benefit list', 'error')
      } else {
        this.benefitList = data.value as BenefitInfo[];
      }
      this.loading = false
    },

    async createBenefit(payload: BenefitInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch('/api/eio/benefits', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create benefit', 'error');
      } else {
        let benefit = data.value as BenefitInfo;
        this.benefitList.push(benefit)
        useLayoutStore().setStatusMessage('Benefit created', 'primary');
      }
    },

    async updateBenefit(payload: BenefitInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/eio/benefits/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update benefit', 'error');
      } else {

        console.log(JSON.stringify(data.value))
        let response = data.value as BenefitInfo
        let index = this.benefitList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.benefitList[index], response)
        }
        useLayoutStore().setStatusMessage('Benefit updated', 'primary');
      }
    },

    async deleteBenefit(benefit_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/eio/benefits/${benefit_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        console.error('Failed to delete benefit', error.value);
        useLayoutStore().setStatusMessage('Failed to delete benefit', 'error');
      }
      else {
        const index = this.benefitList.findIndex((benefit) => benefit.id === benefit_id);
        if (index > -1) {
          this.benefitList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Benefit deleted', 'primary');
      }
    },
  },
})