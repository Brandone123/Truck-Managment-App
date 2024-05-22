<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Reporting and Analytics</v-card-title>
            <v-card-text>
              <ApexChart
                type="bar"
                :options="chartOptions"
                :series="chartSeries"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import ApexChart from 'vue3-apexcharts';
  
  const chartOptions = ref({
    chart: {
      id: 'safety-compliance-report',
      type: 'bar',
      height: 350,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    plotOptions: {
      bar: {
        horizontal: false,
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
    yaxis: {
      title: {
        text: 'Incidents'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " incidents"
        }
      }
    }
  });
  
  const chartSeries = ref([
    {
      name: 'Reported Incidents',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 76, 85, 90]
    },
    {
      name: 'Resolved Incidents',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 55, 45, 60]
    }
  ]);
  </script>
  