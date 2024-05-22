<template>
   <div class="d-flex flex-wrap">
    <span class="v-card-title px-0 font-weight-bold text-primary"> Recent Job</span>
  </div>
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="job in jobPostingList.slice(0,3)">
          <v-card outlined>
            <v-card-title>{{ job.title }}</v-card-title>
            <v-card-subtitle>{{ job.status }}</v-card-subtitle>
            <v-card-text>{{ job.description }}</v-card-text>
            <v-card-actions>
              <v-btn dense :to="`/recruiting/job_posting/`">View Details</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  </template>
  
  <script lang="ts" setup>
  
  const JobPostingListStore = useJobPostingStore()
  const {jobPostingList} = storeToRefs(JobPostingListStore)

  </script>
  
  <style scoped>
  /* Add any specific styling for your component here */
  </style>
  