<script setup lang="ts">
import KPICard from '@/components/dispatch/LaneReadiness/KPICard.vue';
import LaneTable from '@/components/dispatch/LaneReadiness/LaneTable.vue';

// Sample data for KPIs
const kpis = [
  { title: 'Total Lanes', value: '5', icon: 'mdi-road-variant', color: 'blue' },
  { title: 'Active Lanes', value: '4', icon: 'mdi-checkbox-marked-circle-outline', color: 'green' },
  { title: 'Inactive Lanes', value: '1', icon: 'mdi-close-circle-outline', color: 'red' },
  { title: 'Pending Contracts', value: '2', icon: 'mdi-file-document-outline', color: 'orange' }
];
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col
          v-for="(kpi, index) in kpis"
          :key="index"
          cols="12"
          md="3"
        >
          <KPICard
            :title="kpi.title"
            :value="kpi.value"
            :icon="kpi.icon"
            :color="kpi.color"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <LaneTable />
    </v-col>
  </v-row>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
