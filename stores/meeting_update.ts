import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { MeetingUpdateInfo } from '~/types/meeting/meeting_update';

interface State {
  meetingUpdateList: MeetingUpdateInfo[];
  loading: boolean
}

export const useMeetingUpdateStore = defineStore('meeting_update', {
  state: (): State => ({
    meetingUpdateList: [
            {
                id: 1,
                meeting_id: 1,
                department_team: "Engineering",
                update_details: "All Dispatcher need to assign a load to the driver all this month",
                timestamp: '2024-03-31 23:03:00',
            },
            {
                id: 2,
                meeting_id: 2,
                department_team: "Driver",
                update_details: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-04-21 03:03:00',
            },
            {
                id: 4,
                meeting_id: 7,
                department_team: "Engineering",
                update_details: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-08-21 03:03:00',
            },
            {
                id: 6,
                meeting_id: 5,
                department_team: "Employee",
                update_details: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-08-21 03:03:00',
            },
            {
                id: 8,
                meeting_id: 8,
                department_team: "Employee",
                update_details: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-08-21 03:03:00',
            }
    ],
    loading: false
  }),

  getters: {
    getMeetingUpdateList: (state) => { return state.meetingUpdateList }
  },

  actions: {
    async fetchMeetingUpdateList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/meeting/updates');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch meeting update list', 'error')
      } else {
        this.meetingUpdateList = data.value as MeetingUpdateInfo[];
      }
      this.loading = false
    },

    async createMeetingUpdate(payload: MeetingUpdateInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch('/api/meeting/updates', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Meeting Update', 'error');
      } else {
        let meeting_update = data.value as MeetingUpdateInfo;
        this.meetingUpdateList.push(meeting_update)
        useLayoutStore().setStatusMessage('Meeting Update created', 'primary');
      }
    },

    async updateMeetingUpdate(payload: MeetingUpdateInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/meeting/updates/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update meeting update', 'error');
      } else {
        let response = data.value as MeetingUpdateInfo
        let index = this.meetingUpdateList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.meetingUpdateList[index], response)
        }
        useLayoutStore().setStatusMessage('Meeting Update updated', 'primary');
      }
    },

    async deleteMeetingUpdate(id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/meeting/updates/${id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete meeting update', 'error');
      }
      else {
        const index = this.meetingUpdateList.findIndex((meetingR) => meetingR.id === id);
        if (index > -1) {
          this.meetingUpdateList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Meeting Update deleted', 'primary');
      }
    },
  },
})
