import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { MeetingBlockerInfo } from '~/types/meeting/meeting_blocker';

interface State {
  meetingBlockerList: MeetingBlockerInfo[];
  loading: boolean
}

export const useMeetingBlockerStore = defineStore('meeting_blocker', {
  state: (): State => ({
    meetingBlockerList: [
            {
                id: 1,
                resolution_id: 4,
                blocker_details: "Client has not provided necessary project requirements.",
                assigned_to: "Project Management Team",
                resolution_plan: "Schedule meeting with client to gather requirements.",
                timestamp: '2024-03-31 23:03:00',
            },
            {
                id: 2,
                resolution_id: 2,
                blocker_details: "Client has not provided necessary project requirements.",
                assigned_to: "Management Team",
                resolution_plan: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-03-29 03:03:00',
            },
            {
                id: 3,
                resolution_id: 1,
                blocker_details: "Client has not provided necessary project requirements.",
                assigned_to: "Team",
                resolution_plan: "Schedule meeting with client to gather requirements.",
                timestamp: '2024-04-21 03:03:00',
            },
            {
                id: 4,
                resolution_id: 2,
                blocker_details: "Client has not provided necessary project requirements.",
                assigned_to: "Project Management Team",
                resolution_plan: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-03-27 03:03:00',
            },
            {
                id: 5,
                resolution_id: 1,
                blocker_details: "Client has not provided necessary project requirements.",
                assigned_to: "Team",
                resolution_plan: "Schedule meeting with client to gather requirements.",
                timestamp: '2024-08-21 03:03:00',
            },
            {
                id: 6,
                resolution_id: 3,
                blocker_details: "Client has not provided necessary project requirements.",
                assigned_to: "Project Management Team",
                resolution_plan: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-05-21 03:03:00',
            },
            {
                id: 7,
                resolution_id: 1,
                blocker_details: "Client has not provided necessary project requirements.",
                assigned_to: "Management Team",
                resolution_plan: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-04-21 03:03:00',
            },
            {
                id: 8,
                resolution_id: 2,
                blocker_details: "Client has not provided necessary project requirements.",
                assigned_to: "Team",
                resolution_plan: "consectetuer mauris id sapien. Cras dolor dolor, tempudui. Cum sociis natoque penatibus et magnis di",
                timestamp: '2024-08-21 03:03:00',
            }
    ],
    loading: false
  }),

  getters: {
    getMeetingBlockerList: (state) => { return state.meetingBlockerList }
  },

  actions: {
    async fetchMeetingBlockerList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/meeting/blockers');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch meeting blocker list', 'error')
      } else {
        this.meetingBlockerList = data.value as MeetingBlockerInfo[];
      }
      this.loading = false
    },

    async createMeetingBlocker(payload: MeetingBlockerInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch('/api/meeting/blockers', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Meeting Blocker', 'error');
      } else {
        let meeting_blocker = data.value as MeetingBlockerInfo;
        this.meetingBlockerList.push(meeting_blocker)
        useLayoutStore().setStatusMessage('Meeting Blocker created', 'primary');
      }
    },

    async updateMeetingBlocker(payload: MeetingBlockerInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/meeting/blockers/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update meeting blocker', 'error');
      } else {
        let response = data.value as MeetingBlockerInfo
        let index = this.meetingBlockerList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.meetingBlockerList[index], response)
        }
        useLayoutStore().setStatusMessage('Meeting Blocker updated', 'primary');
      }
    },

    async deleteMeetingBlocker(id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/meeting/blockers/${id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete meeting blocker', 'error');
      }
      else {
        const index = this.meetingBlockerList.findIndex((meetingB) => meetingB.id === id);
        if (index > -1) {
          this.meetingBlockerList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Meeting Blocker deleted', 'primary');
      }
    },
  },
})
