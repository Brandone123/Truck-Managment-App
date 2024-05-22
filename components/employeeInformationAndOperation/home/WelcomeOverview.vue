<template>
    <v-alert color="primary" variant="tonal" density="compact" closable>
      <v-alert-title>Good {{ partOfDay }}, {{ employeeName }}!</v-alert-title>
      <v-alert-text>
        <div class="text-subtitle-1">Today's Date: {{ currentDate }}</div>
        <div>Your next shift starts at: {{ nextShift }}</div>
        <div>Upcoming Training: {{ upcomingTraining.title }} on {{ upcomingTraining.date }}</div>
      </v-alert-text>
    </v-alert>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  const employeeName = ref('John Doe');
  const nextShift = ref('08:00 AM');
  const upcomingTraining = ref({
    title: 'Safety Procedures',
    date: 'April 5th, 2024',
  });
  
  // Compute the part of the day for the greeting
  const partOfDay = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    else if (hour < 18) return 'afternoon';
    else return 'evening';
  });
  
  // Format the current date
  const currentDate = computed(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });
  </script>
  
  <style scoped>
  /* Add any specific styling you want for this component */
  </style>
  