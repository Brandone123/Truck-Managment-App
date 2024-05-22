import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { InterviewScheduleInfo } from '~/types/recruiting/interview_schedule';

interface State {
  interviewScheduleList: InterviewScheduleInfo[];
  loading: boolean
}

export const useInterviewScheduleStore = defineStore('interviewSchedule', {
  state: (): State => ({
    interviewScheduleList: [
            {
                id: 1,
                applicant_id: [1],
                job_posting_id: 1,
                interview_date: "2024-04-30 09:00:00",
                interviewers: "Jane Smith",
                interview_notes: "Applicant showed strong communication skills",
                interview_feedback: "Applicant lacks experience in communication",
                interview_status: "Scheduled"
            },
            {
                id: 2,
                applicant_id: [2],
                job_posting_id: 2,
                interview_date: "2024-03-12 07:00:00",
                interviewers: "Jane Smith",
                interview_notes: "Applicant showed strong communication skills",
                interview_feedback: "Applicant lacks experience in communication",
                interview_status: "Completed"
            },
            {
                id: 3,
                applicant_id: [3],
                job_posting_id: 3,
                interview_date: "2024-05-14 08:30:00",
                interviewers: "Jane Smith",
                interview_notes: "Applicant showed strong communication skills",
                interview_feedback: "Applicant lacks experience in communication",
                interview_status: "Cancelled"
            },
            {
                id: 4,
                applicant_id: [4],
                job_posting_id: 4,
                interview_date: "2024-04-02 12:00:00",
                interviewers: "Jane Smith",
                interview_notes: "Applicant showed strong communication skills",
                interview_feedback: "Applicant lacks experience in communication",
                interview_status: "Cancelled"
            },
            {
                id: 5,
                applicant_id: [5],
                job_posting_id: 5,
                interview_date: "2024-02-12 19:00:00",
                interviewers: "Jane Smith",
                interview_notes: "Applicant showed strong communication skills",
                interview_feedback: "Applicant lacks experience in communication",
                interview_status: "Scheduled"
            },
    ],
    loading: false
  }),

  getters: {
    getInterviewScheduleList: (state) => { return state.interviewScheduleList },
    getInterviewScheduleById: (state) => {
        return (interviewScheduleId: number) => state.interviewScheduleList.find(interviewSchedule => interviewSchedule.id === interviewScheduleId)
    }
},
actions: {
    createInterviewSchedule(payload: InterviewScheduleInfo) {
        this.interviewScheduleList.push(payload);
      },

    updateInterviewSchedule(payload: InterviewScheduleInfo) {
        const index = this.$state.interviewScheduleList.findIndex((interviewSchedule) => interviewSchedule.id === payload.id);
        if (index > -1) {
            Object.assign(this.interviewScheduleList[index], payload)
        }
      },
    deleteInterviewSchedule(interviewScheduleId: number) {
        const index = this.$state.interviewScheduleList.findIndex((interviewSchedule) => interviewSchedule.id === interviewScheduleId);
        if (index > -1) {
            this.interviewScheduleList.splice(index, 1);
        }
    },
},
})
