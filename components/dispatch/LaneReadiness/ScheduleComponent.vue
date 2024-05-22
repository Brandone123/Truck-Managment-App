<script setup lang="ts">
import { ref } from 'vue';
import { VCard, VCardTitle, VCardText, VTextField, VTextarea, VDataTable, VBtn, VIcon } from 'vuetify/components';

// Sample data for incident reports
const incidentReports = ref([
  { date: '2024-05-01', description: 'Minor accident at Ohio stop', actionTaken: 'Driver reprimanded' },
  { date: '2024-05-10', description: 'Cargo damage during transit', actionTaken: 'Insurance claimed' },
]);

// Form data for adding new incident reports
const newIncidentDate = ref('');
const newIncidentDescription = ref('');
const newIncidentAction = ref('');

// Add a new incident report
const addIncidentReport = () => {
  incidentReports.value.push({
    date: newIncidentDate.value,
    description: newIncidentDescription.value,
    actionTaken: newIncidentAction.value,
  });

  newIncidentDate.value = '';
  newIncidentDescription.value = '';
  newIncidentAction.value = '';
};

// Define headers for the incident reports table
const headers = [
  { title: 'Date', key: 'date' },
  { title: 'Description', key: 'description' },
  { title: 'Action Taken', key: 'actionTaken' },
];
</script>

<template>
  <v-card>
    <v-card-title>Compliance and Safety</v-card-title>
    <v-card-text>
      <!-- Regulatory Compliance -->
      <v-card>
        <v-card-title>Regulatory Compliance</v-card-title>
        <v-card-text>
          <v-textarea
            label="Regulatory Compliance Checks"
            placeholder="Enter compliance checks here..."
          ></v-textarea>
        </v-card-text>
      </v-card>

      <!-- Safety Instructions -->
      <v-card class="mt-4">
        <v-card-title>Safety Instructions</v-card-title>
        <v-card-text>
          <v-textarea
            label="Safety Protocols"
            placeholder="Enter safety protocols here..."
          ></v-textarea>
        </v-card-text>
      </v-card>

      <!-- Incident Reports -->
      <v-card class="mt-4">
        <v-card-title>Incident Reports</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="incidentReports"
            class="elevation-1"
          ></v-data-table>
          <v-divider class="my-4"></v-divider>
          <v-text-field
            label="Incident Date"
            v-model="newIncidentDate"
            type="date"
          ></v-text-field>
          <v-textarea
            label="Incident Description"
            v-model="newIncidentDescription"
            placeholder="Enter incident description..."
          ></v-textarea>
          <v-textarea
            label="Action Taken"
            v-model="newIncidentAction"
            placeholder="Enter action taken..."
          ></v-textarea>
          <v-btn @click="addIncidentReport" class="mt-2" color="primary">
            <v-icon left>mdi-plus</v-icon>Add Incident Report
          </v-btn>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
