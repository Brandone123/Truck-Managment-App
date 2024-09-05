<template>
    <v-col cols="12" sm="4"> 
        <div>
            <v-card height="400">
                <v-calendar></v-calendar>
            </v-card>
        </div>
    </v-col>

    <v-col cols="12" sm="8">
        <v-card height="330" style="overflow-y:auto;">
            <div class="d-flex">
                <div><v-card-title class="text-h7 font-weight-bold text-primary">Telematics</v-card-title></div>
            </div>

            <client-only>
                <apexchart type="line" height="250" :options="telematicChart.chartOptions" :series="telematicChart.chartSeries" />
            </client-only>
           
        </v-card>
    </v-col>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import 'apexcharts/dist/apexcharts.css';

  const telematicChart = computed(() => {
    return {
      chartOptions: {
        chart: {
          height: 250,
          type: 'line',
        },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeFormatter: {
              hour: 'HH:mm',
            },
          },
          tickAmount: 12,
          min: new Date('2024-06-17 05:00').getTime(),
          max: new Date('2024-06-17 12:00').getTime(),
        },
        yaxis: {
          min: 0,
          max: 50,
        },
      },
      chartSeries: [
        {
          name: 'Data',
          data: [
            [new Date('2024-06-17 05:00').getTime(), 10],
            [new Date('2024-06-17 05:30').getTime(), 25],
            [new Date('2024-06-17 06:00').getTime(), 20],
            [new Date('2024-06-17 06:30').getTime(), 25],
            [new Date('2024-06-17 07:00').getTime(), 15],
            [new Date('2024-06-17 07:30').getTime(), 30],
            [new Date('2024-06-17 08:00').getTime(), 25],
            [new Date('2024-06-17 08:30').getTime(), 33],
            [new Date('2024-06-17 09:00').getTime(), 35],
            [new Date('2024-06-17 09:30').getTime(), 32],
            [new Date('2024-06-17 10:00').getTime(), 10],
            [new Date('2024-06-17 10:30').getTime(), 40],
            [new Date('2024-06-17 11:00').getTime(), 38],
            [new Date('2024-06-17 11:30').getTime(), 45],
            [new Date('2024-06-17 12:00').getTime(), 42],
          ],
        },
      ],
    };
  })

</script>