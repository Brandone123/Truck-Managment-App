<template>
  <v-card class="flex-card">
    <!-- person of interest -->
    <v-card-title>Time to Resolve</v-card-title>
    <client-only>
      <apexchart type="line" class="flex-chart" :options="chartTimeOptions" :series="seriesTime" />
    </client-only>
  </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import 'apexcharts/dist/apexcharts.css';

const dashboardStore = useMaintenanceDashboardStore ()
const {chartTimeOptions,seriesTime} = storeToRefs(dashboardStore);

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