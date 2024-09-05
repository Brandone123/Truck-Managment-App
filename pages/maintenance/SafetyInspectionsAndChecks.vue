<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Safety Inspections and Checks</span>
      <v-btn color="primary" @click="openAddInspectionDialog">Add Inspection</v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-clipboard-check-outline</v-icon>
              <span>Total Inspections</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ inspectionSummary.totalInspections }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-progress-clock</v-icon>
              <span>Inspections Pending</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ inspectionSummary.inspectionsPending }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-check-circle-outline</v-icon>
              <span>Inspections Completed</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ inspectionSummary.inspectionsCompleted }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <InspectionsTable @view="viewInspection" @edit="editInspection" @delete="deleteInspection" />
      </v-col>
    </v-row>

    <InspectionDetailsDialog :modelValue="detailsDialog" :inspection="selectedInspection"
      @update:modelValue="detailsDialog = $event" />
    <InspectionEditDialog :modelValue="editDialog" :inspection="selectedInspection"
      @update:modelValue="editDialog = $event" @save="saveInspection" />
    <DeleteInspectionDialog :modelValue="deleteDialog" @update:modelValue="deleteDialog = $event" @confirm="confirmDeleteInspection" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import InspectionsTable from '@/components/maintenance/compliance/safety/InspectionsTable.vue';
import InspectionDetailsDialog from '@/components/maintenance/compliance/safety/InspectionDetailsDialog.vue';
import InspectionEditDialog from '@/components/maintenance/compliance/safety/InspectionEditDialog.vue';
import DeleteInspectionDialog from '@/components/maintenance/compliance/safety/DeleteInspectionDialog.vue';
import { useInspectionsStore } from '@/stores/maintenance/inspectionsStore';
import type { Inspection } from '@/types/maintenance/inspectionTypes';

const inspectionsStore = useInspectionsStore();
const search = ref('');
const detailsDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const selectedInspection = ref<Inspection | null>(null);

const inspectionSummary = computed(() => inspectionsStore.inspectionSummary);

onMounted(() => {
  inspectionsStore.fetchInspections();
});

const openAddInspectionDialog = () => {
  selectedInspection.value = null;
  editDialog.value = true;
};

const viewInspection = (inspection: Inspection) => {
  selectedInspection.value = inspection;
  detailsDialog.value = true;
};

const editInspection = (inspection: Inspection) => {
  selectedInspection.value = inspection;
  editDialog.value = true;
};

const deleteInspection = (inspection: Inspection) => {
  selectedInspection.value = inspection;
  deleteDialog.value = true;
};

const saveInspection = (inspection: Inspection) => {
  if (inspection.id) {
    inspectionsStore.updateInspection(inspection);
  } else {
    inspectionsStore.createInspection(inspection);
  }
  editDialog.value = false;
};

const confirmDeleteInspection = () => {
  if (selectedInspection.value) {
    inspectionsStore.deleteInspection(selectedInspection.value.id as number);
  }
  deleteDialog.value = false;
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