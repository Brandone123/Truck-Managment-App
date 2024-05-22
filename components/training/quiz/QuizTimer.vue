<template>
    <!-- <v-card outlined  flat>
      <v-card-title>Time Remaining</v-card-title>
      <v-card-text> -->
        <v-progress-circular
          :model-value="100 - progress"
          :size="100"
          :width="10"
          color="primary"
        
        >
      
        <template v-slot:default="{ value }">
          <strong class="text-center">Time Left <br> {{ timeLeftFormatted }}</strong>
        </template>
      </v-progress-circular>
      <!-- </v-card-text>
    </v-card> -->
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const totalSeconds = 300; // Example: 5 minutes for the quiz
  const timeLeft = ref(totalSeconds);
  const progress = ref(100);
  
  // Formats the time left into a mm:ss string
  const timeLeftFormatted = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });
  
  // Updates the timer every second
  const interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
      progress.value = (timeLeft.value / totalSeconds) * 100;
    } else {
      clearInterval(interval);
      // Here you might emit an event indicating the time is up
      // For example, this.$emit('time-up');
    }
  }, 1000);
  
  onMounted(() => {
    // Initialize the timer or any required setup on mount
  });
  
  onUnmounted(() => {
    // Clean up the interval when the component is unmounted
    clearInterval(interval);
  });
  </script>
  