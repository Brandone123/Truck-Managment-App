<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-3" outlined>
            <v-card-title>Driver Training Overview</v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search for drivers or training..."
              single-line
              hide-details
            ></v-text-field>
            <v-data-table
              :headers="headers"
              :items="trainings"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editTraining(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteTraining(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  // Assume these are fetched from your backend or Vuex store
  const trainings = ref([
    {
      id: 1,
      driver: 'John Doe',
      trainingType: 'Safety Protocol',
      trainingDate: '2024-04-01',
      trainer: 'Jane Smith',
      status: 'Scheduled',
    },
    // Add more training records
  ]);
  
  const headers = ref([
    { text: 'Driver', align: 'start', value: 'driver' },
    { text: 'Training Type', value: 'trainingType' },
    { text: 'Date', value: 'trainingDate' },
    { text: 'Trainer', value: 'trainer' },
    { text: 'Status', value: 'status' },
    { text: 'Actions', value: 'actions', sortable: false },
  ]);
  
  const search = ref('');
  
  // Functions to handle editing and deleting training records
  const editTraining = (training) => {
    console.log('Edit', training);
    // Implement your logic to edit training records
  };
  
  const deleteTraining = (training) => {
    console.log('Delete', training);
    // Implement your logic to delete training records
  };
  </script>
  
  <style scoped>
  /* Add styling here */
  </style>
  