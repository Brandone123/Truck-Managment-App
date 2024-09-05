<template>
  <v-card class="flex-card">
    <v-card-title>Latest Meter Readings</v-card-title>
    <client-only>
      <apexchart type="scatter" class="flex-chart" :options="latestMeterChartOptions" :series="latestMeterSeries" />
    </client-only>
  </v-card>
</template>

<script setup lang="ts">

const latestMeterStore = useMaintenanceDashboardStore();
const {latestMeterSeries, latestMeterChartOptions} = storeToRefs(latestMeterStore)
</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 460px;
}
</style>