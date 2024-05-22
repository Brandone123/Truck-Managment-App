<template>
    <div>
      <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Job Listings Management</span>
      <div>
        <RecruitingApplicationDialog :updating="updatingApplicant" @update:show="updateApplicantDialog"
          :show="applicantDialog" :item="editedApplicant" />
      </div>
    </div>
      <v-row>
        <v-col cols="12">
          <SharedUiCustomTable :headers="applicantHeaders" :items="applicationList" show-expand v-model:expanded="expandedRows">
            <template v-slot:item.application_status="{ item }">
              <v-chip :color="getStatusColor(item.application_status)" dark>
                {{ item.application_status }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small color="primary" class="mr-2" @click="editApplicant(item)">mdi-eye</v-icon>
              <v-icon small color="red" @click="deleteApplicant(item.id)">mdi-delete</v-icon>
            </template>
            <template v-slot:item.full_name="{ item }">
              {{ getApplicantName(item.applicant_id) }}
            </template>
            <template v-slot:item.title="{ item }">
              {{ getJobPostingTitle(item.job_posting_id) }}
            </template>
            <template v-slot:expanded-row="{ columns, item, index, isExpanded }">
              <tr>
                <td :colspan="columns.length" style="height:100px;">
                  <v-card flat background-color="gray">
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="3">
                          <div class="text-subtitle font-weight-bold test-caption">
                            <h3>Personnal Information</h3>
                          </div>
                          <div class=" mt-5 ">
                            <div>Full Name: {{ item.first_name }} {{ item.last_name }}</div>
                            <div>Gender: {{ item.gender }}</div>
                            <div>Date of Birth: {{ item.date_of_birth }}</div>

                            <v-divider class="my-4"></v-divider>

                            <div>Address: {{ item.address }}</div>
                            <div>Phone number: {{ item.phone_number }}</div>
                            <div>Email: {{ item.email }}</div>
                            <div>Nationality: {{ item.nationality }}</div>
                          </div>
                        </v-col>
                        <v-col cols="12" md="3">
                          <div class="text-subtitle font-weight-bold test-caption">
                            <h3>Other Information</h3>
                          </div>
                          <div class=" mt-5 ">
                            <div>Cover letter: 
                              <span style="color:cornflowerblue; cursor: pointer;" @click="viewResume(item.cover_letter)"> View</span>
                            </div>
                            <div>Resume: 
                              <span style="color:cornflowerblue; cursor: pointer;" @click="viewResume(item.resume)"> View</span>
                            </div>
                            <div>Education History: {{ item.education_history }}</div>

                            <v-divider class="my-4"></v-divider>
                            
                            <div>Skills: {{ item.skills }}</div>
                            <div>Work Experience: {{ item.work_experience }}</div>
                            <div>Email: {{ item.references }}</div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </td>
              </tr>
            </template>
          </SharedUiCustomTable>
        </v-col>
      </v-row>
    </div>
  </template>
  
<script setup lang="ts">
  import { defineComponent } from 'vue';
  import { useJobPostingStore } from '~/stores/recruiting/job_posting';
  import {useApplicantStore} from '~/stores/recruiting/applicant'
  import type { ApplicationInfo } from '~/types/recruiting/application';
  import {useApplicationStore} from "~/stores/recruiting/application"
  
  interface Application {
    id: number;
    applicantName: string;
    jobTitle: string;
    status: string;
  }

  const JobPostingListStore = useJobPostingStore();
  const { jobPostingList } = storeToRefs(JobPostingListStore);

  const ApplicantStore = useApplicantStore();
  const { applicantList } = storeToRefs(ApplicantStore);

  const ApplicationStore = useApplicationStore();
  const { applicationList } = storeToRefs(ApplicationStore);

  const applicantHeaders = ref([
    { title: 'APPLICANT ID', key: 'applicant_id', class: 'no-wrap' },
    { title: 'APPLICANT NAME', key: 'full_name', class: 'no-wrap' },
    { title: 'JOB TITLE', key: 'title', class: 'no-wrap' },
    { title: 'Status', key: 'application_status', class: 'no-wrap' },
    { title: 'ACTIONS', key: 'actions', class: 'no-wrap' },
  ])

  const getStatusColor = (application_status: any) => {
      switch (application_status) {
        case 'New': return 'blue';
        case 'Under Review': return 'green';
        case 'Interview': return 'orange';
        case 'Rejected': return 'red';
        case 'Accepted': return 'gray';
        default: return 'grey';
      }
    }

  const applicantDialog = ref(false);
  const updatingApplicant = ref(false);

  const defaultApplicant: Ref<ApplicationInfo> = ref({
    id: null,
    applicant_id: null,
    job_posting_id: null,
    first_name: null,
    last_name: null,
    email: null,
    phone_number: null,
    address: null,
    date_of_birth: null,
    gender: null,
    nationality: null,
    work_experience: null,
    education_history: null,
    skills: null,
    languages_spoken: null,
    references: null,
    cover_letter: null,
    resume: null,
    application_status: null,
    additional_documents: null,
    application_date: null,
    notes: null,
  });

  const editedApplicant = ref(defaultApplicant.value);

  const editApplicant = (applicant: ApplicationInfo) => {
    editedApplicant.value = Object.assign({}, applicant);
    updatingApplicant.value = true;
    applicantDialog.value = true;
  };

  const updateApplicantDialog = (value: boolean) => {
    applicantDialog.value = value;
    editedApplicant.value = defaultApplicant.value as ApplicationInfo;
    updatingApplicant.value = false;
  };

  const deleteApplicant = (id: number) => {
    ApplicantStore.deleteApplicant(id);
  };

  const getApplicantName = ( applicantId: any) => {
    const applicant = applicantList.value.find(applicant => applicant.id === applicantId);
    return applicant ? (`${applicant.first_name} ${applicant.last_name}`): '';
  };

  const getJobPostingTitle = ( job_postingId: any) => {
    const job_posting = jobPostingList.value.find(job_posting => job_posting.id === job_postingId);
    return job_posting ? job_posting.title : '';
  };

  const expandedRows = ref([])

  function findNewArrayIndex(arr1: any[], arr2: any[]) {
    for (let i = 0; i < arr1.length; i++) {
        if (!arr2.includes(arr1[i])) {
            return applicationList.value.indexOf(arr1[i])
        }
    }
    return -1
  }
  const viewResume = (pdfUrl:any) => {
    window.open(pdfUrl, "_blank");
  }

  watch(expandedRows, (newVal, oldVal) => {
    if (newVal.length > oldVal.length) {
        let index = findNewArrayIndex(newVal, oldVal)
    }
  })

  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  