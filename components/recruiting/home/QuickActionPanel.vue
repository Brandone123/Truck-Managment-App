<template>
  <v-card outlined class="pa-4">
    <v-card-title class="text-h5">
      Campaign Quick Actions
    </v-card-title>
    <v-card-text>
      <v-btn color="primary" class="mr-4" @click="createJob">
        New Job Posting
      </v-btn>
      <v-btn color="secondary" class="mr-4" @click="viewApplications">
        View Applications
      </v-btn>
      <v-btn color="accent" @click="openInterview">
        Schedule Interview
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// Example setup for event handlers
const createJob = () => {
  router.push('/recruiting/job_posting'); 
};

const viewApplications = () => {
  router.push('/recruiting/application_management'); 
};

const openInterview = () => {
  router.push('/recruiting/interview_scheduling'); 
};

</script>
