<template>
 
    <v-card>
      <v-card-text>
        <v-data-table show-expand density="compact" :headers="headers" :items="assignments" :items-per-page="5">
          <template v-slot:item.actions="{ item }">
            <v-btn icon variant="text" color="primary" density="compact" @click="editAssignment(item)">
              <v-icon @click="editAssignment(item)">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" density="compact" color="red" @click="revokeAssignment(item)">
              <v-icon @click="revokeAssignment(item)">mdi-delete</v-icon>
            </v-btn>
          </template>

          <!-- expand template slot showing position duties -->
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">

                <v-list density="compact">
                  <v-list-subheader>Assignee Names</v-list-subheader>
                  <v-list-item v-for="(assigneeName, index) in item.assigneeNames" :key="index">{{ assigneeName }}</v-list-item>
                </v-list>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Assignment {
  id: number;
  title: string;
  assigneeNames: string[]; // List of assigned employees or drivers
  dueDate: string;
  status: string; // Example: "Completed", "Pending", "Overdue"
}

// Sample data for current assignments
const assignments = ref<Assignment[]>([
  {
    id: 1,
    title: 'Safety Training Module 1',
    assigneeNames: ['John Doe', 'Jane Smith'],
    dueDate: '2023-04-30',
    status: 'Pending',
  },
  // More assignments...
]);

const headers = [
  { title: 'Title', value: 'title' },
  // { title: 'Assigned To', value: 'assigneeNames', sortable: false },
  { title: 'Due Date', value: 'dueDate' },
  { title: 'Status', value: 'status' },
  { title: 'Actions', value: 'actions', sortable: false },
];

// Methods for handling actions (Edit and Revoke)
const editAssignment = (assignment: Assignment) => {
  console.log('Editing assignment:', assignment.id);
  // Logic to open an edit dialog or navigate to an edit page
};

const revokeAssignment = (assignment: Assignment) => {
  console.log('Revoking assignment:', assignment.id);
  // Logic to confirm and process assignment revocation
};
</script>