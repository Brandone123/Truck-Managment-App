<template>
    <v-card outlined>
      <v-card-title>
        Recent Incidents
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="navigateToIncidentsPage">All Incidents</v-btn>
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item v-for="incident in recentIncidents" :key="incident.id" @click="goToIncidentDetail(incident.id)">
            <v-list-item-icon>
              <v-icon color="error">mdi-alert-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ incident.date }} - {{ incident.type }}</v-list-item-title>
              <v-list-item-subtitle>{{ incident.description }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  // Sample data - replace with your actual incident data fetching logic
  const recentIncidents = ref([
    {
      id: 1,
      date: '2024-03-20',
      type: 'Accident',
      description: 'Collision at intersection',
    },
    {
      id: 2,
      date: '2024-03-18',
      type: 'Near Miss',
      description: 'Unsafe lane change reported',
    },
    // Add more incidents as needed
  ]);
  
  const router = useRouter();
  
  // Truncate function for long descriptions
  const truncate = (text, length = 100) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };
  
  // Navigation to incident detail view
  const goToIncidentDetail = (id) => {
    router.push({ name: 'incident-detail', params: { id } }); // Ensure the route and params match your app's configuration
  };
  
  // Navigation to all incidents view
  const navigateToIncidentsPage = () => {
    router.push({ name: 'incidents' }); // Adjust route name as needed
  };
  </script>
  
  <script lang="ts">
  export default {
    filters: {
      //truncate,
    },
  };
  </script>
  
  <style scoped>
  /* Add styling as needed */
  </style>
  