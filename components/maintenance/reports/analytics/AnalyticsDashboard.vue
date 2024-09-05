<template>
    <div>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-h6 font-weight-bold text-primary">Maintenance Cost Analysis</v-card-title>
            <v-card-text>
              <client-only>
                <apexchart type="line" height="350" :options="maintenanceCostOptions" :series="maintenanceCostOptions.series" />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-h6 font-weight-bold text-primary">Asset Performance</v-card-title>
            <v-card-text>
              <client-only>
                <apexchart type="bar" height="350" :options="assetPerformanceOptions" :series="assetPerformanceOptions" />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-h6 font-weight-bold text-primary">Downtime Reports</v-card-title>
            <v-card-text>
              <client-only>
                <apexchart type="pie" height="350" :options="downtimeOptions" :series="downtimeSeries" />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="text-h6 font-weight-bold text-primary">Predictive Analytics</v-card-title>
            <v-card-text>
              <client-only>
                <apexchart type="line" height="350" :options="predictiveAnalyticsOptions" :series="predictiveAnalyticsSeries" />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { computed } from 'vue';
  import { useAnalyticsStore } from '@/stores/maintenance/analyticsStore';
  
  const analyticsStore = useAnalyticsStore();
  const { chartData } = storeToRefs(analyticsStore);
  
  const maintenanceCostOptions = computed(() => ({
    series: [
      {
        name: 'Maintenance Costs',
        data: chartData.value.maintenanceCost.series
      }
    ],
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: chartData.value.maintenanceCost.categories
    },
    yaxis: {
      title: {
        text: 'Cost ($)'
      }
    },
    colors: ['#22a7f0']
  }));
  
  const assetPerformanceOptions = computed(() => ({
    chart: {
      type: 'bar',
      height: 350,
    },
    xaxis: {
      categories: chartData.value.assetPerformance.categories
    },
    yaxis: {
      title: {
        text: 'Performance'
      }
    },
    colors: ['#1984c5']
  }));
  
  const downtimeOptions = computed(() => ({
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: chartData.value.downtime.labels,
    colors: ["#1984c5", "#22a7f0", "#63bff0"]
  }));
  
  const predictiveAnalyticsOptions = computed(() => ({
    series: [
      {
        name: 'Predicted Maintenance',
        data: chartData.value.predictiveAnalytics.series
      }
    ],
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: chartData.value.predictiveAnalytics.categories
    },
    yaxis: {
      title: {
        text: 'Predicted Maintenance'
      }
    },
    colors: ['#22a7f0']
  }));
  
  const maintenanceCostSeries = computed(() => chartData.value.maintenanceCost.series);
  const assetPerformanceSeries = computed(() => chartData.value.assetPerformance.series);
  const downtimeSeries = computed(() => chartData.value.downtime.series);
  const predictiveAnalyticsSeries = computed(() => chartData.value.predictiveAnalytics.series);
  </script>
  