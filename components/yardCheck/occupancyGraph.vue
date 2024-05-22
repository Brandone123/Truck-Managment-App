<script setup lang="ts">
import { ref } from "vue";
import { computed } from "vue";
import { useTheme } from "vuetify";
import { useYardOccupancyStore } from '@/stores/yard_occupancy'
import moment from 'moment'

const theme = useTheme();
const selectedTimeFrame = ref("daily");

const yardOccupancyStore = useYardOccupancyStore()
const { occupancyData, loadingChartData } = storeToRefs(yardOccupancyStore)


onMounted(() => {
  yardOccupancyStore.yardOccupancyData(selectedTimeFrame.value);
})

function convertToAmericanFormat(date: string) {
  return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY');
}

const chartOptions = computed(() => {

  const categories = occupancyData.value.length > 0 ? occupancyData.value[0].dates?.map(date => convertToAmericanFormat(date)) : [];
  const series = occupancyData.value.map((yard) => ({
    name: yard.yardName,
    data: yard.occupancies,
  }));

  return {
    series: series,
    chartOptions: {
      colors: ["#1984c5", "#22a7f0", "#63bff0", "#a7d5ed", "#e2e2e2", "#e1a692", "#de6e56", "#e14b31", "#c23728"],
      grid: {
        borderColor: "rgba(0,0,0,0.1)",
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      // plotOptions: {
      //   bar: { horizontal: false, columnWidth: "35%", borderRadius: [8] },
      // },
      chart: {
        type: "bar",
        height: 370,
        offsetX: -15,
        toolbar: { show: true },
        foreColor: "#adb0bb",
        fontFamily: "inherit",
        sparkline: { enabled: false },
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      legend: { show: false },
      xaxis: {
        type: "category",
        categories: categories,
        labels: {
          style: { cssClass: "grey--text lighten-2--text fill-color" },
        },
      },
      yaxis: {
        show: true,
        // min: 0,
        // max: 50,
        labels: {
          style: {
            cssClass: "grey--text lighten-2--text fill-color",
          },
        },
      },
      stroke: {
        show: true,
        width: 3,
        lineCap: "butt",
        colors: ["transparent"],
      },
      tooltip: { theme: "light" },

      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 3,
              },
            },
          },
        },
      ],
    },
  };
});

watch(selectedTimeFrame, (newTimeFrame) => {
  yardOccupancyStore.yardOccupancyData(newTimeFrame);
});

</script>
<template>
  <div>
    <div>
      <v-card-title class="text-h5 font-weight-bold text-primary px-0 d-flex justify-space-between">
        <span> Yard Occupancy</span>
        <div class="my-sm-0 my-2">
          <div class="d-flex">
            <v-select :disabled="loadingChartData" v-model="selectedTimeFrame" :items="['daily', 'weekly', 'monthly']"
              variant="outlined" density="compact" hide-details></v-select>
          </div>
        </div>
      </v-card-title>
    </div>
    <v-card elevation="10" class="withbg">
      <v-card-text v-if="loadingChartData && occupancyData.length == 0" style="height:370px;">
        <div class="d-flex flex-column fill-height justify-center align-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
      </v-card-text>
      <v-card-text v-else>
        <client-only>
          <apexchart type="bar" height="370px" :options="chartOptions.chartOptions" :series="chartOptions.series">
          </apexchart>
        </client-only>
      </v-card-text>
    </v-card>
  </div>

</template>
