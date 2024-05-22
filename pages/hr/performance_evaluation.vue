<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4">
            <v-card-title>
              Performance Evaluations
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search evaluations"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="evaluations"
              :search="search"
              class="elevation-1"
            
              sort-desc
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="viewDetails(item)">
                  <v-icon color="primary">mdi-eye</v-icon>
                </v-btn>
                <v-btn icon @click="editEvaluation(item)">
                  <v-icon color="secondary">mdi-pencil</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const search = ref('');
  const evaluations = ref([
    // Sample data - replace with data fetched from your backend
    {
      id: 1,
      employeeName: 'Jane Doe',
      reviewDate: new Date().toISOString().substring(0, 10), // today's date for sample
      performanceRating: 'Excellent',
      // ...other relevant fields for performance evaluation
    },
    // ...more evaluations
  ]);
  
  const headers = [
    { text: 'Employee Name', value: 'employeeName', sortable: true },
    { text: 'Review Date', value: 'reviewDate', sortable: true },
    { text: 'Performance Rating', value: 'performanceRating', sortable: true },
    { text: 'Actions', value: 'actions', sortable: false },
  ];
  
  const viewDetails = (item) => {
    // Logic to view the details of the performance evaluation
    console.log('Viewing details for:', item);
  };
  
  const editEvaluation = (item) => {
    // Logic to open the edit dialog for the performance evaluation
    console.log('Editing evaluation for:', item);
  };
  </script>
  