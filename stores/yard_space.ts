import { defineStore } from 'pinia';
import type { YardSpaceInfo } from '~/types/yard/yard_space';

interface State {
  loading: boolean,
  yardSpaceList: YardSpaceInfo[],
}

export const useYardSpaceStore = defineStore('yard_space', {
  state: (): State => ({
    loading: false,
    yardSpaceList: [],
  }),

  getters: {
    getYardSpaceList: (state) => { return state.yardSpaceList }
  },

  actions: {

    async getYardSpaces(yard_id: any) {
      try {
        this.loading = true;
        const { data } = await useApiFetch(`/api/yardcheck/yards/${yard_id}/spaces`);
        this.yardSpaceList = data.value as YardSpaceInfo[];
      } catch (error) {
        useLayoutStore().setStatusMessage('Failed to get Yard Spaces Data', 'error');
      } finally {
        this.loading = false;
      }
    },

    async createYardSpace(payload: YardSpaceInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch(`/api/yardcheck/yards/${payload.yard_id}/spaces`, {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Yard Space', 'error');
      } else {
        let yardSpace = data.value as YardSpaceInfo;
        this.yardSpaceList.push(yardSpace)
        useLayoutStore().setStatusMessage('Yard Space created', 'primary');
      }
    },

    async updateYardSpace(payload: YardSpaceInfo) {
        useLayoutStore().setOverlay(true)
        const { error, data } = await useApiFetch(`/api/yardcheck/spaces/${payload.id}`, {
          method: 'PUT',
          body: payload,
        });
        useLayoutStore().setOverlay(false)
  
        if (error.value) {
          useLayoutStore().setStatusMessage('Failed to update yard space', 'error');
        } else {
          let response = data.value as YardSpaceInfo
          let index = this.yardSpaceList.findIndex(item => item.id === response.id)
          if (index > -1) {
            Object.assign(this.yardSpaceList[index], response)
          }
          useLayoutStore().setStatusMessage('Yard space updated', 'primary');
        }
      },

      async deleteYard(id: number): Promise<void> {
        useLayoutStore().setOverlay(true)
        const { error } = await useApiFetch(`/api/yardcheck/spaces/${id}`, {
          method: 'DELETE',
        });
        useLayoutStore().setOverlay(false)
  
        if (error.value) {
          useLayoutStore().setStatusMessage('Failed to delete yard space', 'error');
        }
        else {
          const index = this.yardSpaceList.findIndex((yard) => yard.id === id);
          if (index > -1) {
            this.yardSpaceList.splice(index, 1);
          }
          useLayoutStore().setStatusMessage('Yard space deleted', 'primary');
        }
      },

  },
})
