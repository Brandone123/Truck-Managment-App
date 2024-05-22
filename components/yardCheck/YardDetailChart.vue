<script setup lang="ts">
import { ref } from "vue";
import { computed } from "vue";
import { useTheme } from "vuetify";
import { useYardOccupancyStore } from '@/stores/yard_occupancy'

const props = defineProps({
  yardID: {
    type: Number,
    required: true
  },
});

const theme = useTheme();
const selectedTimeFrame = ref("daily");

const yardOccupancyStore = useYardOccupancyStore();
const { EntryExitFrequency, loadingDwellTime } = storeToRefs(yardOccupancyStore)

const YardDetailStore = useYardStore()
const { current, capacity, loadingOccupancyReport } = storeToRefs(YardDetailStore)

onMounted(() => {
  yardOccupancyStore.getEntryExitFrenquency(props.yardID, selectedTimeFrame.value);
  YardDetailStore.getYardOccupancyReport(props.yardID);
})

const donutOptions = computed(() => {

  return {
    series: [current.value, capacity.value - current.value],
    chartOptions: {
      colors: ["#1984c5", "#22a7f0"],
      chart: {
        type: 'donut',
        height: 370,
        toolbar: { show: true },
        foreColor: '#adb0bb',
        fontFamily: 'inherit',
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      legend: { show: true, position: 'top' },
      tooltip: { theme: 'light' },
      labels: ['Occupied', 'Available'],
    },
  };
});


const chartOptions = computed(() => {

  const entries = [];
  const exits = [];
  const categories = [];

  // Parcours des données d'entrée et de sortie
  for (const date in EntryExitFrequency.value) {
    const entryData = EntryExitFrequency.value[date].entries;
    const exitData = EntryExitFrequency.value[date].exits;

    // Ajout des valeurs dans les tableaux correspondants
    entries.push(entryData);
    exits.push(exitData);
    categories.push(date);
  }

  return {
    series: [
      {
        name: "Entries",
        data: entries,
      },
      {
        name: "Exits",
        data: exits,
      },
    ],
    chartOptions: {
      colors: ["#1984c5", "#22a7f0"],
      grid: {
        borderColor: "rgba(0,0,0,0.1)",

        xaxis: {
          lines: {
            show: true,
          },
        },
      },
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
      legend: { show: true, position: 'top' },
      xaxis: {
        type: "category",
        categories: categories,
        labels: {
          style: { cssClass: "grey--text lighten-2--text fill-color" },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: 50,
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
  yardOccupancyStore.getEntryExitFrenquency(props.yardID, newTimeFrame);
});


</script>
<template>
  <v-row>
    <v-col cols="12" md="6">
      <div><v-card-title class="text-h5 px-0 font-weight-bold text-primary">Entry/Exit Frequency Chart</v-card-title>
      </div>
      <v-card class="withbg">
        <v-card-item>
          <div class="align-center justify-space-between pt-sm-2">

            <div class="my-sm-0">
              <div class="d-flex">
                <div>
                  <v-select v-model="selectedTimeFrame" :items="['daily', 'weekly', 'monthly']" variant="outlined"
                    density="compact" hide-details></v-select>
                </div>
                <v-progress-circular v-if="loadingDwellTime" indeterminate color="primary" class="ml-2">
                </v-progress-circular>
              </div>
            </div>
          </div>
          <div>
            <client-only>
              <apexchart type="bar" height="370px" :options="chartOptions.chartOptions" :series="chartOptions.series">
              </apexchart>
            </client-only>
          </div>
        </v-card-item>
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-card-title class="text-h5 px-0 font-weight-bold text-primary">Real-Time Occupancy Chart</v-card-title>
      <v-card class="withbg">
        <v-card-item>
          <div class="d-sm-flex align-center justify-space-between pt-sm-2">

            <div class="my-sm-0 my-2">
              <div class="d-flex">
                <v-progress-circular v-if="loadingOccupancyReport" indeterminate color="primary" class="mr-2">
                </v-progress-circular>
              </div>
            </div>
          </div>
          <div class="mt-12">
            <client-only>
              <apexchart type="donut" height="370px" :options="donutOptions.chartOptions" :series="donutOptions.series">
              </apexchart>
            </client-only>
          </div>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>
