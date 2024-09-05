<template>
  <v-card class="flex-card">
    <v-card-title>Inspections Summary</v-card-title>
    <client-only>
      <apexchart type="pie" class="flex-chart" 
      :options="inspectionSummaryChartOptions" 
      :series="inspectionSummarySeries" />
    </client-only>
  </v-card>
</template>

<script setup lang="ts">
const inspectionSummaryStore = useMaintenanceDashboardStore();
const {inspectionSummarySeries, inspectionSummaryChartOptions} = storeToRefs(inspectionSummaryStore )

</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}

.flex-chart {
  flex-grow: 1;
}
</style>