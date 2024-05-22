<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4">
            <v-card-title>
              Leave Requests
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search requests"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="leaveRequests"
              :search="search"
              class="elevation-1"
            >
              <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)">
                  {{ item.status }}
                </v-chip>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="approveRequest(item)" :disabled="item.status !== 'Pending'">
                  <v-icon color="green">mdi-check</v-icon>
                </v-btn>
                <v-btn icon @click="rejectRequest(item)" :disabled="item.status !== 'Pending'">
                  <v-icon color="red">mdi-close</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const search = ref('');
  const leaveRequests = ref([
    // Sample data - fetch from your backend
    { id: 1, employeeName: 'John Doe', leaveType: 'Vacation', startDate: '2024-06-15', endDate: '2024-06-20', status: 'Pending' },
    // ... more leave requests
  ]);
  
  const headers = [
    { text: 'Employee Name', value: 'employeeName' },
    { text: 'Leave Type', value: 'leaveType' },
    { text: 'Start Date', value: 'startDate' },
    { text: 'End Date', value: 'endDate' },
    { text: 'Status', value: 'status' },
    { text: 'Actions', value: 'actions', sortable: false },
  ];
  
  const approveRequest = (item) => {
    // Logic to approve request
    console.log('Approving:', item);
    item.status = 'Approved'; // Update the status accordingly
  };
  
  const rejectRequest = (item) => {
    // Logic to reject request
    console.log('Rejecting:', item);
    item.status = 'Rejected'; // Update the status accordingly
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'yellow';
      case 'Approved': return 'green';
      case 'Rejected': return 'red';
      default: return 'grey';
    }
  };
  </script>
  