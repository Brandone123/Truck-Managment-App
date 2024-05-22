<template>
    <v-card>
      <v-card-title>Recent Job Postings</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="job in jobPostings" :key="job.id">
            <v-list-item-content>
              <v-list-item-title>{{ job.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ job.description }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="editJob(job.id)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteJob(job.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn  @click="viewAll">View All</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface JobPosting {
    id: number;
    title: string;
    description: string;
  }
  
  // Sample job postings data
  const jobPostings = ref<JobPosting[]>([
    { id: 1, title: 'Truck Driver', description: 'Responsible for transporting goods...' },
    { id: 2, title: 'Logistics Coordinator', description: 'Oversees the logistical...' },
    // Add more job postings as needed
  ]);
  
  function editJob(jobId: number) {
    // Logic to edit job posting
    console.log('Editing job:', jobId);
  }
  
  function deleteJob(jobId: number) {
    // Logic to delete job posting
    console.log('Deleting job:', jobId);
  }
  
  function viewAll() {
    // Logic to navigate to the view all job postings page
    console.log('Viewing all job postings');
  }
  </script>
  