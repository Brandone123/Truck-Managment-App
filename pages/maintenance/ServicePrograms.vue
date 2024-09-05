<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Service Programs</span>
      <v-btn color="primary" @click="openCreateServiceProgramDialog">Create Service Program</v-btn>
    </div>

    <ServiceProgramDetailsDialog :modelValue="serviceProgramDetailsDialog"
      :serviceProgram="(selectedServiceProgram as ServiceProgram)"
      @update:modelValue="serviceProgramDetailsDialog = $event" @close="closeServiceProgramDetailsDialog" />
    <ServiceProgramEditDialog :modelValue="serviceProgramEditDialog" :serviceProgram="selectedServiceProgram"
      @update:modelValue="serviceProgramEditDialog = $event" @close="closeServiceProgramEditDialog"
      @save="saveServiceProgram" />

    <v-row class="mt-5">
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-format-list-bulleted</v-icon>
              <span>Total Service Programs</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6"> {{ serviceProgramsSummary.total }}</span>
            </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-car-wash</v-icon>
              <span>Active Subscriptions</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6">{{ serviceProgramsSummary.activeSubscriptions }}</span>
            </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-calendar-clock</v-icon>
              <span>Upcoming Services</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6"> {{ serviceProgramsSummary.upcomingServices }}</span>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ServiceProgramList :servicePrograms="servicePrograms" :loading="loadingServicePrograms"
          @view="viewServiceProgram" @edit="editServiceProgram" @delete="deleteServiceProgram" />
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
              <v-card-title class="text-h6 font-weight-bold text-primary px-0">Subscription Status
                Distribution</v-card-title>
            </div>
            <v-card>
              <v-card-text>
                <client-only>
                  <apexchart type="pie" height="350" :options="subscriptionStatusOptions"
                    :series="subscriptionStatusSeries" />
                </client-only>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Reporting and Analytics Section -->

      <v-col cols="12" md="7">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Monthly Service Program
            Activity</v-card-title>
        </div>
        <v-card class="">
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-text>
                  <client-only>
                    <apexchart type="line" height="350" :options="monthlyServiceProgramOptions"
                      :series="monthlyServiceProgramOptions.series" />
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
import { useServiceProgramStore } from '@/stores/maintenance/ServiceProgram';
import ServiceProgramList from '@/components/maintenance/preventiveManagement/serviceProgram/ServiceProgramList.vue';
import ServiceProgramDetailsDialog from '@/components/maintenance/preventiveManagement/serviceProgram/ServiceProgramDetailsDialog.vue';
import ServiceProgramEditDialog from '@/components/maintenance/preventiveManagement/serviceProgram/ServiceProgramEditDialog.vue';
import 'apexcharts/dist/apexcharts.css';
import type { ServiceProgram, ServiceTask } from '~/types/maintenance/ServiceProgram';


const serviceProgramStore = useServiceProgramStore();
//set initial data
serviceProgramStore.setInitialData()

const assetStore = useAssetStore();
const serviceTaskStore = useServiceTaskStore()

onMounted(() => {
  assetStore.fetchAssets()
  serviceTaskStore.fetchServiceTasks()
  serviceProgramStore.fetchServicePrograms()
  serviceProgramStore.fetchNotifications();
  serviceProgramStore.fetchChartData();
})

const { servicePrograms, loading: loadingServicePrograms, serviceProgramsSummary, notifications, chartData } = storeToRefs(serviceProgramStore);

const serviceProgramDetailsDialog = ref(false);
const serviceProgramEditDialog = ref(false);
const selectedServiceProgram = ref<Partial<ServiceProgram>>({ primary_meter_utilization: 'miles', subscribed_tasks: [], subscribed_vehicles: [] });

const monthlyServiceProgramOptions = computed(() => {
  return {
    series: [
      {
        name: 'Service Program Activity',
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

const subscriptionStatusOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
  },
  labels: chartData.value.subscriptionStatus.labels,
  colors: ["#1984c5", "#22a7f0", "#63bff0"]
}));

const subscriptionStatusSeries = computed(() => chartData.value.subscriptionStatus.series);

const openCreateServiceProgramDialog = () => {
  selectedServiceProgram.value = { primary_meter_utilization: 'miles', subscribed_tasks: [], subscribed_vehicles: [] }
  serviceProgramEditDialog.value = true;
};

const viewServiceProgram = (serviceProgram: any) => {
  selectedServiceProgram.value = serviceProgram;
  serviceProgramDetailsDialog.value = true;
};

const editServiceProgram = (serviceProgram: any) => {
  selectedServiceProgram.value = JSON.parse(JSON.stringify(serviceProgram));
  serviceProgramEditDialog.value = true;
};

const layoutStore = useLayoutStore()
const deleteServiceProgram = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this service program ?")

  if (confirm) {
    await serviceProgramStore.deleteServiceProgram(id);
  }
};

const closeServiceProgramDetailsDialog = () => {
  serviceProgramDetailsDialog.value = false;
};

const closeServiceProgramEditDialog = () => {
  serviceProgramEditDialog.value = false;
};

const saveServiceProgram = async (serviceProgram: any) => {
  if (serviceProgram.id) {
    await serviceProgramStore.updateServiceProgram(serviceProgram);
  } else {
    await serviceProgramStore.createServiceProgram(serviceProgram);
  }
  serviceProgramEditDialog.value = false;
};
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
</style>