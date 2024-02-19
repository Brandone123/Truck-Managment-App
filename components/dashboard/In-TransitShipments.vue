<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";
const theme = useTheme();
const primary = theme.current.value.colors.primary;
const lightprimary = theme.current.value.colors.lightprimary;
const chartOptions = computed(() => {
  return {
    labels: ["series-1", "series-2", "series-3"],
    chart: {
      type: "donut",
      fontFamily: `inherit`,
      foreColor: "#a1aab2",
      toolbar: {
        show: false,
      },
    },
    colors: [primary, '#E57373', "#00ACC1",'#C62828'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
          labels: {
            show: true,
            name: {show: true},
            value:{show: true,offsetY: 693},
            total: {show: true, label: '693',fontSize: '30',color: '#000000'}
          }
        },
      },
    },
    stroke: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: { theme: "light", fillSeriesColor: false },
  };
});
const Chart = [20, 30, 25,10];
</script>
<template>
  <v-card elevation="10" class="withbg">
    <v-card-item>
      <div class="d-sm-flex align-center justify-space-between pt-sm-2">
        <v-card-title class="text-h5">In-Transit Shipments</v-card-title>
      </div>
      <v-row>
        <v-col cols="5" sm="5" class="pl-lg-0">
          <div class="d-flex align-center flex-shrink-0">
            <client-only>
              <apexchart class="pt-6" type="donut" height="170" :options="chartOptions" :series="Chart">
              </apexchart>
            </client-only>
          </div>
        </v-col>
        <v-col cols="5" sm="2">
          <div class="mt-6">
            <!-- <div class="mt-1">
              <v-avatar class="bg-lightsuccess text-success" size="25">
                693
              </v-avatar>
            </div> -->
            <div class="d-flex align-center mt-sm-10 mt-8">
              <h6 class="text-subtitle-1 text-muted">
                <v-icon icon="mdi mdi-checkbox-blank-circle" class="mr-1" size="10" color="primary"></v-icon>
                <span class="font-weight-bold">293</span><br><span class="text-grey">Very Late</span>
              </h6>
              </div>
              <div class="d-flex align-center mt-sm-10 mt-8">
              <h6 class="text-subtitle-1 text-muted ">
                <v-icon icon="mdi mdi-checkbox-blank-circle" class="mr-1" size="10" color="#E57373"></v-icon>
                
                <span class="font-weight-bold">293</span><br><span class="text-grey">On Time</span>
              </h6>
              </div>
              </div>
            </v-col>
            <v-col cols="5" sm="2">
              <div>
                <div class="d-flex align-center mt-sm-10 mt-8">
              <h6 class="text-subtitle-1 text-muted pl-5">
                <v-icon icon="mdi mdi-checkbox-blank-circle" class="mr-1" size="10" color="#00ACC1"></v-icon>
                
                <span class="font-weight-bold">293</span><br><span class="text-grey">Late</span>
              </h6>
              </div>
              <div class="d-flex align-center mt-sm-10 mt-8">
              <h6 class="text-subtitle-1 text-muted pl-5">
                <v-icon icon="mdi mdi-checkbox-blank-circle" class="mr-1" size="10" color="#C62828"></v-icon>
                
                <span class="font-weight-bold">293</span><br><span class="text-grey">Early</span>
              </h6>
            </div>
          </div>
        </v-col>

      </v-row>
    </v-card-item>
  </v-card>
</template>
