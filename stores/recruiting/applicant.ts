import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { ApplicantInfo } from '~/types/recruiting/applicant';

interface State {
  applicantList: ApplicantInfo[];
  loading: boolean
}

export const useApplicantStore = defineStore('applicant', {
  state: (): State => ({
    applicantList: [
            {
                id: 1,
                first_name: "John",
                last_name: "Doen",
                email: "john@gmail.com",
                phone_number: "+1234567890",
                address: "123 Main St, Anytown, USA",
                status: "New"
            },
            {
                id: 2,
                first_name: "Felix",
                last_name: "Brown",
                email: "john@gmail.com",
                phone_number: "+1234567890",
                address: "123 Main St, Anytown, USA",
                status: "Reviewed"
            },
            {
                id: 3,
                first_name: "Tabeu",
                last_name: "Tamia",
                email: "tabeu@gmail.com",
                phone_number: "+1234567890",
                address: "123 Main St, Anytown, USA",
                status: "Interview"
            },
            {
                id: 4,
                first_name: "Doe",
                last_name: "Shian",
                email: "doe@gmail.com",
                phone_number: "+1234567890",
                address: "123 Main St, Anytown, USA",
                status: "Rejected"
            },
            {
                id: 5,
                first_name: "Vein",
                last_name: "gost",
                email: "gost@gmail.com",
                phone_number: "+1234567890",
                address: "123 Main St, Anytown, USA",
                status: "Accepted"
            },
    ],
    loading: false
  }),

  getters: {
    getApplicantList: (state) => { return state.applicantList },
    getApplicantById: (state) => {
        return (applicantId: number) => state.applicantList.find(applicant => applicant.id === applicantId)
    }
},
actions: {
    createApplicant(payload: ApplicantInfo) {
        this.$state.applicantList.push(payload)
    },

    updateApplicant(payload: ApplicantInfo) {
        const index = this.$state.applicantList.findIndex((applicant) => applicant.id === payload.id);
        if (index > -1) {
            Object.assign(this.applicantList[index], payload)
        }
      },
    deleteApplicant(applicantId: number) {
        const index = this.$state.applicantList.findIndex((applicant) => applicant.id === applicantId);
        if (index > -1) {
            this.applicantList.splice(index, 1);
        }
    },
},
})
