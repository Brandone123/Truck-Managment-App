<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTheme } from 'vuetify';
import 'apexcharts/dist/apexcharts.css';

// Sample data
const onTimePerformanceData = ref([90, 85, 95, 80, 88]);
const driverPerformanceData = ref([75, 80, 90, 85, 88]);
const assetUtilizationData = ref([60, 70, 80, 90, 85]);

const chartOptions = computed(() => ({
  onTimePerformance: {
    series: [{
      name: 'On-Time Performance',
      data: onTimePerformanceData.value
    }],
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: ['January', 'February', 'March', 'April', 'May']
    },
    yaxis: {
      title: {
        text: 'Percentage'
      }
    },
    colors: ['#34c38f']
  },
  driverPerformance: {
    series: [{
      name: 'Driver Performance',
      data: driverPerformanceData.value
    }],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: ['Driver 1', 'Driver 2', 'Driver 3', 'Driver 4', 'Driver 5']
    },
    yaxis: {
      title: {
        text: 'Score'
      }
    },
    colors: ['#f46a6a']
  },
  assetUtilization: {
    series: [{
      name: 'Asset Utilization',
      data: assetUtilizationData.value
    }],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: ['Truck 1', 'Truck 2', 'Truck 3', 'Truck 4', 'Truck 5']
    },
    yaxis: {
      title: {
        text: 'Percentage'
      }
    },
    colors: ['#556ee6']
  }
}));
</script>

<template>
  <v-card>
    <v-card-title>Performance Metrics</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>On-Time Performance</v-card-title>
            <v-card-text>
              <client-only>
                <apexchart type="line" height="350" :options="chartOptions.onTimePerformance" :series="chartOptions.onTimePerformance.series" />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>Driver Performance</v-card-title>
            <v-card-text>
              <client-only>
                <apexchart type="bar" height="350" :options="chartOptions.driverPerformance" :series="chartOptions.driverPerformance.series" />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>Asset Utilization</v-card-title>
            <v-card-text>
              <client-only>
                <apexchart type="bar" height="350" :options="chartOptions.assetUtilization" :series="chartOptions.assetUtilization.series" />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
