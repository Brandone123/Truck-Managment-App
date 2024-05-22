<template>
    <div>
    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Alerts & Notifications</span>
    </div>
    <v-card>
      <v-card-text>
        <v-alert v-for="alert in alerts" :key="alert.id" dense outlined type="info" class="mb-2">
          {{ alert.message }}
        </v-alert>
      </v-card-text>
    </v-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const alerts = ref([
    { id: 1, message: 'New Safety Training Module available!' },
    { id: 2, message: 'Defensive Driving Course due in 3 days.' },
    { id: 3, message: 'Feedback survey for Operational Excellence closes tomorrow!' },
  ]);
  </script>
  