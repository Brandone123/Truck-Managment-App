<template>
  <v-card class="flex-card">
    <v-card-title>Total Costs</v-card-title>
    <client-only>
      <apexchart type="bar" class="flex-chart" :options="totalCostChartOptions" :series="totalCostSeries" />
    </client-only>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import 'apexcharts/dist/apexcharts.css';

const totalCostStore = useMaintenanceDashboardStore();
const {totalCostChartOptions,totalCostSeries} = storeToRefs(totalCostStore )


</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}
</style>