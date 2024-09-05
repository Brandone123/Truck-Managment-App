<template>
  <div>
    <div class="d-flex justify-space-between mb-16">
      <span class="text-primary text-h5">Inspection Records Management</span>
      <v-btn color="primary" @click="openAddInspectionRecordDialog">Add Inspection Record</v-btn>
    </div>

    <v-row>
      <v-col cols="12">
        <InspectionRecordsTable :inspectionRecords="inspectionRecords" @view="viewInspectionRecord"
          @edit="editInspectionRecord" @delete="deleteInspectionRecord" />
      </v-col>
    </v-row>

    <InspectionRecordDetailsDialog :modelValue="detailsDialog" :inspectionRecord="selectedInspectionRecord"
      @update:modelValue="detailsDialog = $event" />
    <InspectionRecordEditDialog :modelValue="editDialog" :inspectionRecord="selectedInspectionRecord"
      @update:modelValue="editDialog = $event" @save="saveInspectionRecord" />
    <DeleteInspectionRecordDialog :modelValue="deleteDialog" @confirm="confirmDeleteInspectionRecord" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import InspectionRecordsTable from '@/components/maintenance/equipment/inspection/InspectionRecordsTable.vue';
import InspectionRecordDetailsDialog from '@/components/maintenance/equipment/inspection/InspectionRecordDetailsDialog.vue';
import InspectionRecordEditDialog from '@/components/maintenance/equipment/inspection/InspectionRecordEditDialog.vue';
import DeleteInspectionRecordDialog from '@/components/maintenance/equipment/inspection/DeleteInspectionRecordDialog.vue';
import { useInspectionRecordsStore } from '@/stores/maintenance/inspectionRecords';
import type { InspectionRecord } from '@/types/maintenance/inspectionRecords';

const inspectionRecordsStore = useInspectionRecordsStore();
const { inspectionRecords } = storeToRefs(inspectionRecordsStore)
const search = ref('');
const detailsDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const selectedInspectionRecord = ref<InspectionRecord | null>(null);

const layoutStore = useLayoutStore()

const openAddInspectionRecordDialog = () => {
  selectedInspectionRecord.value = null;
  editDialog.value = true;
};

const viewInspectionRecord = (inspectionRecord: InspectionRecord) => {
  selectedInspectionRecord.value = inspectionRecord;
  detailsDialog.value = true;
};

const editInspectionRecord = (inspectionRecord: InspectionRecord) => {
  selectedInspectionRecord.value = inspectionRecord;
  editDialog.value = true;
};

const deleteInspectionRecord = (inspectionRecord: InspectionRecord) => {
  selectedInspectionRecord.value = inspectionRecord;
  deleteDialog.value = true;
};

const saveInspectionRecord = (inspectionRecord: InspectionRecord) => {
  if (inspectionRecord.id) {
    inspectionRecordsStore.updateInspectionRecord(inspectionRecord);
  } else {
    inspectionRecordsStore.createInspectionRecord(inspectionRecord);
  }
  editDialog.value = false;
};

const confirmDeleteInspectionRecord = async () => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this inspection record ?")

  if (selectedInspectionRecord.value && confirm) {
    inspectionRecordsStore.deleteInspectionRecord(selectedInspectionRecord.value.id);
  }
  deleteDialog.value = false;
};
</script>