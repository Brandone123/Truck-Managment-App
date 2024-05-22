import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { JobPostingInfo } from '~/types/recruiting/job_posting';

interface State {
  jobPostingList: JobPostingInfo[];
  loading: boolean
}

export const useJobPostingStore = defineStore('job_posting', {
  state: (): State => ({
    jobPostingList: [
            {
                id: 1,
                title: "Software Engineer",
                description: "We are seeking a talented software engineer to join our team.",
                responsibilities: "Developing software solutions, collaborating with team members.",
                qualifications: "Bachelor's degree in Computer Science, 3+ years of experience.",
                advertisement_channels: "Online job boards",
                
            },
            {
                id: 2,
                title: "Designer",
                description: "We are seeking a talented designer to join our team.",
                responsibilities: "Developing software solutions, collaborating with team members.",
                qualifications: "Bachelor's degree in Computer Science, 2+ years of experience.",
                advertisement_channels: "Online job boards",
                
            },
            {
                id: 3,
                title: "Accounter",
                description: "We are seeking a talented accounter to join our team.",
                responsibilities: "Developing solutions, collaborating with team members.",
                qualifications: "Bachelor's degree in Accounting, 3+ years of experience.",
                advertisement_channels: "Social media",
                
            },
            {
                id: 4,
                title: "Driver",
                description: "We are seeking a talented driver to join our team.",
                responsibilities: "Collaborating with team members.",
                qualifications: "3+ years of experience.",
                advertisement_channels: "Compagny Website",
                
            },
            {
                id: 5,
                title: "IT",
                description: "We are seeking a talented IT to join our team.",
                responsibilities: "Developing IT solutions, collaborating with team members.",
                qualifications: "Bachelor's degree in Computer Science, 3+ years of experience.",
                advertisement_channels: "Industry Publications",
                
            },
    ],
    loading: false
  }),

  getters: {
    getJobPostingList: (state) => { return state.jobPostingList },
    getJobPostingById: (state) => {
        return (jobPostingId: number) => state.jobPostingList.find(jobPosting => jobPosting.id === jobPostingId)
    }
},
actions: {
    createJobPosting(payload: JobPostingInfo) {
        this.$state.jobPostingList.push(payload)
    },

    updateJobPosting(payload: JobPostingInfo) {
        const index = this.$state.jobPostingList.findIndex((jobPosting) => jobPosting.id === payload.id);
        if (index > -1) {
            Object.assign(this.jobPostingList[index], payload)
        }
      },
    deleteJobPosting(jobPostingId: number) {
        const index = this.$state.jobPostingList.findIndex((jobPosting) => jobPosting.id === jobPostingId);
        if (index > -1) {
            this.jobPostingList.splice(index, 1);
        }
    },
},
})
