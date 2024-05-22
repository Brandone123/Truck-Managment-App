import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { ComplianceAndEthicsInfo } from '~/types/employeeInformationAndOperation/compliance_and_ethics';

interface State {
  complianceAndEthicsList: ComplianceAndEthicsInfo[];
  loading: boolean;
}

export const useComplianceAndEthicsStore = defineStore('compliance_and_ethics', {
  state: (): State => ({
    complianceAndEthicsList: [],
    loading: false,
  }),

  getters: {
    getComplianceAndEthicsList: (state) => { return state.complianceAndEthicsList }
  },

  actions: {
    async fetchComplianceAndEthicsList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/eio/compliance-and-ethics');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch Compliance and ethics list', 'error')
      } else {
        this.complianceAndEthicsList = data.value as ComplianceAndEthicsInfo[];
      }
      this.loading = false
    },

    async createComplianceAndEthics(payload: ComplianceAndEthicsInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch(`/api/eio/compliance-and-ethics`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create compliance and ethics info', 'error');
      } else {
        let response = data.value as ComplianceAndEthicsInfo;
        this.complianceAndEthicsList.push(response)
        useLayoutStore().setStatusMessage('Compliance and ethics info created', 'primary');
      }
    },

    async updateComplianceAndEthics(payload: ComplianceAndEthicsInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/eio/compliance-and-ethics/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update Compliance and ethics info', 'error');
      } else {
        let response = data.value as ComplianceAndEthicsInfo
        let index = this.complianceAndEthicsList.findIndex(item => item.id === response.id)
        if (index > -1) {
          this.complianceAndEthicsList[index] = Object.assign({}, response)
        }
        useLayoutStore().setStatusMessage('Compliance and ethics info updated', 'primary');
      }
    },

    async deleteComplianceAndEthics(compliance_and_ethics_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/eio/compliance-and-ethics/${compliance_and_ethics_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete Compliance and ethics info', 'error');
      }
      else {
        const index = this.complianceAndEthicsList.findIndex((item) => item.id === compliance_and_ethics_id);
        if (index > -1) {
          this.complianceAndEthicsList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Compliance and ethics info deleted', 'primary');
      }
    },


       // BULK ACTIONS

       async bulkDeleteComplianceAndEthics(complianceAndEthicsIds: number[]): Promise<void> {
        useLayoutStore().setOverlay(true)
        const { error } = await useApiFetch('/api/eio/compliance-and-ethics/bulk_delete', {
          method: 'POST',
          body: { ids: complianceAndEthicsIds }
        });
        useLayoutStore().setOverlay(false)
  
        if (error.value) {
          useLayoutStore().setStatusMessage('Failed to delete compliance and ethics records', 'error');
        }
        else {
          complianceAndEthicsIds.forEach(
            complianceAndEthidsId => {
            let index = this.complianceAndEthicsList.findIndex((item) => item.id === 
            complianceAndEthidsId);
            if (index > -1) {
              this.complianceAndEthicsList.splice(index, 1);
            }
          })
          useLayoutStore().setStatusMessage('Compliance and ethics records deleted', 'primary');
        }
      },
  
      async bulkUpdateComplianceAndEthics(payload: { ids: Number[], data: ComplianceAndEthicsInfo }) {
        return new Promise<{ success?: Boolean, error?: Boolean, }>(async (resolve, reject) => {
          useLayoutStore().setOverlay(true)
          const { data, error } = await useApiFetch('/api/eio/compliance-and-ethics/bulk_update', {
            method: 'POST',
            body: payload,
          });
          useLayoutStore().setOverlay(false)
  
          if (error.value) {
            useLayoutStore().setStatusMessage('Failed to update comliance and ethics records', 'error');
            reject({ error: true })
          } else {
            let response = data.value as ComplianceAndEthicsInfo[]
            response.forEach(complianceAndEthic => {
              let index = this.complianceAndEthicsList.findIndex(item => item.id === complianceAndEthic.id)
              if (index > -1) {
                this.complianceAndEthicsList[index] = Object.assign({}, complianceAndEthic)
              }
            })
            useLayoutStore().setStatusMessage('Compliance and ethics records updated', 'primary');
            resolve({ success: true })
          }
        })
      }
  },
})