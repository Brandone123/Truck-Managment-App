<template>
    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Campaign Perfomance</span>
    </div>
    <v-card class="pa-4" elevation="2">
      <ApexChart
        type="bar"
        :options="chartOptions"
        :series="chartSeries"
        height="373"
      />
    </v-card>
  </template>
  
<script lang="ts" setup>
  import { ref } from 'vue';
  import ApexChart from 'vue3-apexcharts';

  interface ChannelData {
    name: string;
    data: number[];
  }
  
  const chartSeries = ref([] as ChannelData[]);
  const currentYear = ref(new Date().getFullYear());

  const metricListStore = usePerformanceMetricStore()
  const {metricList} = storeToRefs(metricListStore)
  
  const chartOptions = ref({
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
      title: {
        text: 'Performance Metrics',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + ' interactions';
        },
      },
    },
  });

  const impressionTypes = ['Impressions', 'Clicks', 'Conversions'];

  function calculateMonthlyMetrics() {
    chartSeries.value = [];

    impressionTypes.forEach((type) => {
      const monthlyMetrics = {
        name: type,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Initial values for 12 months
      };

      metricList.value.forEach((metric) => {
        if (metric.date) {
          const dateParts = metric.date.split('-');
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1;
          const day = parseInt(dateParts[2]);
          const date = new Date(year, month, day);
          const metricYear = date.getFullYear();
          if (
            metricYear === currentYear.value &&
            metric.metric_value &&
            metric.metric_type === type
          ) {
            monthlyMetrics.data[month] += metric.metric_value;
          }
        }
      });

      chartSeries.value.push(monthlyMetrics);
    });
  }

watch(metricList, calculateMonthlyMetrics, { immediate: true });

</script>
  