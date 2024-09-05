<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
    style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Inspections</span>
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
      <v-btn color="primary" @click="openCreateInspectionDialog">Create Inspection</v-btn>
      </div>
    </div>

    <InspectionDetailsDialog :modelValue="inspectionDetailsDialog" :inspection="(selectedInspection as Inspection)"
      @update:modelValue="inspectionDetailsDialog = $event" @close="closeInspectionDetailsDialog" />
    <InspectionEditDialog :modelValue="inspectionEditDialog" :inspection="selectedInspection"
      @update:modelValue="inspectionEditDialog = $event" @close="closeInspectionEditDialog" @save="saveInspection" />
    <InspectionImportDialog
      :modelValue="importDialog"
      @update:modelValue="importDialog = $event"
      @imported="handleImported"
    />

    <v-row class="mt-5">
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2"  color="#424656">mdi-clipboard-check-outline</v-icon>
              <span>Inspections</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6">{{ inspectionsSummary.total }}</span>
              <div>
                <span>Total Inspections</span>
              </div>
            </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-check-circle-outline</v-icon>
              <span>Passed</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6">{{ inspectionsSummary.passed }}</span>
              <div>
                <span>Passed Inspections</span>
              </div>
            </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-close-circle-outline</v-icon>
              <span>Failed</span>
            </v-card-title>

            <v-card-text>
              <span class="font-weight-bold text-h6">{{ inspectionsSummary.failed }}</span>
              <div>
                <span>Failed Inspections</span>
              </div>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <InspectionList
          :inspections="inspections"
          :loading="loadingInspections"
          @view="viewInspection"
          @edit="editInspection"
          @delete="deleteInspection"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="5">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Notifications and Alerts</v-card-title>
        </div>
        <v-row>
          <v-col cols="12">
            <v-card class="px-0">
              <v-card-text>
                <v-alert
                  density="compact"
                  class="mb-2"
                  dense
                  type="info"
                  v-for="alert in notifications"
                  :key="alert.id"
                >
                  {{ alert.message }}
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div>
              <v-card-title class="text-h6 font-weight-bold text-primary px-0">Inspection Status Distribution</v-card-title>
            </div>
            <v-card>
              <v-card-text>
                <client-only>
                  <apexchart
                    type="pie"
                    height="350"
                    :options="inspectionStatusOptions"
                    :series="inspectionStatusSeries"
                  />
                </client-only>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="7">
        <div>
          <v-card-title class="text-h6 font-weight-bold text-primary px-0">Monthly Inspection Totals</v-card-title>
        </div>
        <v-card class="">
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-text>
                  <client-only>
                    <apexchart
                      type="line"
                      height="350"
                      :options="monthlyInspectionOptions"
                      :series="monthlyInspectionOptions.series"
                    />
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
import { useInspectionStore } from '@/stores/maintenance/inspection';
import InspectionList from '@/components/maintenance/preventiveManagement/inspection/InspectionList.vue';
import InspectionDetailsDialog from '@/components/maintenance/preventiveManagement/inspection/InspectionDetailsDialog.vue';
import InspectionEditDialog from '@/components/maintenance/preventiveManagement/inspection/InspectionEditDialog.vue';
import InspectionImportDialog from '@/components/maintenance/preventiveManagement/inspection/InspectionImportDialog.vue';
import 'apexcharts/dist/apexcharts.css';
import type { Inspection } from '@/types/maintenance/inspection';

const inspectionFormStore = useInspectionFormStore();

const inspectionStore = useInspectionStore();
// set initial data for inspection store
inspectionStore.setInitialData()

const assetStore = useAssetStore()
const layoutStore = useLayoutStore()

const { inspections, loading: loadingInspections, inspectionsSummary, notifications, chartData } = storeToRefs(inspectionStore);

onMounted(()=>{
  inspectionFormStore.fetchForms()
  assetStore.fetchAssets()
  inspectionStore.fetchInspections();
  inspectionStore.fetchNotifications();
  inspectionStore.fetchChartData();
});

const inspectionDetailsDialog = ref(false);
const inspectionEditDialog = ref(false);
const selectedInspection = ref<Partial<Inspection>>({failed_items:[], items: []});
const importDialog = ref(false);

const monthlyInspectionOptions = computed(() => {
  return {
    series: [
      {
        name: 'Inspection Totals',
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
        text: 'Amount ($)'
      }
    },
    colors: ['#22a7f0']
  };
});

const inspectionStatusOptions = computed(() => ({
  chart: {
    type: 'pie',
    height: 350,
  },
  labels: chartData.value.statusDistribution.labels,
  colors: ["#1984c5", "#22a7f0", "#63bff0"]
}));

const inspectionStatusSeries = computed(() => chartData.value.statusDistribution.series);

const openCreateInspectionDialog = () => {
  selectedInspection.value = {failed_items:[], items: []};
  inspectionEditDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true;
};

const viewInspection = (inspection: any) => {
  selectedInspection.value = inspection;
  inspectionDetailsDialog.value = true;
};

const editInspection = (inspection: any) => {
  selectedInspection.value = inspection;
  inspectionEditDialog.value = true;
};

const deleteInspection = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this inspection ?")

  if (confirm) {
    await inspectionStore.deleteInspection(id);
  }
};

const closeInspectionDetailsDialog = () => {
  inspectionDetailsDialog.value = false;
};

const closeInspectionEditDialog = () => {
  inspectionEditDialog.value = false;
};

const saveInspection = async (inspection: any) => {
  if (inspection.id) {
    await inspectionStore.updateInspection(inspection);
  } else {
    await inspectionStore.submitInspectionForm(inspection);
  }
  inspectionEditDialog.value = false;
};

const handleImported = () => {
  inspectionStore.fetchInspections();
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

.card-4 {
  border-left: 8px solid #a4d0ee;
}
</style>
