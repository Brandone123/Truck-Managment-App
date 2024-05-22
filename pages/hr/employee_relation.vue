<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h5">Employee Relations</span>
        @save="saveEmployee" />
    </div>

    <SharedUiCustomTable :headers="headers" :items="relations">
      <template v-slot:item.actions="{ item }">
        <v-btn icon variant="tonal" density="comfortable" color="primary" @click="editRelationRecord(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteRelationRecord(item)" variant="tonal" density="comfortable" color="red" class="ml-2">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </SharedUiCustomTable>

    <!-- New/Edit Employee Relations Record Dialog -->

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

//import EmployeeRelationDialog from '@/components/hr/EmployeeRelation/EmployeeRelationDialog'

const relations = ref([
  // Sample data - fetch from your backend
  {
    id: 1,
    employeeName: 'John Doe',
    date: new Date().toISOString().substring(0, 10), // today's date for sample
    description: 'A description of the issue...',
    resolution: 'The resolution taken...',
    // ...other relevant fields
  },
  // ...more relations
]);

const headers = [
  { title: 'Employee Name', value: 'employeeName' },
  { title: 'Date', value: 'date' },
  { title: 'Description', value: 'description' },
  { title: 'Resolution', value: 'resolution' },
  { title: 'Actions', value: 'actions', sortable: false },
];

const dialog = ref(false);
const selectedRelation = ref(null);
const editedRelation = reactive({
  description: '',
  resolution: '',
  // ... other relevant fields
});

const updateDialog = (val) => {
  dialog.value = val
}

const newRelationRecord = () => {
  selectedRelation.value = null;
  Object.keys(editedRelation).forEach(key => {
    editedRelation[key] = '';
  });
  relationDialog.value = true;
};

const editRelationRecord = (item) => {
  selectedRelation.value = item;
  Object.assign(editedRelation, item);
  relationDialog.value = true;
};

const closeRelationDialog = () => {
  relationDialog.value = false;
};

const saveRelationRecord = () => {
  if (selectedRelation.value) {
    // Update logic for existing record
  } else {
    // Logic for saving a new record
  }
  closeRelationDialog();
};

const deleteRelationRecord = (item) => {
  // Logic to delete the record
};
</script>