<template>
  <div class="d-flex flex-wrap">
    <span class="v-card-title px-0 font-weight-bold text-primary">Shipment Statistics</span>
  </div>
  <v-card class="pa-4" elevation="2">
    <v-row class="justify-center">
      <div class="text-center" v-if="loadingScheduleLoad">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <div v-else>
        <ApexChart
          type="donut"
          :options="chartOptions"
          :series="chartSeries"
          class="w-full"
        />
      </div>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import ApexChart from 'vue3-apexcharts';

const sheduleLoadStore = useScheduleLoadStore();
const { scheduleLoadList, loading: loadingScheduleLoad } = storeToRefs(sheduleLoadStore);

const chartOptions = ref({
  labels: ['En Route', 'Dispatched', 'Booked', 'Reserved'],
  legend: {
    position: 'top',
  },
});

const chartSeries = computed(() => {
  const loadStatus: { [key: string]: number } = {
    enroute: 0,
    Dispatched: 0,
    Booked: 0,
    Reserved: 0,
  };
  const totalLoad = scheduleLoadList.value.length;

  // Count the number of each load status
  scheduleLoadList.value.forEach((load) => {
    if (load.Status && loadStatus.hasOwnProperty(load.Status)) {
      loadStatus[load.Status]++;
    }
  });

  // Calculate the percentage for each load status
  const percentages = Object.values(loadStatus).map((count) => (count / totalLoad) * 100);

  return percentages;
});

onMounted(() => {
  sheduleLoadStore.fetchAvailableLoadList();
});
</script>