<!-- src/components/training/quiz/QuizInstructions.vue -->

<template>
  <v-card outlined class="mb-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>{{ instructions.title }}</span>
      <v-btn icon flat density="compact" @click="toggleInstructions">
        <v-icon>{{ showInstructions ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-if="alert" :class="{ 'pb-0': showInstructions }">
      <v-alert type="info" density="compact" color="primary" dismissible>
        Please read all instructions carefully before beginning the quiz.
      </v-alert>
    </v-card-text>
    <v-expand-transition>
      <v-card-text v-if="showInstructions">
        <div>{{ instructions.title }}</div>
        <ul class="px-5">
          <li v-for="(detail, index) in instructions.details" :key="index">{{ detail }}</li>
        </ul>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Instructions {
  title: string;
  details: string[];
}

const props = defineProps<{
  instructions: Instructions;
}>();

const showInstructions = ref(false);
const alert = ref(true);

const toggleInstructions = () => {
  showInstructions.value = !showInstructions.value;
};
</script>

<style scoped>
/* Add styles as needed */
</style>
