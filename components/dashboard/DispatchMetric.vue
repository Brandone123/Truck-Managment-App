<template>
  <v-row>
    <v-col v-for="(metric, index) in dispatchMetrics" :key="index" cols="12" md="3">
      <v-card class="pa-2 text-center" elevation="2">
        <v-card-title class=" mb-2">
          <v-icon class="mr-1" color="primary">{{ metric.icon }}</v-icon>

          <span class="text-subtitle">{{ metric.name }}</span>

        </v-card-title>

        <v-card-text class="text-center" v-if="loadingScheduleLoad || loadingTruckList || loadingDriverList">
          <div class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
        </v-card-text>
        <v-card-text class="text-center" v-else>
          <div style="font-size: 20px;font-weight: bold;" class="mb-2">{{ metric.value }}</div>
          <div>{{ metric.description }}</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue';



interface DispatchMetric {
  name: string;
  value: string | number;
  description: string;
  icon: string;
}

const sheduleLoadStore = useScheduleLoadStore()
const { scheduleLoadList, loading: loadingScheduleLoad } = storeToRefs(sheduleLoadStore)

const truckStore = useTruckStore()
const { truckList, loading: loadingTruckList } = storeToRefs(truckStore)

const driverStore = useDriverStore()
const { driverList, loading: loadingDriverList } = storeToRefs(driverStore)

onMounted(() => {
  driverStore.fetchDriverList()
  truckStore.fetchTruckList()
  sheduleLoadStore.fetchAvailableLoadList()
})

const dispatchedLoad = computed(() => {
  return scheduleLoadList.value.filter(load => load.Status == 'Dispatched').length
})

const dispatchMetrics = computed<DispatchMetric[]>(() => [
  {
    name: 'Total Loads',
    value: scheduleLoadList.value.length,
    description: 'All the available Loads',
    icon: 'mdi-truck-fast-outline',
  },
  {
    name: 'Dispatched Loads',
    value: dispatchedLoad.value,
    description: 'Load already dispatched',
    icon: 'mdi-truck-delivery',
  },
  {
    name: 'Total Trucks',
    value: truckList.value.length,
    description: 'Number of available truck',
    icon: 'mdi-truck',
  },
  {
    name: 'Total Drivers',
    value: driverList.value.length,
    description: 'Number of all the drivers',
    icon: 'mdi-account',
  },
]);

</script>