<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Reports Analytics</span>
    </div>
    <v-row class="mt-10">
      <v-col cols="12" md="6">
        <v-card class="pa-3" outlined>
          <v-card-title>Applications Received</v-card-title>
          <v-card-text>
            <ApexChart type="bar" :options="chartOptions.applications" :series="getApplicationsSeries"></ApexChart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-3" outlined>
          <v-card-title>Interview Conversion Rate</v-card-title>
          <v-card-text>
            <ApexChart type="line" :options="chartOptions.conversionRate" :series="chartSeries.conversionRate"></ApexChart>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-3" outlined>
          <v-card-title>Job Board Performance</v-card-title>
          <v-card-text>
            <ApexChart type="pie" width="500" :options="chartOptions.boardPerformance" :series="chartSeries.boardPerformance"></ApexChart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import ApexChart from 'vue3-apexcharts';


const ApplicationStore = useApplicationStore();
const { applicationList } = storeToRefs(ApplicationStore);


const chartOptions = {
  applications: {
    chart: { id: 'applications-received' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
  },
  conversionRate: {
    chart: { id: 'interview-conversion-rate' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
  },
  boardPerformance: {
    chart: { id: 'board-performance' },
    labels: ['Online Job Boards', 'Social Media', 'Referrals', 'Others'],
  },
};

const getApplicationsSeries = computed(() => {
  const seriesData = Array(12).fill(0); // Initialiser toutes les valeurs à zéro
  applicationList.value.forEach((application) => {
    if(application.application_date){
      const dateParts = application.application_date.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      const day = parseInt(dateParts[2]);
      const date = new Date(year, month, day);
      const applicationMonth = date.getMonth();
      seriesData[applicationMonth]++;
    }
  });
  
  return [{
    name: 'Applications',
    data: seriesData,
  }];
});

const chartSeries = {
  conversionRate: [{
    name: 'Conversion Rate',
    data: [10, 15, 20, 25, 30, 20, 39, 41, 29, 48, 42, 50],
  }],
  boardPerformance: [44, 55, 41, 17],
};
</script>

<style scoped>
/* Add your styles here */
</style>