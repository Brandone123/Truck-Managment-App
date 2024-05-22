import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { StandardOperatingProcedureInfo } from '~/types/employeeInformationAndOperation/standard_operating_procedure';

interface State {
  SOPList: StandardOperatingProcedureInfo[];
  loading: boolean;
}

export const useSOPStore = defineStore('standard_operating_procedure', {
  state: (): State => ({
    SOPList: [],
    loading: false,
  }),

  getters: {
    getSOPList: (state) => { return state.SOPList }
  },

  actions: {
    clearSOPList() {
      this.SOPList = [];
    },

    async fetchSOPList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/eio/sops/');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch SOP list', 'error')
      } else {
        this.SOPList = data.value as StandardOperatingProcedureInfo[];
      }
      this.loading = false
    },

    async createSOP(payload: StandardOperatingProcedureInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch(`/api/eio/sops`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create SOP', 'error');
      } else {
        let response = data.value as StandardOperatingProcedureInfo;
        this.SOPList.push(response)
        useLayoutStore().setStatusMessage('SOP created', 'primary');
      }
    },

    async updateSOP(payload: StandardOperatingProcedureInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/eio/sops/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update SOP', 'error');
      } else {
        let response = data.value as StandardOperatingProcedureInfo
        let index = this.SOPList.findIndex(item => item.id === response.id)
        if (index > -1) {
          this.SOPList[index] = Object.assign({}, response)
        }
        useLayoutStore().setStatusMessage('SOP updated', 'primary');
      }
    },

    async deleteSOP(SOPId: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/eio/sops/${SOPId}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete SOP', 'error');
      }
      else {
        const index = this.SOPList.findIndex((item) => item.id === SOPId);
        if (index > -1) {
          this.SOPList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('SOP deleted', 'primary');
      }
    },

    // BULK ACTIONS

    async bulkDeleteSOP(SOPIds: number[]): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch('/api/eio/sops/bulk_delete', {
        method: 'POST',
        body: { ids: SOPIds }
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete SOPs', 'error');
      }
      else {
        SOPIds.forEach(SOPId => {
          let index = this.SOPList.findIndex((item) => item.id === SOPId);
          if (index > -1) {
            this.SOPList.splice(index, 1);
          }
        })
        useLayoutStore().setStatusMessage('SOPs deleted', 'primary');
      }
    },

    async bulkUpdateSOP(payload: { ids: Number[], data: StandardOperatingProcedureInfo }) {
      return new Promise<{ success?: Boolean, error?: Boolean, }>(async (resolve, reject) => {
        useLayoutStore().setOverlay(true)
        const { data, error } = await useApiFetch('/api/eio/sops/bulk_update', {
          method: 'POST',
          body: payload,
        });
        useLayoutStore().setOverlay(false)

        if (error.value) {
          useLayoutStore().setStatusMessage('Failed to update SOPs', 'error');
          reject({error : true })
        } else {
          let response = data.value as StandardOperatingProcedureInfo[]
          response.forEach(SOP => {
            let index = this.SOPList.findIndex(item => item.id === SOP.id)
            if (index > -1) {
              this.SOPList[index] = Object.assign({}, SOP)
            }
          })
          useLayoutStore().setStatusMessage('SOPs updated', 'primary');
          resolve({ success : true })
        }
      })
    },
  },
})