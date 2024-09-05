<template>
  <v-card class="flex-card">
    <v-card-title>Fuel Costs</v-card-title>
    <client-only>
      <apexchart type="bar" class="flex-chart" :options="fuelCostChartOptions" :series="fuelCostSeries" />
    </client-only>
  </v-card>
</template>

<script setup lang="ts">

const fuelCostStore = useMaintenanceDashboardStore();
const {fuelCostChartOptions, fuelCostSeries} = storeToRefs(fuelCostStore )

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