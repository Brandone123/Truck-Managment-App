<template>
        <v-card>
          <v-card-title>
            Employee Attendance Statistics
          </v-card-title>
          <v-card-text>
            <apexchart
            type="bar"
            height="360px"
            :options="chartOptions"
            :series="chartOptions.series"
            :data="chartData"
            >
            </apexchart>
          </v-card-text>
        </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useTheme } from 'vuetify';
  
  const theme = useTheme();
  const primary = theme.current.value.colors.primary;
  
  const employeeStatuses = ref([
    {
      id: 1,
      name: 'John Doe',
      attendance: 75,
    },
    {
      id: 2,
      name: 'Jane Smith',
      attendance: 65,
    },
    {
      id: 3,
      name: 'Wasim Jaffer',
      attendance: 80,
    },
    {
      id: 4,
      name: 'Pan Hibsen',
      attendance: 93,
    },
    {
      id: 5,
      name: 'Yoshi Nagase',
      attendance: 78,
    },
  ]);
  
  const chartData = ref(
    employeeStatuses.value.map((employee) => ({
      name: employee.name,
      percentage: employee.attendance,
    }))
  );
  const customColors = ["#FF6384", "#36A2EB", "#5873fd", "#D48974", "#764549"];
  
  const chartOptions = ref({
    colors: customColors,
    series: [
      {
        data: chartData.value.map((item) => item.percentage),
        name: "Attendance Percentage"
      },
    ],
    chart: {
      type: 'bar',
      height: 400,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ['#000'],
      },
    },
    xaxis: {
      categories: chartData.value.map((item) => item.name),
      labels: {
        style: {
          cssClass: 'grey--text lighten-2--text fill-color',
        },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max: 100,
      tickAmount: 6,
      tickPositions: [0, 20, 40, 60, 80, 100],
    },
    tooltip: {
      theme: 'light',
    },
  });
  </script>