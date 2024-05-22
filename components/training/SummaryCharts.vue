<template>
  <div>
    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Summary Charts</span>
    </div>
    <v-card>
      <v-card-text>
        <client-only>
          <apexchart type="bar" :options="chartOptions" :series="chartData" class="responsive-chart" height="300" />
        </client-only>
      </v-card-text>
    </v-card>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const chartOptions = ref({
  chart: {
    type: 'bar',
  },
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: 'top',
  },
  xaxis: {
    categories: ['Module 1', 'Module 2', 'Module 3'],
  },
  colors: ['#34a853', '#4285f4', '#ea4335', '#fbbc05'],
});

const chartData = ref([
  {
    name: 'Completed',
    data: [44, 55, 41],
  },
  {
    name: 'In Progress',
    data: [53, 32, 33],
  },
  {
    name: 'Not Started',
    data: [12, 17, 11],
  }
]);
</script>

<style>
.responsive-chart {
  height: 350px;
}
</style>