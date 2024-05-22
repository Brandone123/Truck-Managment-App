import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { MeetingResolutionInfo } from '~/types/meeting/meeting_resolution';

interface State {
  meetingResolutionList: MeetingResolutionInfo[];
  loading: boolean
}

export const useMeetingResolutionStore = defineStore('meeting_resolution', {
  state: (): State => ({
    meetingResolutionList: [
            {
                id: 1,
                meeting_id: 1,
                department_id: 1,
                status: "Pending",
                resolution_details: "All Dispatcher need to assign a load to the driver all this month",
                timestamp: '2024-03-31 23:03:00',
            },
            {
                id: 2,
                meeting_id: 4,
                department_id: 2,
                status: "In Progress",
                resolution_details: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-02-21 03:03:00',
            },
            {
                id: 3,
                meeting_id: 2,
                department_id: 3,
                status: "Completed",
                resolution_details: "All Dispatcher need to assign a load to the driver all this month",
                timestamp: '2024-01-21 03:03:00',
            },
            {
                id: 4,
                meeting_id: 1,
                department_id: 2,
                status: "Pending",
                resolution_details: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-08-21 03:03:00',
            },
            {
                id: 5,
                meeting_id: 1,
                department_id: 5,
                status: "Completed",
                resolution_details: "All Dispatcher need to assign a load to the driver all this month",
                timestamp: '2024-08-21 03:03:00',
            },
            {
                id: 6,
                meeting_id: 3,
                department_id: 4,
                status: "In Progress",
                resolution_details: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-03-21 03:03:00',
            },
            {
                id: 7,
                meeting_id: 1,
                department_id: 1,
                status: "In Progress",
                resolution_details: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-04-21 03:03:00',
            },
            {
                id: 8,
                meeting_id: 2,
                department_id: 2,
                status: "Completed",
                resolution_details: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-05-21 03:03:00',
            }
    ],
    loading: false
  }),

  getters: {
    getMeetingResolutionList: (state) => { return state.meetingResolutionList }
  },

  actions: {
    async fetchMeetingResolutionList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/meeting/resolutions');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch meeting resolution list', 'error')
      } else {
        this.meetingResolutionList = data.value as MeetingResolutionInfo[];
      }
      this.loading = false
    },

    async createMeetingResolution(payload: MeetingResolutionInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch('/api/meeting/resolutions', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Meeting Resolution', 'error');
      } else {
        let meeting_resolution = data.value as MeetingResolutionInfo;
        this.meetingResolutionList.push(meeting_resolution)
        useLayoutStore().setStatusMessage('Meeting Resolution created', 'primary');
      }
    },

    async updateMeetingResolution(payload: MeetingResolutionInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/meeting/resolutions/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update meeting resolution', 'error');
      } else {
        let response = data.value as MeetingResolutionInfo
        let index = this.meetingResolutionList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.meetingResolutionList[index], response)
        }
        useLayoutStore().setStatusMessage('Meeting Resolution updated', 'primary');
      }
    },

    async deleteMeetingResolution(id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/meeting/resolutions/${id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete meeting resolution', 'error');
      }
      else {
        const index = this.meetingResolutionList.findIndex((meetingR) => meetingR.id === id);
        if (index > -1) {
          this.meetingResolutionList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Meeting Resolution deleted', 'primary');
      }
    },
  },
})
