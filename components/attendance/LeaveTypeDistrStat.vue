<template>
    <v-card class="withbg">
      <v-card-item>
        <div class="d-sm-flex align-center justify-space-between pt-sm-2">
          <div>
            <v-card-title class="text-h5 pb-2">Leave Type Distribution</v-card-title>
          </div>
        </div>
        <div>
          <client-only>
            <apexchart
              type="donut"
              height="300px"
              :options="chartOptions.chartOptions"
              :series="Chart"
            ></apexchart>
          </client-only>
          
        </div>
      </v-card-item>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { computed } from "vue";
  import { useTheme } from "vuetify";

  const Chart = [ 0.73, 0.1,  0.08, 0.04, 0.02];
  
  const chartOptions = computed(() => {
    const theme = useTheme();
    const primary = theme.current.value.colors.primary;
  
    return {
      chartOptions: {
        colors: ["#3f51b5", "#f44336", "#ff9800", "#8bc34a", "#9e9e9e"],
        chart: {
          type: "donut",
          height: 300,
          foreColor: "#adb0bb",
          fontFamily: "inherit",
          toolbar: {
                show: false,
            },
        },
        labels: ["Available", "Sick Leave", "On Break", "Casual Leave", "Early Login"],
        legend: {
            show: true,
            position: "top",
        },
        tooltip: { theme: "light", fillSeriesColor: true },
      },
    };
  });
  
  // Méthode pour obtenir la couleur correspondante à chaque catégorie
  const getColor = (index: number) => {
    const colors = ["#3f51b5", "#f44336", "#ff9800", "#8bc34a", "#9e9e9e"];
    return colors[index % colors.length];
  };
  </script>
  
  <style scoped>
  .legend {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  
  .color-box {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  </style>