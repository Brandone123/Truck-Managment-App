<template>
   <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Lead Generation Stat</span>
    </div>
  <v-card class="pa-4" elevation="2">
    <v-row align="center" justify="space-between">
      <v-col cols="12" md="4">
        <v-card class="pa-3" outlined tile>
          <div class="text-subtitle-1">Total Leads</div>
          <div class="text-h5">{{ leadGenerationList.length }}</div>
        </v-card>

        <v-card class="pa-3 mt-4" outlined tile>
          <div class="text-subtitle-1">Conversions</div>
          <div class="text-h5">{{ conversions }}%</div>
        </v-card>
      </v-col>

      <!-- <v-col cols="12" md="2"> -->
        <ApexChart
          type="donut"
          :options="chartOptions"
          :series="chartSeries"
          width="320"
        />
      <!-- </v-col> -->
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ApexChart from 'vue3-apexcharts';

const leadListStore = useLeadGenerationStore()
const { leadGenerationList } = storeToRefs(leadListStore)

const conversions = ref(4); // Example data, percentage of leads converted

const chartOptions = ref({
  labels: ['Website', 'Social media', 'Event'],
  legend: {
    position: 'bottom',
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 150
      },
      legend: {
        position: 'top'
      }
    }
  }]
});

const chartSeries = ref([0, 0, 0]); // Initialize with zeros

function updateChart() {
  const leadTypes: {
    [key: string]: number;
  } = {
    'Website': 0,
    'Social media': 0,
    'Event': 0
  };
  const totalLeads = leadGenerationList.value.length;

  // Count the number of each lead type
  leadGenerationList.value.forEach(lead => {
    if (lead.lead_source && leadTypes.hasOwnProperty(lead.lead_source)) {
      leadTypes[lead.lead_source]++;
    }
  });

  // Calculate the percentage for each lead type
  const percentages = Object.values(leadTypes).map(count => (count / totalLeads) * 100);

  // Update chart data
  chartSeries.value = percentages;
}

updateChart(); // Initial chart update
</script>

<style scoped>
/* Add your component-specific styles here */
</style>