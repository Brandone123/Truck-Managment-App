<template>
  <v-card class="flex-card">
    <v-card-title>Cost Per Meter</v-card-title>
    <client-only>
      <apexchart type="line" class="flex-chart" :options="costPerMeterChartOptions" :series="costPerMeterSeries" />
    </client-only>
  </v-card>
</template>

<script setup lang="ts">

const costPerMeterStore = useMaintenanceDashboardStore();
const {costPerMeterSeries, costPerMeterChartOptions} = storeToRefs(costPerMeterStore)
</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}
</style>