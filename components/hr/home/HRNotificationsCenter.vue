<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">HR Notifications Center</span>
    </div>
    <v-card>
      <v-list density="compact">
        <v-list-item v-for="(notification,index) in notifications" :key="index"
          @click="handleNotificationClick(notification)" class="notification-item">
          <template v-slot:prepend>
            <v-icon :color="notification.iconColor">{{ notification.icon }}</v-icon>
          </template>
          <v-list-item-content>
            <v-list-item-title>{{ notification.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
          </v-list-item-content>
          <template v-slot:append>
            <v-btn icon variant="tonal" density="comfortable" :color="notification.actionColor">
              <v-icon>{{ notification.actionIcon }}</v-icon>
            </v-btn>
          </template>
          <!-- <v-divider class="mt-4" v-if="index < notifications.length - 1"></v-divider> -->
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const notifications = ref([
  {
    id: 1,
    title: 'Leave Request Pending',
    message: 'John Doe has requested vacation leave.',
    icon: 'mdi-account-clock',
    iconColor: 'blue',
    actionIcon: 'mdi-eye',
    actionColor: 'primary',
  },
  {
    id: 2,
    title: 'Performance Review Due',
    message: 'Emily Johnson’s performance review is due next week.',
    icon: 'mdi-chart-bar',
    iconColor: 'green',
    actionIcon: 'mdi-eye',
    actionColor: 'primary',
  },
  // Add more notifications as needed
]);

// Handle notification click (Placeholder for actual implementation)
function handleNotificationClick(notification) {
  // Placeholder: Implement navigation or action based on notification type
  console.log(`Notification clicked: ${notification.title}`);
}
</script>

<style scoped>
.notification-item {
  cursor: pointer;
  margin-bottom: 5px;
}
</style>