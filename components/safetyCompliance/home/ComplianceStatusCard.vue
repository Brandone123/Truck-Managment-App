<template>
    <v-card class="mx-auto" outlined>
      <v-card-title class="justify-space-between">
        <span>Compliance Status Overview</span>
        <v-btn text color="primary" @click="navigateToCompliancePage">View Details</v-btn>
      </v-card-title>
      <v-card-text>
        <v-progress-circular
          rotate="-90"
          size="100"
          width="15"
          :value="compliancePercentage"
          color="success"
        >
          {{ compliancePercentage }}%
        </v-progress-circular>
        <v-list>
          <v-list-item v-for="(item, index) in complianceItems" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>Status: {{ item.status }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon color="warning" v-if="item.status !== 'Compliant'">
                warning
              </v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const compliancePercentage = ref(75); // This should be dynamically calculated based on actual data
  const complianceItems = ref([
    { name: 'FMCSA Compliance', status: 'Compliant' },
    { name: 'DOT Compliance', status: 'Needs Attention' },
    { name: 'State Regulations', status: 'Compliant' },
    // Add more items as necessary
  ]);
  
  const router = useRouter();
  
  const navigateToCompliancePage = () => {
    router.push({ name: 'compliance-details' }); // Adjust route name as needed
  };
  </script>
  
  <style scoped>
  /* Add styling as needed */
  </style>
  