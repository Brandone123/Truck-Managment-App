<template>
    <v-card outlined>
      <v-card-title>
        Upcoming Document Expiries
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="navigateToDocumentsPage">View All</v-btn>
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item v-for="document in documentsExpiringSoon" :key="document.id" @click="goToDocumentDetail(document.id)">
            <v-list-item-icon>
              <v-icon color="warning">mdi-alert</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ document.name }}</v-list-item-title>
              <v-list-item-subtitle>Expires on: {{ document.expiryDate }}</v-list-item-subtitle>
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
  
  const documentsExpiringSoon = ref([
    {
      id: 1,
      name: 'John Doe Driver License',
      expiryDate: new Date(2024, 4, 15), // Year, Month (0-based), Day
    },
    {
      id: 2,
      name: 'Truck 101 Vehicle Registration',
      expiryDate: new Date(2024, 5, 1),
    },
    // Add more documents as needed
  ]);
  
  const router = useRouter();
  
  const navigateToDocumentsPage = () => {
    router.push({ name: 'documents-overview' }); // Adjust route name as needed
  };
  
  const goToDocumentDetail = (id) => {
    // Navigate to document detail page
    router.push({ name: 'document-detail', params: { id } }); // Ensure route names match your app's configuration
  };
  
  const formatDate = (value) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return value.toLocaleDateString(undefined, options);
  };
  </script>
  
  <script>
  export default {
    filters: {
      //formatDate,
    },
  };
  </script>
  
  <style scoped>
  /* Add styling as needed */
  </style>
  