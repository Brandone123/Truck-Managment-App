<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
    style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Service Schedules</span>
      <v-btn color="primary" @click="openCreateServiceScheduleDialog">Create Service Schedule</v-btn>
    </div>

    <ServiceScheduleDetailsDialog :modelValue="serviceScheduleDetailsDialog" :serviceSchedule="selectedServiceSchedule"
      @update:modelValue="serviceScheduleDetailsDialog = $event" @close="closeServiceScheduleDetailsDialog" />
    <ServiceScheduleEditDialog :modelValue="serviceScheduleEditDialog" :serviceSchedule="selectedServiceSchedule"
      @update:modelValue="serviceScheduleEditDialog = $event" @close="closeServiceScheduleEditDialog"
      @save="saveServiceSchedule" />

    <v-row class="mt-5">
      <v-col cols="12" md="3">
        <v-card class="card-1 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-calendar-check-outline</v-icon>
              <span>Scheduled</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6"> {{ serviceSchedulesSummary.total }}</span>
              <div>
                <span>Total Scheduled</span>
              </div>
            </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-2 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-calendar-clock</v-icon>
              <span>Upcoming</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6">{{ serviceSchedulesSummary.upcoming }}</span>
              <div>
                <span>Upcoming Services</span>
              </div>
            </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-3 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-alert-circle-outline</v-icon>
              <span>Overdue</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6"> {{ serviceSchedulesSummary.overdue }}</span>
              <div>
                <span>Overdue Services</span>
              </div>
            </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-4 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#a4d0ee">mdi-check-circle-outline</v-icon>
              <span>Completed</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6">{{ serviceSchedulesSummary.completed }}</span>
              <div>
                <span>Completed Services</span>
              </div>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ServiceScheduleList :serviceSchedules="computedServiceSchecules" :loading="loadingServiceSchedules"
          @view="viewServiceSchedule" @edit="editServiceSchedule" @delete="deleteServiceSchedule" />
      </v-col>
    </v-row>

    <v-row>
      <!-- Notifications and Alerts Section -->
      <v-col cols="12" md="5">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Notifications and Alerts</v-card-title>
        </div>
        <v-row>
          <v-col cols="12">
            <v-card class="px-0">
              <v-card-text>
                <v-alert density="compact" class="mb-2" dense type="info" v-for="alert in notifications"
                  :key="alert.id">
                  {{ alert.message }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div>
              <v-card-title class="text-h6 font-weight-bold text-primary px-0">Service Status
                Distribution</v-card-title>
            </div>
            <v-card>
              <v-card-text>
                <client-only>
                  <apexchart type="pie" height="350" :options="serviceStatusOptions" :series="serviceStatusSeries" />
                </client-only>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Reporting and Analytics Section -->

      <v-col cols="12" md="7">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Monthly Service Schedules</v-card-title>
        </div>
        <v-card class="">
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-text>
                  <client-only>
                    <apexchart type="line" height="350" :options="monthlyServiceScheduleOptions"
                      :series="monthlyServiceScheduleOptions.series" />
                  </client-only>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useServiceScheduleStore } from '@/stores/maintenance/serviceSchedule';
import ServiceScheduleList from '@/components/maintenance/preventiveManagement/serviceSchedule/ServiceScheduleList.vue';
import ServiceScheduleDetailsDialog from '@/components/maintenance/preventiveManagement/serviceSchedule/ServiceScheduleDetailsDialog.vue';
import ServiceScheduleEditDialog from '@/components/maintenance/preventiveManagement/serviceSchedule/ServiceScheduleEditDialog.vue';
import 'apexcharts/dist/apexcharts.css';
import type { ServiceSchedule } from '~/types/maintenance/serviceSchedule';

const serviceScheduleStore = useServiceScheduleStore();
//set initial data
serviceScheduleStore.setInitialData()

const assetStore = useAssetStore();
const serviceProgramStore = useServiceProgramStore();


onMounted(() => {
  assetStore.fetchAssets()
  serviceProgramStore.fetchServicePrograms()
  serviceScheduleStore.fetchServiceSchedules()
})

const { serviceSchedules, loading: loadingServiceSchedules, serviceSchedulesSummary, notifications, chartData } = storeToRefs(serviceScheduleStore);
const { servicePrograms} = storeToRefs(serviceProgramStore)
const {assetList} = storeToRefs(assetStore)

const serviceScheduleDetailsDialog = ref(false);
const serviceScheduleEditDialog = ref(false);
const selectedServiceSchedule = ref<Partial<ServiceSchedule>>({});


const computedServiceSchecules = computed(()=>{
  return serviceSchedules.value.map((serviceSchedule)=>{
    return {
      ...serviceSchedule,
      program: servicePrograms.value.find(program => program.id == serviceSchedule.program_id),
      vehicle: assetList.value.find((asset) => asset.id == serviceSchedule.vehicle_id)
    }
  })
})
const monthlyServiceScheduleOptions = computed(() => {
  return {
    series: [
      {
        name: 'Service Schedule Activity',
        data: chartData.value.monthly.series
      }
    ],
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: chartData.value.monthly.categories
    },
    yaxis: {
      title: {
        text: 'Activity'
      }
    },
    colors: ['#22a7f0']
  }
});

const serviceStatusOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
  },
  labels: chartData.value.serviceStatus.labels,
  colors: ["#1984c5", "#22a7f0", "#63bff0"]
}));

const serviceStatusSeries = computed(() => chartData.value.serviceStatus.series);

const openCreateServiceScheduleDialog = () => {
  selectedServiceSchedule.value = {};
  serviceScheduleEditDialog.value = true;
};

const viewServiceSchedule = (serviceSchedule: any) => {
  selectedServiceSchedule.value = serviceSchedule;
  serviceScheduleDetailsDialog.value = true;
};

const editServiceSchedule = (serviceSchedule: any) => {
  selectedServiceSchedule.value = serviceSchedule;
  serviceScheduleEditDialog.value = true;
};

const layoutStore = useLayoutStore()
const deleteServiceSchedule = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this service schedule ?")

  if (confirm) {
    await serviceScheduleStore.deleteServiceSchedule(id);
  }
};

const closeServiceScheduleDetailsDialog = () => {
  serviceScheduleDetailsDialog.value = false;
};

const closeServiceScheduleEditDialog = () => {
  serviceScheduleEditDialog.value = false;
};

const saveServiceSchedule = async (serviceSchedule: any) => {
  if (serviceSchedule.id) {
    await serviceScheduleStore.updateServiceSchedule(serviceSchedule);
  } else {
    await serviceScheduleStore.createServiceSchedule(serviceSchedule);
  }
  serviceScheduleEditDialog.value = false;
};

onMounted(() => {
  serviceScheduleStore.fetchServiceSchedules();
  serviceScheduleStore.fetchNotifications();
  serviceScheduleStore.fetchChartData();
});
</script>

<style scoped>
.card-1 {
  border-left: 8px solid #CE0053;
}

.card-2 {
  border-left: 8px solid #1867C0;
}

.card-3 {
  border-left: 8px solid #424656;
}

.card-4 {
  border-left: 8px solid #a4d0ee;
}
</style>