import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { MeetingInfo } from '~/types/meeting/meeting';

interface State {
  meetingList: MeetingInfo[];
  loading: boolean
}

export const useMeetingStore = defineStore('meeting', {
  state: (): State => ({
    meetingList: [],
    loading: false
  }),

  getters: {
    getMeetingList: (state) => { return state.meetingList }
  },

  actions: {
    async fetchMeetingList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/meeting');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch meeting list', 'error')
      } else {
        this.meetingList = data.value as MeetingInfo[];
      }
      this.loading = false
    },

    async createMeeting(payload: MeetingInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch('/api/meeting', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Meeting', 'error');
      } else {
        let meeting = data.value as MeetingInfo;
        this.meetingList.push(meeting)
        useLayoutStore().setStatusMessage('Meeting created', 'primary');
      }
    },

    async updateMeeting(payload: MeetingInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/meeting/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update meeting', 'error');
      } else {
        let response = data.value as MeetingInfo
        let index = this.meetingList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.meetingList[index], response)
        }
        useLayoutStore().setStatusMessage('Meeting updated', 'primary');
      }
    },

    async deleteMeeting(meeting_id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/meeting/${meeting_id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete meeting', 'error');
      }
      else {
        const index = this.meetingList.findIndex((meeting) => meeting.id === meeting_id);
        if (index > -1) {
          this.meetingList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Meeting deleted', 'primary');
      }
    },
  },
})
