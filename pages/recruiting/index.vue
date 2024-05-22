<template>
  <v-row>
    <v-col cols="12" md="12">
      <QuickActionPanel />
    </v-col>
    
    <v-col cols="12" md="12">
      <JobPostingList />
    </v-col>
    <v-col cols="12" md="12">
      <ApplicationOverview />
    </v-col>
    <v-col cols="12" md="6">
      <div class="d-flex flex-wrap">
        <span class="v-card-title px-0 font-weight-bold text-primary">Applications Received</span>
      </div>
      <v-card>
        <v-card-text>
          <ApexChart type="bar" :options="chartOptions.applications" :series="getApplicationsSeries"></ApexChart>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <RecentActivities />
    </v-col>
   
  </v-row>
</template>

<script setup lang="ts">
// Import components
import DashboardHeader from '@/components/recruiting/home/DashboardHeader.vue';
import JobPostingList from '@/components/recruiting/home/JobPostingList.vue';
import ApplicationOverview from '@/components/recruiting/home/ApplicationOverview.vue';
import RecentActivities from '@/components/recruiting/home/RecentActivities.vue';
import QuickActionPanel from '@/components/recruiting/home/QuickActionPanel.vue';
import { ref, computed } from 'vue';
import ApexChart from 'vue3-apexcharts';

const ApplicationStore = useApplicationStore();
const { applicationList } = storeToRefs(ApplicationStore);

const chartOptions = {
  applications: {
    chart: { id: 'applications-received' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
  },
}

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
</script>
