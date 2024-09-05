<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
    style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Item Failures</span>
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
        <v-btn color="primary" @click="openCreateFailureDialog">Report Failure</v-btn>
      </div>
    </div>

    <FailureDetailsDialog :modelValue="failureDetailsDialog" :failure="selectedFailure" @save="saveFailure"
      @update:modelValue="failureDetailsDialog = $event" @close="closeFailureDetailsDialog" />
    <FailureEditDialog :modelValue="failureEditDialog" :failure="selectedFailure"
      @update:modelValue="failureEditDialog = $event" @close="closeFailureEditDialog" @save="saveFailure" />
    <FailuresUpload :modelValue="importDialog" @update:modelValue="importDialog = $event" />

    <v-row class="mt-5">
      <v-col cols="12" md="3">
        <v-card class="card-1 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-alert-circle-outline</v-icon>
              <span>Failures</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ failureSummary.total }}</span>
              <div>
                <span>Total Failures</span>
              </div>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-2 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-progress-alert</v-icon>
              <span>Pending</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ failureSummary.pending }}</span>
              <div>
                <span>Pending Failures</span>
              </div>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-3 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-check-circle-outline</v-icon>
              <span>Resolved</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ failureSummary.resolved }}</span>
              <div>
                <span>Resolved Failures</span>
              </div>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-4 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#a4d0ee">mdi-percent</v-icon>
              <span>Conversion</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ failureSummary.conversionRate }}%</span>
              <div>
                <span>Conversion Rate</span>
              </div>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <FailureList :failures="failures" :loading="loadingFailures" @view="viewFailure" @edit="editFailure"
          @delete="deleteFailure" @convert="convertToIssue" />
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
              <v-card-title class="text-h6 font-weight-bold text-primary px-0">Failure Status
                Distribution</v-card-title>
            </div>
            <v-card>
              <v-card-text>
                <client-only>
                  <apexchart type="pie" height="350" :options="failureStatusOptions" :series="failureStatusSeries" />
                </client-only>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Reporting and Analytics Section -->
      <v-col cols="12" md="7">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Monthly Failure Reports</v-card-title>
        </div>
        <v-card>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-text>
                  <client-only>
                    <apexchart type="line" height="350" :options="monthlyFailuresOptions"
                      :series="monthlyFailuresOptions.series" />
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
import { useFailureStore } from '@/stores/maintenance/failure';
import FailureList from '@/components/maintenance/issue/failure/FailureList.vue';
import FailureDetailsDialog from '@/components/maintenance/issue/failure/FailureDetailsDialog.vue';
import FailureEditDialog from '@/components/maintenance/issue/failure/FailureEditDialog.vue';
import FailuresUpload from '@/components/maintenance/issue/failure/FailuresUpload.vue'; // Import the FailuresUpload component
import 'apexcharts/dist/apexcharts.css';
import type { Failure } from '@/types/maintenance/failure';

const failureStore = useFailureStore();
failureStore.setInitialData()

const layoutStore = useLayoutStore()

const { failures, loading: loadingFailures, failureSummary, notifications, chartData } = storeToRefs(failureStore);

const failureDetailsDialog = ref(false);
const failureEditDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedFailure = ref<Partial<Failure>>({} as Partial<Failure>);

const monthlyFailuresOptions = computed(() => {
  return {
    series: [
      {
        name: 'Failures Reported',
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
        text: 'Number of Failures'
      }
    },
    colors: ['#22a7f0']
  }
});

const failureStatusOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
  },
  labels: chartData.value.failureStatus.labels,
  colors: ["#1984c5", "#22a7f0", "#63bff0"]
}));

const failureStatusSeries = computed(() => chartData.value.failureStatus.series);

const openCreateFailureDialog = () => {
  selectedFailure.value = {} as Partial<Failure>;
  failureEditDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const viewFailure = (failure: any) => {
  selectedFailure.value = failure;
  failureDetailsDialog.value = true;
};

const editFailure = (failure: any) => {
  selectedFailure.value = failure;
  failureEditDialog.value = true;
};

const deleteFailure = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this failure ?")

  if (confirm) {
    await failureStore.deleteFailure(id);
  }
};


const convertToIssue = (failure: any) => {
  // Implement the convert to issue logic
};

const closeFailureDetailsDialog = () => {
  failureDetailsDialog.value = false;
};

const closeFailureEditDialog = () => {
  failureEditDialog.value = false;
};

const saveFailure = async (failure: any) => {
  if (failure.id) {
    await failureStore.updateFailure(failure);
  } else {
    await failureStore.createFailure(failure);
  }
  failureEditDialog.value = false;
};

onMounted(() => {
  failureStore.fetchFailures();
  failureStore.fetchNotifications();
  failureStore.fetchChartData();
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
