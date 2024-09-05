<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h6">Preventive Maintenance Inspections</span>
      <v-btn color="primary" @click="openAddDialog">Add Inspection</v-btn>
    </div>

    <InspectionDetailsDialog :modelValue="detailsDialog" :program="selectedProgram"
      @update:modelValue="detailsDialog = $event" />
    <InspectionEditDialog :modelValue="addEditDialog" :program="selectedProgram"
      @update:modelValue="addEditDialog = $event" @save="saveProgram" />
    <!-- <DeleteConfirmationDialog :modelValue="deleteDialog" @confirm="deleteInspection" @update:modelValue="deleteDialog = $event" /> -->


    <v-row class="mt-5 mb-10">
      <v-col cols="12" md="3">
        <v-card class="card-1 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#4CAF50">mdi-counter</v-icon>
              <span>Total Inspections</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ totalInspections }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-2 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-check-circle-outline</v-icon>
              <span>Passed Inspections</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ passedInspections }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-3 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-close-outline</v-icon>
              <span>Failed Inpections</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ failedInspections }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-4 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-progress-clock</v-icon>
              <span>Pending Inspections</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ pendingInspections }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <SharedUiCustomTable show-select :filters="filterAssets" :showFooterInHead="false" :headers="tableHeaders"
      :items="inspectionList" :loading="loading">
      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status.toLowerCase() == 'passed' ? 'primary' : 'error'">
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="viewDetails(item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" dense @click="editInspection(item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" dense @click="deleteInspection(item.id)">mdi-delete</v-icon>
      </template>
    </SharedUiCustomTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import InspectionDetailsDialog from '@/components/maintenance/preventiveManagement/inspection/InspectionDetailsDialog.vue';
import InspectionEditDialog from '@/components/maintenance/preventiveManagement/inspection/InspectionEditDialog.vue';
import DeleteConfirmationDialog from '@/components/maintenance/preventiveManagement/maintenanceProgram/DeleteConfirmationDialog.vue';
import type { filterItem } from '~/types/layout/table';
import type { PreventiveMaintenanceInspection } from '~/types/maintenance/preventiveMaintenanceInspectionTypes';
import { usePreventiveMaintenanceInspectionStore } from '~/stores/maintenance/preventiveMaintenanceInspectionStore';

const store = usePreventiveMaintenanceInspectionStore();
const { inspectionList, loading } = storeToRefs(store);

const detailsDialog = ref(false);
const addEditDialog = ref(false);
const deleteDialog = ref(false);

const selectedProgram = ref({} as Partial<PreventiveMaintenanceInspection>);

const openAddDialog = () => {
  selectedProgram.value = {} as Partial<PreventiveMaintenanceInspection>;
  addEditDialog.value = true;
};


const totalInspections = computed(() => {
  return inspectionList.value?.length || 0
})

const passedInspections = computed(() => {
  return inspectionList.value?.filter(item => item.status.toLocaleLowerCase() == "passed").length
})

const failedInspections = computed(() => {
  return inspectionList.value?.filter(item => item.status.toLocaleLowerCase() == "failed").length
})

const pendingInspections = computed(() => {
  return inspectionList.value?.filter(item => item.status.toLocaleLowerCase() == "pending").length
})

const viewDetails = (program: any) => {
  selectedProgram.value = program;
  detailsDialog.value = true;
};

const editInspection = (program: any) => {
  selectedProgram.value = program;
  addEditDialog.value = true;
};

const confirmDelete = (id: any) => {
  selectedProgram.value = { ...id };
  deleteDialog.value = true;
};

const layoutStore = useLayoutStore()
const deleteInspection = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this maintenance inspection ?")

  if (confirm) {
    await store.deletePreventiveMaintenanceInspection(id);
  }
};

const saveProgram = async (program: any) => {
  if (program.id) {
    await store.updatePreventiveMaintenanceInspection(program);
  } else {
    await store.createMaintenanceInspection(program);
  }
  addEditDialog.value = false;
};

const tableHeaders = [
  { title: 'Inspection ID', key: 'id' },
  { title: 'Date and Time', key: 'date_time' },
  { title: 'Driver Name', key: 'driver_name' },
  { title: 'Vehicle ID', key: 'vehicle_id' },
  { title: 'Inspection Type', key: 'inspection_type' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions' },
];

const filterAssets = computed(() => {
  return [
    {
      title: 'Status',
      key: 'status',
      items: [{ text: 'Passed', value: 'passed' }, { text: 'Failed', value: 'failed' }, { text: 'Pending', value: 'pending' }],
      width: '300px',
    },
    {
      title: 'Inspection Type',
      key: 'status',
      items: [{ text: 'Daily', value: 'daily' }, { text: 'Pre-Trip', value: 'pre-trip' }, { text: 'Post-Trip', value: 'post-trip' }],
      width: '300px',
    },
  ] as filterItem[]
})

onMounted(() => {
  store.fetchPreventiveMaintenanceInspections();
});

</script>

<style scoped>
.card-1 {
  border-left: 8px solid #4CAF50;
}

.card-2 {
  border-left: 8px solid #1867C0;
}

.card-3 {
  border-left: 8px solid #CE0053;
}

.card-4 {
  border-left: 8px solid #424656;
}
</style>