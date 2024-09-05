<template>
  <!-- person of interest -->
  <v-card class="flex-card">
    <v-card-title>Repair Priority Class Trends</v-card-title>
    <v-card-subtitle>May '24 Scheduled: 43.3% ⬇ 14% from Apr '24</v-card-subtitle>
    <client-only>
      <apexchart type="area" class="flex-chart" :options="chartOptions" :series="series" />
    </client-only>
  </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import 'apexcharts/dist/apexcharts.css';

const store = useMaintenanceDashboardStore();
const { chartOptions, series } = storeToRefs(store);

</script>


<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 460px;
}

.flex-chart {
  flex-grow: 1;
}
</style>
