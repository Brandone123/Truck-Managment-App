import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { TrailerInfo } from '~/types/dispatch/trailer';

interface State {
  trailerList: TrailerInfo[];
  loading: boolean
}

export const useTrailerStore = defineStore('trailer', {
  state: (): State => ({
    trailerList: [],
    loading: false
  }),

  getters: {
    getTrailerList: (state) => { return state.trailerList }
  },

  actions: {
    async fetchTrailerList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/shared/trailers');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch trailer list', 'error')
      } else {
        this.trailerList = data.value as TrailerInfo[];
      }
      this.loading = false
    },

    async createTrailer(payload: TrailerInfo) {
      useLayoutStore().setOverlay(true)

      const { error, data } = await useApiFetch('/api/shared/trailers', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create trailer', 'error');
      } else {
        let trailer = data.value as TrailerInfo;
        this.trailerList.push(trailer)
        useLayoutStore().setStatusMessage('Trailer created', 'primary');
      }
    },

    async updateTrailer(payload: TrailerInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/shared/trailers/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update trailer', 'error');
      } else {

        console.log(JSON.stringify(data.value))
        let response = data.value as TrailerInfo
        let index = this.trailerList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.trailerList[index], response)
        }
        useLayoutStore().setStatusMessage('Trailer updated', 'primary');
      }
    },

    async deleteTrailer(trailer_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/shared/trailers/${trailer_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        console.error('Failed to delete trailer', error.value);
        useLayoutStore().setStatusMessage('Failed to delete trailer', 'error');
      }
      else {
        const index = this.trailerList.findIndex((trailer) => trailer.id === trailer_id);
        if (index > -1) {
          this.trailerList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Trailer deleted', 'primary');
      }
    },
  },
})
