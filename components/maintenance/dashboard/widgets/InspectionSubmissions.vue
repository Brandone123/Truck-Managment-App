<template>
  <v-card class="flex-card">
    <v-card-title>Inspection Submissions</v-card-title>
    <client-only>
      <apexchart type="line" class="flex-chart" 
      :options="inspectionSubmissionsChartOptions" 
      :series="inspectionSubmissionsSeries" />
    </client-only>
  </v-card>
</template>

<script setup lang="ts">

const inspectionSubmissionsStore = useMaintenanceDashboardStore();
const {inspectionSubmissionsSeries, inspectionSubmissionsChartOptions} = storeToRefs(inspectionSubmissionsStore)

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