<template>
  <v-card class="flex-card">
    <v-card-title>Service Costs</v-card-title>
    <client-only>
      <apexchart type="bar" class="flex-chart" :options="serviceCostChartOptions" :series="serviceCostSeries" />
    </client-only>
  </v-card>
</template>

<script setup lang="ts">

const serviceCostStore = useMaintenanceDashboardStore();
const {serviceCostChartOptions, serviceCostSeries} = storeToRefs(serviceCostStore)
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