<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h5">Employee Management</span>
      <EmployeeDialog :employee="selectedEmployee" :dialog="dialog" @update:dialog="updateDialog" @save="saveEmployee">
    </EmployeeDialog>
    </div>

    <SharedUiCustomTable :headers="headers" :items="employees">
      <template v-slot:item.actions="{ item }">
        <v-btn @click="editItem(item)" icon density="comfortable" variant="tonal" color="primary">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn @click="deleteItem(item)" icon density="comfortable" variant="tonal" color="red">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </SharedUiCustomTable>

    <!-- New/Edit Employee Dialog -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EmployeeDialog from '@/components/hr/EmployeeDialog.vue';

const employees = ref([]); // Fetch employee data from your backend
const dialog = ref(false);
const selectedEmployee = ref(null);

const headers = [
  { title: 'First Name', value: 'firstName' },
  { title: 'Last Name', value: 'lastName' },
  { title: 'Email', value: 'email' },
  { title: 'Phone Number', value: 'phone' },
  { title: 'Job Title', value: 'jobTitle' },
  { title: 'Actions', value: 'actions', sortable: false },
];

function editItem(item) {
  selectedEmployee.value = { ...item };
  dialog.value = true;
}

function deleteItem(item) {
  // Implement employee deletion logic
  console.log(`Delete ${item.firstName}`);
}

function newItem() {
  selectedEmployee.value = null; // Clear the selected employee for the new item
  dialog.value = true;
}

function updateDialog(val){
  dialog.value = val;
}

function saveEmployee(employee) {
  // Implement save logic here
  console.log(`Save ${employee.firstName}`);
}
</script>