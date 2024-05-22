<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h6">Notifications And Alerts</span>
    </div>
    <v-card>
      <v-card-text>
        <v-alert density="compact" class="mb-2" v-for="(notification, index) in notifications" :key="index" color="info" dense dismissible
          @input="dismissNotification(index)" :icon="notification.icon">
          {{ notification.message }}
        </v-alert>
      </v-card-text>
    </v-card>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const notifications = ref([
  { icon: 'mdi-bell-alert', message: 'Your training session starts in 30 minutes.' },
  { icon: 'mdi-email', message: 'You have a new message from HR.' },
  { icon: 'mdi-calendar-check', message: 'Department meeting tomorrow at 10:00 AM.' },
]);

function dismissNotification(index: number) {
  notifications.value.splice(index, 1);
}
</script>

<style scoped>
/* Optional styling for the notifications */
</style>