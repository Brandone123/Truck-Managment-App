<template>
  <v-row>
    <v-col cols="12" md="6" lg="4">
      <v-card>
        <!-- Completion Rate Chart -->
        <apexchart type="bar" :options="completionRateOptions" :series="completionRateSeries"></apexchart>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" lg="4">
      <v-card>
        <!-- Average Score Chart -->
        <apexchart type="bar" :options="averageScoreOptions" :series="averageScoreSeries"></apexchart>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" lg="4">
      <v-card>
        <!-- Time Spent Chart -->
        <apexchart type="line" :options="timeSpentOptions" :series="timeSpentSeries"></apexchart>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const completionRateOptions = ref({
  chart: {
    id: 'completion-rate',
    type: 'bar',
  },
  xaxis: {
    categories: ['Module 1', 'Module 2', 'Module 3'],
  },
  title: {
    text: 'Completion Rate',
    align: 'center',
  },
});

const completionRateSeries = ref([
  {
    name: 'Completion Rate',
    data: [85, 75, 90],
  },
]);

const averageScoreOptions = ref({
  chart: {
    id: 'average-score',
    type: 'bar',
  },
  xaxis: {
    categories: ['Module 1', 'Module 2', 'Module 3'],
  },
  title: {
    text: 'Average Score',
    align: 'center',
  },
});

const averageScoreSeries = ref([
  {
    name: 'Average Score',
    data: [80, 70, 95],
  },
]);

const timeSpentOptions = ref({
  chart: {
    id: 'time-spent',
    type: 'line',
  },
  xaxis: {
    categories: ['Module 1', 'Module 2', 'Module 3'],
  },
  title: {
    text: 'Time Spent (hours)',
    align: 'center',
  },
});

const timeSpentSeries = ref([
  {
    name: 'Time Spent',
    data: [2, 3, 1.5],
  },
]);
</script>