<template>
    <v-card outlined class="pa-4">
      <v-card-title class="text-h5">
        Campaign Quick Actions
      </v-card-title>
      <v-card-text>
        <v-btn color="primary" class="mr-4" @click="createCampaign">
          New Campaign
        </v-btn>
        <v-btn color="secondary" class="mr-4" @click="viewFeedback">
          View Feedback
        </v-btn>
        <v-btn color="accent" @click="openAnalytics">
          Performance Metric
        </v-btn>
      </v-card-text>
    </v-card>
  </template>
  
<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const router = useRouter();

  // Example setup for event handlers
  const createCampaign = () => {
    router.push('/marketing/campaign'); 
  };
  
  const viewFeedback = () => {
    router.push('/marketing/customer_satisfaction'); 
  };
  
  const openAnalytics = () => {
    router.push('/marketing/performance_metrics'); 
  };

</script>
  