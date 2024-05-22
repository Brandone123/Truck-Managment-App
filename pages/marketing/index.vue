<template>
    <v-row>
      <v-col cols="12" md="12">
        <CampaignQuickActions />
      </v-col>
      <v-col cols="12" md="12">
        <MarketingMetricsOverview />
      </v-col>
      <v-col cols="12" md="6">
        <OngoingCampaigns />
      </v-col>
      <v-col cols="12" md="6">
        <ChannelPerformance />
      </v-col>
      <v-col cols="12" md="6">
        <CustomerFeedbackHighlights />
      </v-col>
      <v-col cols="12" md="6">
        <LeadGenerationStats />
      </v-col>
     
    </v-row>

  </template>
  
  <script setup lang="ts">
  // Import components
  import CampaignQuickActions from '@/components/marketing/home/CampaignQuickActions.vue';
  import OngoingCampaigns from '@/components/marketing/home/OngoingCampaigns.vue';
  import ChannelPerformance from '@/components/marketing/home/ChannelPerformance.vue';
  import LeadGenerationStats from '@/components/marketing/home/LeadGenerationStats.vue';
  import CustomerFeedbackHighlights from '@/components/marketing/home/CustomerFeedbackHighlights.vue';
  import MarketingMetricsOverview from '@/components/marketing/home/MarketingMetricsOverview.vue';
  </script>
  