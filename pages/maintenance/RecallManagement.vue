<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
    style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Recalls</span>
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
        <v-btn color="primary" @click="openCreateRecallDialog">Create Recalls</v-btn>
      </div>
    </div>

    <RecallDetailsDialog :modelValue="recallDetailsDialog" :recall="selectedRecall"
      @update:modelValue="recallDetailsDialog = $event" @close="closeRecallDetailsDialog" />
    <RecallEditDialog :modelValue="recallEditDialog" :recall="selectedRecall"
      @update:modelValue="recallEditDialog = $event" @close="closeRecallEditDialog" @save="saveRecall" />
    <RecallUpload :modelValue="importDialog" @update:modelValue="importDialog = $event" />

    <v-row class="mt-5">
      <v-col cols="12" md="3">
        <v-card class="card-1 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-alert-circle-outline</v-icon>
              <span>Total Recalls</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ recallSummary.total }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-2 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-progress-alert</v-icon>
              <span>Active Recalls</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ recallSummary.active }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-3 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-check-circle-outline</v-icon>
              <span>Resolved Recalls</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ recallSummary.resolved }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-4 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#a4d0ee">mdi-timer-sand</v-icon>
              <span>Average Resolution Time</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ recallSummary.averageResolutionTime }} days</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <RecallList :recalls="recalls" :loading="loadingRecalls" @view="viewRecall" @edit="editRecall"
          @delete="deleteRecall" @createIssue="convertToIssue" />
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
              <v-card-title class="text-h6 font-weight-bold text-primary px-0">Recall Status Distribution</v-card-title>
            </div>
            <v-card>
              <v-card-text>
                <client-only>
                  <apexchart type="pie" height="350" :options="recallStatusOptions" :series="recallStatusSeries" />
                </client-only>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Reporting and Analytics Section -->
      <v-col cols="12" md="7">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Monthly Recall Reports</v-card-title>
        </div>
        <v-card>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-text>
                  <client-only>
                    <apexchart type="line" height="350" :options="monthlyRecallsOptions"
                      :series="monthlyRecallsOptions.series" />
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
import { useRecallStore } from '@/stores/maintenance/recall';
import RecallList from '@/components/maintenance/issue/recall/RecallList.vue';
import RecallDetailsDialog from '@/components/maintenance/issue/recall/RecallDetailsDialog.vue';
import RecallEditDialog from '@/components/maintenance/issue/recall/RecallEditDialog.vue';
import RecallUpload from '@/components/maintenance/issue/recall/RecallUpload.vue'; // Import the RecallUpload component
import 'apexcharts/dist/apexcharts.css';

const recallStore = useRecallStore();
recallStore.setInitialData()

const assetStore = useAssetStore();

const { recalls, loading: loadingRecalls, recallSummary, notifications, chartData } = storeToRefs(recallStore);

const recallDetailsDialog = ref(false);
const recallEditDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedRecall = ref({
  id: null,
  dateImported: '',
  vehicleYear: '',
  vehicleMake: '',
  vehicleModel: '',
  recallDescription: '',
  status: '',
  comments: [],
  activityLog: []
});

const monthlyRecallsOptions = computed(() => {
  return {
    series: [
      {
        name: 'Recalls Reported',
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
        text: 'Number of Recalls'
      }
    },
    colors: ['#22a7f0']
  }
});

const recallStatusOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
  },
  labels: chartData.value.recallStatus.labels,
  colors: ["#1984c5", "#22a7f0", "#63bff0"]
}));

const recallStatusSeries = computed(() => chartData.value.recallStatus.series);

const openCreateRecallDialog = () => {
  selectedRecall.value = {
    id: null,
    dateImported: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    recallDescription: '',
    status: '',
    comments: [],
    activityLog: []
  };
  recallEditDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const viewRecall = (recall: any) => {
  selectedRecall.value = recall;
  recallDetailsDialog.value = true;
};

const editRecall = (recall: any) => {
  selectedRecall.value = recall;
  recallEditDialog.value = true;
};

const layoutStore = useLayoutStore()
const deleteRecall = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this recall ?")

  if (confirm) {
    await recallStore.deleteRecall(id);
  }
};

const convertToIssue = (recall: any) => {
  // Implement the convert to issue logic
};

const closeRecallDetailsDialog = () => {
  recallDetailsDialog.value = false;
};

const closeRecallEditDialog = () => {
  recallEditDialog.value = false;
};

const saveRecall = async (recall: any) => {
  if (recall.id) {
    await recallStore.updateRecall(recall);
  } else {
    await recallStore.createRecall(recall);
  }
  recallEditDialog.value = false;
};

onMounted(() => {
  assetStore.fetchAssets();
  recallStore.fetchRecalls();
  recallStore.fetchNotifications();
  recallStore.fetchChartData();
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
