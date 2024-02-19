<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";
const theme = useTheme();
const primary = theme.current.value.colors.primary;
// const lightprimary = theme.current.value.colors.lightprimary;
const customColors = ["#FF6384", "#36A2EB", "#FFCE56", "#fcb900"];
const chartOptions = computed(() => {
  return {
    labels: ["series-1", "series-2", "series-3", "series-4"],
    chart: {
      type: "donut",
      fontFamily: `inherit`,
      foreColor: "#a1aab2",
      toolbar: {
        show: false,
      },
    },
    colors: customColors,
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "85%",
          background: "transparent",
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
      show: true,
    },
    tooltip: { theme: "light", fillSeriesColor: true },
  };
});
const Chart = [38, 40, 10, 40];
</script>
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="2">
        <v-card class="equal-height rounded-lg rounded-sm" flat>
          <h5 class="pt-3 pl-2">Arrivals</h5>
          <v-card-text class="text-h4 font-weight-bold text-a"
            >212<span class="text-grey">/</span>314</v-card-text
          >
          <div class="text-a text-grey">
            Driver Checkings Vs Expected Arrivals
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" lg="2">
        <v-card class="equal-height rounded-lg rounded-sm" flat>
          <h5 class="pt-3 pl-2">Departures</h5>
          <v-card-text class="text-h4 font-weight-bold text-a"
            >58 <span class="text-grey"> /</span> 176</v-card-text
          >
          <div class="text-a text-grey">
            Recorded Departures Vs Expected to Depart
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" lg="2">
        <v-card class="equal-height rounded-lg rounded-sm" flat>
          <h5 class="pt-3 pl-2">Turn Aways</h5>
          <v-card-text class="text-h4 font-weight-bold text-a">14</v-card-text>
          <div class="text-a text-grey">Shipments turned away at the gate</div>
        </v-card>
      </v-col>
      <v-col cols="12" lg="2">
        <v-card class="equal-height rounded-lg rounded-sm" flat>
          <h5 class="pt-3 pl-2">Wait Time At The Gate</h5>
          <v-card-text class="text-h4 font-weight-bold text-a"
            >12 m</v-card-text
          >
          <div class="text-a text-grey">Average waiting time at the gate</div>
        </v-card>
      </v-col>
      <v-col cols="12" lg="2">
        <v-card class="equal-height rounded-lg rounded-sm" flat>
          <h5 class="pt-3 pl-2">Carrier Performance</h5>
          <v-card-text class="text-h4 font-weight-bold text-a">97%</v-card-text>
          <div class="text-a text-grey">Percentage of on-time arrivals</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- second row -->
    <v-row justify="center">
      <v-col cols="12" lg="4">
        <v-row no-gutters>
          <v-col>
            <v-card height="200" class="my-2 rounded-lg rounded-sm" flat>
              <!-- test here pie chart on firt column in the card!!!!!!!!!!!!!!!!!!!!!!!!! -->
              <h5 class="pt-3 pl-2">In-Transit Shipments</h5>
              <!-- pie-chart here -->
              <div class="d-flex align-center flex-shrink-0 pt-4">
                <client-only>
                  <div class="chart-container">
                    <!-- Your ApexChart component here -->
                    <apexchart
                      type="donut"
                      height="130"
                      :options="chartOptions"
                      :series="Chart"
                    ></apexchart>
                    <div class="number-overlay">693</div>
                  </div>

                  <!-- <div class="chart-container">
                    <div class="number-overlay font-weight-bold">693</div>
                    <apexchart
                      type="donut"
                      height="130"
                      :options="chartOptions"
                      :series="Chart"
                    >
                    </apexchart>
                  </div> -->
                </client-only>
              </div>
            </v-card>
            <!-- test loads need attention -->

            <v-card height="200" class="my-2 rounded-lg rounded-sm" flat>
              <v-row>
                <v-col>
                  <v-card-title class="text-h6">
                    Loads that need attention</v-card-title
                  >
                  <h6 class="pl-4">
                    <v-icon icon="mdi-truck" size="40" color="primary">
                    </v-icon>
                    Awaiting Unloading(Inbound)
                  </h6>
                </v-col>
                <v-col class="pt-16 pr-8">
                  <v-card
                    class="bg-grey rounded-lg rounded-sm"
                    height="28"
                    flat
                  >
                    <h6 class="trailer pt-1">36 Trailers</h6>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="4">
        <v-row no-gutters>
          <v-col>
            <v-card height="120" class="my-2 rounded-lg rounded-sm" flat>
              <v-card-title> </v-card-title>
            </v-card>
            <v-card height="280" class="my-2 rounded-lg rounded-sm" flat>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="2">
        <v-row no-gutters>
          <v-col>
            <v-card class="my-2 rounded-lg rounded-sm" flat>
              <h5 class="pt-3 pl-2">Dock Door Capacity</h5>
              <v-card-text class="text-h4 font-weight-bold text-a"
                >74%</v-card-text
              >
              <div class="text-a text-grey">1150/167 Dock Spots Reserved</div>
            </v-card>
            <v-card class="my-2 rounded-lg rounded-sm" flat>
              <h5 class="pt-3 pl-2">Packing Spot Capacity</h5>
              <v-card-text class="text-h4 font-weight-bold text-a"
                >89%</v-card-text
              >
              <div class="text-a text-grey">764/780 Reserved Parking Spots</div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- row end -->
  </v-container>
</template>
<style>
.text-d {
  font-size: 0.3px;
}
.equal-height {
  height: 100%;
}
.text-s {
  font-size: 1px;
  padding-top: 1rem;
}
.text-a {
  text-align: center;
  font-size: 8px;
  padding-top: 20px;
  padding-bottom: 10px;
  /* text-decoration-thickness: 5px; */
  /* padding-bottom: 5px; */
}
.text-b {
  padding-bottom: 10px;
}

.tall-card {
  height: 300px;
}
.trailer {
  text-align: center;
}

.number-overlay {
  position: absolute;
  font-size: 24px; /* Adjust as necessary */
  z-index: 10;
  padding-right: 3.5em;
}
.chart-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
