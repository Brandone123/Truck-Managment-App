<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4">
            <v-card-title>
              HR Notification Center
            </v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search notifications"
              single-line
              hide-details
              class="mb-4"
            ></v-text-field>
            <v-data-table
              :headers="headers"
              :items="notifications"
              :search="search"
              class="elevation-1"
              hide-default-footer
            >
              <template v-slot:item.action="{ item }">
                <v-btn icon @click="dismissNotification(item)">
                  <v-icon>mdi-check-circle</v-icon>
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
  const notifications = ref([
    // Sample data - replace with data fetched from your backend
    {
      id: 1,
      date: '2024-01-02',
      message: 'Leave request from John Doe needs approval.',
      type: 'Leave Request',
      action: 'Review',
    },
    // ... more notifications
  ]);
  
  const headers = [
    { text: 'Date', value: 'date' },
    { text: 'Message', value: 'message' },
    { text: 'Type', value: 'type' },
    { text: 'Action', value: 'action' },
  ];
  
  const dismissNotification = (item) => {
    // Logic to dismiss the notification, likely removing it from the list and updating the backend
    console.log('Dismissing notification:', item);
    const index = notifications.value.findIndex(notification => notification.id === item.id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };
  </script>
  