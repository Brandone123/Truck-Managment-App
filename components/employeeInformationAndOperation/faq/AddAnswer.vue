<template>
    <div>
      <v-form @submit.prevent="submitAnswer">
        <v-text-field
          v-model="newAnswer"
          label="Add your answer here"
          outlined
          dense
          clearable
        ></v-text-field>
        <v-btn type="submit" color="primary">Submit</v-btn>
      </v-form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps } from 'vue';
  
  const props = defineProps({
    faqId: {
      type: Number,
      required: true
    }
  });
  
  
  
  
  const newAnswer = ref('');
  
  const submitAnswer = () => {
    if (newAnswer.value.trim()) {
      newAnswer.value = ''; // Clear the input field after submitting
    }
  };
  </script>
  
  <style scoped>
  /* Add any specific styles for your AddAnswer component here */
  </style>
  