<template>
  <v-card>
    <client-only>
      <apexchart :options="options.chart" :series="options.series" :type="options.chart.type" />
    </client-only>
  </v-card>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue';
  import ApexCharts from 'vue3-apexcharts';
  
  const props = defineProps({
    options: Object,
  });
  </script>
  