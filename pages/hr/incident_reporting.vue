<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4">
            <v-card-title>
              Incident Reports
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search reports"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="incidents"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="viewIncident(item)">
                  <v-icon color="primary">mdi-eye</v-icon>
                </v-btn>
                <v-btn icon @click="editIncident(item)">
                  <v-icon color="secondary">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deleteIncident(item)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const search = ref('');
  const incidents = ref([
    // Sample data - replace with data fetched from your backend
    {
      id: 1,
      employeeName: 'John Doe',
      incidentDate: new Date().toISOString().substring(0, 10), // today's date for sample
      incidentType: 'Safety Violation',
      description: 'Description of the incident...',
      // ...other relevant fields
    },
    // ...more incidents
  ]);
  
  const headers = [
    { text: 'Employee Name', value: 'employeeName' },
    { text: 'Incident Date', value: 'incidentDate' },
    { text: 'Incident Type', value: 'incidentType' },
    { text: 'Description', value: 'description', sortable: false },
    { text: 'Actions', value: 'actions', sortable: false },
  ];
  
  const viewIncident = (item) => {
    // Logic to view details of the incident report
    console.log('Viewing incident for:', item);
  };
  
  const editIncident = (item) => {
    // Logic to edit the incident report
    console.log('Editing incident for:', item);
  };
  
  const deleteIncident = (item) => {
    // Logic to delete the incident report
    console.log('Deleting incident:', item);
  };
  </script>
  