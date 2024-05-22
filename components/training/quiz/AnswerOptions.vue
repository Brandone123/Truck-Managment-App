<template>
    <v-card flat>
      <v-card-title>Answer Options</v-card-title>
      <v-card-text>
        <v-radio-group v-model="selectedOption">
          <v-radio
            v-for="option in options"
            :key="option.id"
            :label="option.text"
            :value="option.id"
          ></v-radio>
        </v-radio-group>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="submitAnswer">Submit Answer</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface AnswerOption {
    id: number;
    text: string;
  }
  
  const options = ref<AnswerOption[]>([
    { id: 1, text: 'Option A' },
    { id: 2, text: 'Option B' },
    { id: 3, text: 'Option C' },
    { id: 4, text: 'Option D' },
  ]);
  
  const selectedOption = ref<number|null>(null);
  
  const submitAnswer = () => {
    console.log('Submitted answer ID:', selectedOption.value);
    // Here you might emit an event or make an API call to record the answer
    // For example, this.$emit('answer-submitted', selectedOption.value);
  };
  </script>
  