<!-- src/components/training/quiz/QuizNavigationControls.vue -->

<template>
  <v-card flat>
    <v-card-actions class="justify-space-between">
      <v-btn 
        :disabled="currentIndex === 0" 
        @click="$emit('previous')"
        color="primary"
      >
        Previous
      </v-btn>

      <span>Question {{ currentIndex + 1 }} of {{ totalQuestions }}</span>

      <v-btn 
        :disabled="currentIndex === totalQuestions - 1" 
        @click="$emit('next')"
        color="primary"
      >
        Next
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="isTakeMode" class="justify-end">
      <v-btn color="success" @click="$emit('submit')">Submit Quiz</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

const props = defineProps<{
  currentIndex: number;
  totalQuestions: number;
  mode: 'take' | 'preview';
}>();

const emit = defineEmits(['previous', 'next', 'submit']);

const isTakeMode = computed(() => props.mode === 'take');
</script>

<style scoped>
/* Add any necessary styles */
</style>
