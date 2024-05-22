<template>
    <v-row >
      <v-col
        v-for="(metric, index) in marketingMetrics"
        :key="index"
        cols="12"
        md="3"
      >
        <v-card class="pa-2 text-center" elevation="2">
          <v-card-title class="justify-space-between mb-2">
            <v-icon class="mr-2" color="primary">{{ metric.icon }}</v-icon>
            <span>{{ metric.name }}</span>
            
          </v-card-title>
          <v-card-text class="text-center">
            <div style="font-size: 20px;font-weight: bold;" class="mb-2">{{ metric.value }}</div>
            <div>{{ metric.description }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  interface MarketingMetric {
    name: string;
    value: string | number;
    description: string;
    icon: string;
  }

  const campaignListStore = useMarketingCampaignStore()
  const {campaignList} = storeToRefs(campaignListStore)

  const leadListStore = useLeadGenerationStore()
  const { leadGenerationList } = storeToRefs(leadListStore)

  const customerSatisfactionStores = useCustomerSatisfactionStore();
  const { feedbackList } = customerSatisfactionStores;

  const filterFeedback = computed(() => {
    return feedbackList.filter((feedback) => feedback.feedback_type === 'Suggestion').length
  })
  
  const marketingMetrics = ref<MarketingMetric[]>([
    {
      name: 'Total Campaigns',
      value: campaignList.value.length,
      description: 'Campaigns run this month',
      icon: 'mdi-chart-bubble',
    },
    {
      name: 'Total Leads',
      value: leadGenerationList.value.length,
      description: 'Leads generated',
      icon: 'mdi-account-cash',
    },
    {
      name: 'Conversion Rate',
      value: '4%',
      description: 'Leads converted to customers',
      icon: 'mdi-percent',
    },
    {
      name: 'Customer Feedback',
      value: filterFeedback.value,
      description: 'Suggestion feedback received',
      icon: 'mdi-thumb-up',
    },
    // Add more metrics as necessary
  ]);
  
  </script>
  
  <style scoped>
  /* Style adjustments as needed */
  </style>
  