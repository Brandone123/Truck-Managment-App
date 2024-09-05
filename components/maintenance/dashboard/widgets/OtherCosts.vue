<template>
  <v-card class="flex-card">
    <v-card-title>Other Costs</v-card-title>
    <client-only>
      <apexchart type="bar" class="flex-chart" :options="otherCostChartOptions" :series="otherCostSeries" />
    </client-only>
  </v-card>
</template>

<script setup lang="ts">

const otherCostStore = useMaintenanceDashboardStore();
const {otherCostChartOptions,otherCostSeries} = storeToRefs(otherCostStore )

</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}
</style>