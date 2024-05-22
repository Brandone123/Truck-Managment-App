import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { MeetingActionInfo } from '~/types/meeting/meeting_action';

interface State {
  meetingActionList: MeetingActionInfo[];
  loading: boolean
}

export const useMeetingActionStore = defineStore('meeting_action', {
  state: (): State => ({
    meetingActionList: [
            {
                id: 1,
                resolution_id: 1,
                action_details: "Follow up with the client regarding project timelines.",
                assigned_to: "Project Management Team",
                due_date: "2024-03-31",
                timestamp: '2024-03-31 23:03:00',
                status: 'Open',
            },
            {
                id: 2,
                resolution_id: 2,
                action_details: "Organize a team meeting to discuss the upcoming product launch.",
                assigned_to: "Management Team",
                due_date: "2024-05-29",
                timestamp: '2024-04-21 03:03:00',
                status: 'Open',
            },
            {
                id: 3,
                resolution_id: 3,
                action_details: "Review and update the project specification documents.",
                assigned_to: "Team",
                due_date: "2024-05-31",
                timestamp: '2024-04-21 03:03:00',
                status: 'Open',
            },
            {
                id: 4,
                resolution_id: 2,
                action_details: "Organize a team meeting to discuss the upcoming product launch.",
                assigned_to: "Project Management Team",
                due_date: "2024-05-29",
                timestamp: '2024-08-21 03:03:00',
                status: 'In Progress',
            },
            {
                id: 5,
                resolution_id: 1,
                action_details: "Follow up with the client regarding project timelines.",
                assigned_to: "Team",
                due_date: "2024-03-31",
                timestamp: '2024-08-21 03:03:00',
                status: 'Completed',
            },
            {
                id: 6,
                resolution_id: 3,
                action_details: "Review and update the project specification documents.",
                assigned_to: "Project Management Team",
                due_date: "2024-05-29",
                timestamp: '2024-08-21 03:03:00',
                status: 'Completed',
            },
            {
                id: 7,
                resolution_id: 1,
                action_details: "Follow up with the client regarding project timelines.",
                assigned_to: "Management Team",
                due_date: "2024-05-29",
                timestamp: '2024-08-21 03:03:00',
                status: 'Completed',
            },
            {
                id: 8,
                resolution_id: 2,
                action_details: "Organize a team meeting to discuss the upcoming product launch.",
                assigned_to: "Team",
                due_date: "2024-05-29",
                timestamp: '2024-08-21 03:03:00',
                status: 'In Progress',
            }
    ],
    loading: false
  }),

  getters: {
    getMeetingActionList: (state) => { return state.meetingActionList }
  },

  actions: {
    async fetchMeetingActionList() {
      this.loading = true
      const { data, error } = await useApiFetch('/api/meeting/actions');
      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to fetch meeting action list', 'error')
      } else {
        this.meetingActionList = data.value as MeetingActionInfo[];
      }
      this.loading = false
    },

    async createMeetingAction(payload: MeetingActionInfo) {
      useLayoutStore().setOverlay(true)
      const { error, data } = await useApiFetch('/api/meeting/actions', {
        method: 'POST',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to create Meeting Action', 'error');
      } else {
        let meeting_action = data.value as MeetingActionInfo;
        this.meetingActionList.push(meeting_action)
        useLayoutStore().setStatusMessage('Meeting Action created', 'primary');
      }
    },

    async updateMeetingAction(payload: MeetingActionInfo) {
      useLayoutStore().setOverlay(true)
      const { data, error } = await useApiFetch(`/api/meeting/actions/${payload.id}`, {
        method: 'PUT',
        body: payload,
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to update meeting action', 'error');
      } else {
        let response = data.value as MeetingActionInfo
        let index = this.meetingActionList.findIndex(item => item.id === response.id)
        if (index > -1) {
          Object.assign(this.meetingActionList[index], response)
        }
        useLayoutStore().setStatusMessage('Meeting Action updated', 'primary');
      }
    },

    async deleteMeetingAction(id: number): Promise<void> {
      useLayoutStore().setOverlay(true)
      const { error } = await useApiFetch(`/api/meeting/actions/${id}`, {
        method: 'DELETE',
      });
      useLayoutStore().setOverlay(false)

      if (error.value) {
        useLayoutStore().setStatusMessage('Failed to delete meeting action', 'error');
      }
      else {
        const index = this.meetingActionList.findIndex((meetingB) => meetingB.id === id);
        if (index > -1) {
          this.meetingActionList.splice(index, 1);
        }
        useLayoutStore().setStatusMessage('Meeting Action deleted', 'primary');
      }
    },
  },
})
