<template>
    <v-card flat>
      <v-card-actions class="justify-space-between">
        <v-btn 
          :disabled="currentQuestionIndex === 0" 
          @click="goToPrevious"
        >
          Previous
        </v-btn>
  
        <span>Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}</span>
  
        <v-btn 
          :disabled="currentQuestionIndex === totalQuestions - 1" 
          @click="goToNext"
        >
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  const currentQuestionIndex = ref(0); // The index of the currently displayed question
  const totalQuestions = ref(5); // Total number of questions in the quiz
  
  const goToPrevious = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  };
  
  const goToNext = () => {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++;
    }
  };

  </script>
  