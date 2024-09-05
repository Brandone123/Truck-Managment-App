<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
    style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Faults</span>
      <div>
        <v-menu location="start">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="outlined" color="primary" class="mr-3">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-list density="compact">
            <v-list-item @click="openImportDialog">
              <template v-slot:append>
                <v-icon>mdi-cloud-upload-outline</v-icon>
              </template>
              <v-list-item-title>
                Import
              </v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
              <template v-slot:append>
                <v-icon>mdi-cloud-download-outline</v-icon>
              </template>
              <v-list-item-title>
                Export
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn color="primary" @click="openCreateFaultDialog">Report Fault</v-btn>
      </div>
    </div>

    <FaultDetailsDialog :modelValue="faultDetailsDialog" :fault="selectedFault"
      @update:modelValue="faultDetailsDialog = $event" @close="closeFaultDetailsDialog" />
    <FaultEditDialog :modelValue="faultEditDialog" :fault="selectedFault" @update:modelValue="faultEditDialog = $event"
      @close="closeFaultEditDialog" @save="saveFault" />
    <FaultsUpload :modelValue="importDialog" @update:modelValue="importDialog = $event" />

    <v-row class="mt-5">
      <v-col cols="12" md="3">
        <v-card class="card-1 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-alert-circle-outline</v-icon>
              <span>Total Faults</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ faultSummary.total }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-2 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-progress-alert</v-icon>
              <span>Active Faults</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ faultSummary.active }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-3 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-check-circle-outline</v-icon>
              <span>Resolved Faults</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ faultSummary.resolved }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-4 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#a4d0ee">mdi-alert-decagram</v-icon>
              <span>Priority Faults</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ faultSummary.priority }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <FaultList :faults="faults" :loading="loadingFaults" @view="viewFault" @edit="editFault" @delete="deleteFault"
          @createIssue="convertToIssue" />
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
              <v-card-title class="text-h6 font-weight-bold text-primary px-0">Fault Status Distribution</v-card-title>
            </div>
            <v-card>
              <v-card-text>
                <client-only>
                  <apexchart type="pie" height="350" :options="faultStatusOptions" :series="faultStatusSeries" />
                </client-only>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Reporting and Analytics Section -->
      <v-col cols="12" md="7">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Monthly Fault Reports</v-card-title>
        </div>
        <v-card>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-text>
                  <client-only>
                    <apexchart type="line" height="350" :options="monthlyFaultsOptions"
                      :series="monthlyFaultsOptions.series" />
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
import { useFaultStore } from '@/stores/maintenance/fault';
import FaultList from '@/components/maintenance/issue/fault/FaultList.vue';
import FaultDetailsDialog from '@/components/maintenance/issue/fault/FaultDetailsDialog.vue';
import FaultEditDialog from '@/components/maintenance/issue/fault/FaultEditDialog.vue';
import FaultsUpload from '@/components/maintenance/issue/fault/FaultsUpload.vue'; // Import the FaultsUpload component
import 'apexcharts/dist/apexcharts.css';

const faultStore = useFaultStore();
faultStore.setInitialData()

const layoutStore = useLayoutStore()

const { faults, loading: loadingFaults, faultSummary, notifications, chartData } = storeToRefs(faultStore);

const faultDetailsDialog = ref(false);
const faultEditDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedFault = ref({
  id: null,
  dateReported: '',
  vehicleId: '',
  faultCode: '',
  description: '',
  priority: '',
  status: '',
  comments: [],
  activityLog: []
});

const monthlyFaultsOptions = computed(() => {
  return {
    series: [
      {
        name: 'Faults Reported',
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
        text: 'Number of Faults'
      }
    },
    colors: ['#22a7f0']
  }
});

const faultStatusOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
  },
  labels: chartData.value.faultStatus.labels,
  colors: ["#1984c5", "#22a7f0", "#63bff0"]
}));

const faultStatusSeries = computed(() => chartData.value.faultStatus.series);

const openCreateFaultDialog = () => {
  selectedFault.value = {
    id: null,
    dateReported: '',
    vehicleId: '',
    faultCode: '',
    description: '',
    priority: '',
    status: '',
    comments: [],
    activityLog: []
  };
  faultEditDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const viewFault = (fault: any) => {
  selectedFault.value = fault;
  faultDetailsDialog.value = true;
};

const editFault = (fault: any) => {
  selectedFault.value = fault;
  faultEditDialog.value = true;
};

const deleteFault = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this fault ?")

  if (confirm) {
    await faultStore.deleteFault(id);
  }
};

const convertToIssue = (fault: any) => {
  // Implement the convert to issue logic
};

const closeFaultDetailsDialog = () => {
  faultDetailsDialog.value = false;
};

const closeFaultEditDialog = () => {
  faultEditDialog.value = false;
};

const saveFault = async (fault: any) => {
  if (fault.id) {
    await faultStore.updateFault(fault);
  } else {
    await faultStore.createFault(fault);
  }
  faultEditDialog.value = false;
};

onMounted(() => {
  faultStore.fetchFaults();
  faultStore.fetchNotifications();
  faultStore.fetchChartData();
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
