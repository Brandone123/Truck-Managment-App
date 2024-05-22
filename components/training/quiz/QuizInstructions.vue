<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>Quiz Instructions</span>
      <v-btn icon flat density="compact" @click="toggleInstructions">
        <v-icon>{{ showInstructions ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-if="alert" :class="{'pb-0':showInstructions}">
      <v-alert v-model="alert" type="info" density="compact" color="primary" closable>
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

// Sample instructions for the quiz
const instructions = ref<Instructions>({
  title: 'General Instructions for the Quiz:',
  details: [
    'The quiz consists of 10 multiple-choice questions.',
    'You have 20 minutes to complete the quiz.',
    'Each question carries one mark; there is no negative marking for wrong answers.',
    'Passing score is 70%.',
    'Click "Submit" after answering all questions to see your score.',
  ],
});

const showInstructions = ref(false);
const alert = ref(true)

const toggleInstructions = () => {
  showInstructions.value = !showInstructions.value;
};
</script>