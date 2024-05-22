<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Leave Requests Overview</span>
    </div>
    <v-card>
      <v-card-text>
        <v-data-table :headers="headers" :items="leaveRequests" density="compact">
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center">
              <v-btn icon variant="tonal" color="green" density="compact" @click="approveRequest(item)">
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn icon variant="tonal" color="red" density="compact" class="ml-2" @click="rejectRequest(item)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Sample data, replace with actual data from your backend
const leaveRequests = ref([
  { id: 1, employeeName: 'John Doe', leaveType: 'Vacation', startDate: '2024-04-01', endDate: '2024-04-10', status: 'Pending' },
  { id: 2, employeeName: 'Jane Smith', leaveType: 'Sick Leave', startDate: '2024-04-05', endDate: '2024-04-07', status: 'Pending' },
  // Add more requests as needed
]);

const headers = [
  { title: 'Employee Name', align: 'start', value: 'employeeName' },
  { title: 'Leave Type', value: 'leaveType' },
  { title: 'Start Date', value: 'startDate' },
  { title: 'End Date', value: 'endDate' },
  { title: 'Status', value: 'status' },
  { title: 'Actions', value: 'actions', align: "center", sortable: false },
];

// Methods to approve or reject leave requests (to be implemented)
const approveRequest = (item) => {
  // Implement functionality to approve request
  console.log(`Approving request for ${item.employeeName}`);
};

const rejectRequest = (item) => {
  // Implement functionality to reject request
  console.log(`Rejecting request for ${item.employeeName}`);
};
</script>