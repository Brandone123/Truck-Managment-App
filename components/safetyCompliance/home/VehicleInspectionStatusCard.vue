<template>
    <v-card outlined>
      <v-card-title>
        Recent Vehicle Inspections
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="navigateToInspectionsPage">View All</v-btn>
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item 
            v-for="inspection in recentInspections" 
            :key="inspection.id"
            @click="goToInspectionDetails(inspection.id)"
          >
            <v-list-item-icon>
              <v-icon color="info">mdi-clipboard-check-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ inspection.date  }} - {{ inspection.type }}</v-list-item-title>
              <v-list-item-subtitle>Result: {{ inspection.result }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const recentInspections = ref([
    {
      id: 1,
      date: new Date(2024, 3, 20),
      type: 'Pre-Trip',
      result: 'Passed',
    },
    {
      id: 2,
      date: new Date(2024, 3, 18),
      type: 'Post-Trip',
      result: 'Maintenance Required',
    },
    // Additional inspection records
  ]);
  
  const router = useRouter();
  
  const goToInspectionDetails = (id) => {
    // Navigate to the inspection detail page
    router.push({ name: 'inspection-details', params: { id } });
  };
  
  const navigateToInspectionsPage = () => {
    // Navigate to the overview page of all vehicle inspections
    router.push({ name: 'vehicle-inspections' });
  };
  
  // Filter to format dates
  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  </script>
  
  <script>
  export default {
    filters: {
    //  formatDate,
    },
  };
  </script>
  
  <style scoped>
  /* Add styling here */
  </style>
  