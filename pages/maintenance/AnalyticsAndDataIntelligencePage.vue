<template>
    <div>
      <div class="d-flex justify-space-between mb-16">
        <span class="text-primary text-h5">Analytics and Data Intelligence</span>
      </div>
  
      <v-row>
        <v-col cols="12">
          <AnalyticsDashboard />
        </v-col>
      </v-row>
  
      <AnalyticsDetailsModal :modelValue="detailsDialog" :analytic="selectedAnalytic" @update:modelValue="detailsDialog = $event" />
      <GenerateAnalyticsReportForm :modelValue="generateReportDialog" @update:modelValue="generateReportDialog = $event" @generate="generateNewReport" />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import AnalyticsDashboard from '@/components/maintenance/reports/analytics/AnalyticsDashboard.vue';
  import AnalyticsDetailsModal from '@/components/maintenance/reports/analytics/AnalyticsDetailsModal.vue';
  import GenerateAnalyticsReportForm from '@/components/maintenance/reports/analytics/GenerateAnalyticsReportForm.vue';
  import { useAnalyticsStore } from '@/stores/maintenance/analyticsStore';
  import type { Analytic } from '@/types/maintenance/analyticsTypes';
  
  const analyticsStore = useAnalyticsStore();
  analyticsStore.setInitialData()
  
  const search = ref('');
  const detailsDialog = ref(false);
  const generateReportDialog = ref(false);
  const selectedAnalytic = ref<Analytic | null>(null);
  
  const generateNewReport = async (reportParams: any) => {
    // Logic to generate new report
  };
  </script>
  