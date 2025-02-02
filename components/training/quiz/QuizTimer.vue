<!-- src/components/training/quiz/QuizTimer.vue -->

<template>
  <v-card flat>
    <v-card-title class="d-flex align-center">
      <v-progress-circular
        :value="progress"
        :size="80"
        :width="5"
        color="primary"
        rotate="-90"
      >
        <strong class="text-center">{{ timeLeftFormatted }}</strong>
      </v-progress-circular>
      <span class="ml-4">Time Remaining</span>
    </v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  timeLimit: number; // in seconds
}>();

const emit = defineEmits(['time-up']);

const timeLeft = ref(props.timeLimit);
const progress = ref(100);

const timeLeftFormatted = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

let interval: number;

onMounted(() => {
  interval = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
      progress.value = (timeLeft.value / props.timeLimit) * 100;
    } else {
      clearInterval(interval);
      emit('time-up');
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});

watch(() => props.timeLimit, (newLimit) => {
  timeLeft.value = newLimit;
  progress.value = 100;
  clearInterval(interval);
  interval = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
      progress.value = (timeLeft.value / props.timeLimit) * 100;
    } else {
      clearInterval(interval);
      emit('time-up');
    }
  }, 1000);
});
</script>

<style scoped>
.d-flex {
  display: flex;
}
.align-center {
  align-items: center;
}
.ml-4 {
  margin-left: 16px;
}
</style>
