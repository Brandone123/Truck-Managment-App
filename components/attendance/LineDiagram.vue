<script setup lang="ts">
import { ref } from "vue";
import { computed } from "vue";
import { useTheme } from "vuetify";
const theme = useTheme();
const primary = theme.current.value.colors.primary;
const chartOptions = computed(() => {
  return {
    series: [
      {
        name: "Employee Absence",
        data: [ 87],
      },
    ],
    chartOptions: {
      grid: {
        borderColor: "rgba(0,0,0,0.1)",
        strokeDashArray: 7,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      plotOptions: {
        line: { markers: { size: 15, strokeWidth: 0, hover: { size: 12 } } },
      },
      colors: [primary],
      chart: {
        type: "line",
        height: 370,
        offsetX: -15,
        toolbar: { show: false },
        foreColor: "#adb0bb",
        fontFamily: "inherit",
        sparkline: { enabled: false },
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      legend: { show: false },
      xaxis: {
        type: "category",
        categories: [
          "Janvier 2023",
          
        ],
        labels: {
          style: { cssClass: "grey--text lighten-2--text fill-color" },
        },
      },
      yaxis: {
        show: true,
        min: -20,
        max: 100,
        tickAmount: 6,
        tickPositions: [-20, 0, 20, 40, 80, 100],
        },
      tooltip: { theme: "light" },

      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              line: {
                markers: {
                  size: 4,
                  strokeWidth: 0,
                  hover: { size: 6 },
                },
              },
            },
          },
        },
      ],
    },
  };
});
</script>
<template>
  <v-card  class="withbg">
    <v-card-item>
      <div class="d-sm-flex align-center justify-space-between pt-sm-2">
        <div>
            <v-card-title class="text-h5">Overall Attendance</v-card-title>
            <span>Last 6 months</span>
        </div>

      </div>
      <!-- <div >
        <client-only>
          <apexchart
            type="line"
            height="340px"
            :options="chartOptions.chartOptions"
            :series="chartOptions.series"
          >
          </apexchart>
        </client-only>
      </div> -->
    </v-card-item>
  </v-card>
</template>