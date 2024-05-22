import { defineStore } from 'pinia';
import { useApiFetch } from "~/composables/useApiFetch";
import type { ApplicationInfo } from '~/types/recruiting/application';

interface State {
  applicationList: ApplicationInfo[];
  loading: boolean
}

export const useApplicationStore = defineStore('application', {
  state: (): State => ({
    applicationList: [
            {
                id: 1,
                applicant_id: 1,
                job_posting_id: 1,
                first_name: "John",
                last_name: "Doen",
                email: "john@gmail.com",
                phone_number: "+1234567890",
                address: "123 Main St, Anytown, USA",
                date_of_birth: "1990-02-10",
                gender: "Male",
                nationality: "US",
                work_experience: "5 years of experience",
                education_history: "Bachelor's degree",
                skills: "Java, PHP, JavaScript",
                languages_spoken: "English, Spanish",
                references: "John Smith, CEO at XYZ Corp",
                cover_letter: "path/to/document.pdf?url",
                resume: "path/to/resume.pdf?url",
                application_status: "New",
                additional_documents: "path/to/document.pdf?url",
                application_date: "2024-04-12 15:00:00",
                notes: "Applicant seems qualified for the position",
            },
            {
                id: 2,
                applicant_id: 2,
                job_posting_id: 2,
                first_name: "Felix",
                last_name: "Brown",
                email: "john@gmail.com",
                phone_number: "+1234567890",
                address: "123 Main St, Anytown, USA",
                date_of_birth: "1990-02-10",
                gender: "Male",
                nationality: "US",
                work_experience: "5 years of experience",
                education_history: "Bachelor's degree",
                skills: "Java, PHP, JavaScript",
                languages_spoken: "English, Spanish",
                references: "John Smith, CEO at XYZ Corp",
                cover_letter: "path/to/document.pdf?url",
                resume: "path/to/resume.pdf?url",
                application_status: "Under Review",
                additional_documents: "path/to/document.pdf",
                application_date: "2024-04-12 15:00:00",
                notes: "Applicant seems qualified for the position",
                
            },
            {
                id: 3,
                applicant_id: 3,
                job_posting_id: 3,
                first_name: "Tabeu",
                last_name: "Tamia",
                email: "tabeu@gmail.com",
                phone_number: "+1234567890",
                address: "123 Main St, Anytown, USA",
                date_of_birth: "1990-02-10",
                gender: "Female",
                nationality: "US",
                work_experience: "5 years of experience",
                education_history: "Bachelor's degree",
                skills: "Java, PHP, JavaScript",
                languages_spoken: "English, Spanish",
                references: "John Smith, CEO at XYZ Corp",
                cover_letter: "path/to/document.pdf?url",
                resume: "path/to/resume.pdf?url",
                application_status: "Under Review",
                additional_documents: "path/to/document.pdf",
                application_date: "2024-03-12 15:00:00",
                notes: "Applicant seems qualified for the position",
                
            },
            {
                id: 4,
                applicant_id: 4,
                job_posting_id: 4,
                first_name: "Doe",
                last_name: "Shian",
                email: "doe@gmail.com",
                phone_number: "+1234567890",
                address: "123 Main St, Anytown, USA",
                date_of_birth: "1990-02-10",
                gender: "Female",
                nationality: "US",
                work_experience: "5 years of experience",
                education_history: "Bachelor's degree",
                skills: "Java, PHP, JavaScript",
                languages_spoken: "English, Spanish",
                references: "John Smith, CEO at XYZ Corp",
                cover_letter: "path/to/document.pdf?url",
                resume: "path/to/resume.pdf?url",
                application_status: "Interview",
                additional_documents: "path/to/document.pdf",
                application_date: "2024-03-12 15:00:00",
                notes: "Applicant seems qualified for the position",
                
            },
            {
                id: 5,
                applicant_id: 5,
                job_posting_id: 5,
                first_name: "Vein",
                last_name: "gost",
                email: "gost@gmail.com",
                phone_number: "+1234567890",
                address: "123 Main St, Anytown, USA",
                date_of_birth: "1990-02-10",
                gender: "Male",
                nationality: "US",
                work_experience: "5 years of experience",
                education_history: "Bachelor's degree",
                skills: "Java, PHP, JavaScript",
                languages_spoken: "English, Spanish",
                references: "John Smith, CEO at XYZ Corp",
                cover_letter: "path/to/document.pdf?url",
                resume: "path/to/resume.pdf?url",
                application_status: "Rejected",
                additional_documents: "path/to/document.pdf",
                application_date: "2024-02-12 15:00:00",
                notes: "Applicant seems qualified for the position",
                
            },
    ],
    loading: false
  }),

  getters: {
    getApplicationList: (state) => { return state.applicationList },
    getApplicationById: (state) => {
        return (applicationId: number) => state.applicationList.find(application => application.id === applicationId)
    }
},
actions: {
    createApplication(payload: ApplicationInfo) {
        this.$state.applicationList.push(payload)
    },

    updateApplication(payload: ApplicationInfo) {
        const index = this.$state.applicationList.findIndex((application) => application.id === payload.id);
        if (index > -1) {
            Object.assign(this.applicationList[index], payload)
        }
      },
    deleteApplication(applicationId: number) {
        const index = this.$state.applicationList.findIndex((application) => application.id === applicationId);
        if (index > -1) {
            this.applicationList.splice(index, 1);
        }
    },
},
})
