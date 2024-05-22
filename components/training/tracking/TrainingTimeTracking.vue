<template>
<div>
  <div class="d-flex flex-wrap justify-space-between">
      <span class="v-card-title px-0 font-weight-bold text-primary">Training Time Tracking</span>
    </div>
          <v-card>
            <v-card-text>

              <!-- ApexCharts Integration -->
              <apexchart
                  type="bar"
                  :options="chartOptions"
                  :series="chartSeries"
                  height="350"
                ></apexchart>        
            </v-card-text>
          </v-card>

          <v-card class="mt-4">
            <v-card-text>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-left">Employee/Driver</th>
                    <th class="text-left">Total Time Spent (hrs)</th>
                    <th class="text-left">Average Time per Module (hrs)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in timeTrackingData" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.totalTimeSpent }}</td>
                    <td>{{ item.averageTimePerModule }}</td>
                  </tr>
                </tbody>
              </v-table>   
            </v-card-text>
          </v-card>
        </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import VueApexCharts from 'vue3-apexcharts';
  
  const timeTrackingData = ref([
    { id: 1, name: 'John Doe', totalTimeSpent: 12, averageTimePerModule: 1.5 },
    { id: 2, name: 'Jane Smith', totalTimeSpent: 15, averageTimePerModule: 1.2 },
    // Additional data
  ]);
  
  const chartOptions = ref({
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '20%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: timeTrackingData.value.map(item => item.name),
    },
    yaxis: {
      title: {
        text: 'Hours'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " hours"
        }
      }
    }
  });
  
  const chartSeries = ref([
    {
      name: 'Total Time Spent',
      data: timeTrackingData.value.map(item => item.totalTimeSpent),
    },
    {
      name: 'Average Time per Module',
      data: timeTrackingData.value.map(item => item.averageTimePerModule),
    }
  ]);
  </script>
  