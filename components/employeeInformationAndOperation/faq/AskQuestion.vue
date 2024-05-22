<template>
    <v-form @submit.prevent="submitQuestion">
      <v-text-field v-model="newQuestion" label="Ask a new question" outlined dense />
      <v-btn type="submit" color="primary">Submit</v-btn>
    </v-form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const newQuestion = ref('');
  
  const submitQuestion = () => {
    if (newQuestion.value.trim()) {
      newQuestion.value = ''; // Reset input after submission
    }
  };
  </script>
  