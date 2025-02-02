<!-- src/components/training/quiz/QuestionNavigator.vue -->

<template>
  <v-card flat>
    <v-card-title>Question Navigator</v-card-title>
    <v-card-text>
      <v-chip-group 
        column 
        multiple
        class="question-navigator"
      >
        <v-chip 
          v-for="(question, index) in questions" 
          :key="question.id" 
          :color="isAnswered(index) ? 'green' : 'grey'" 
          @click="navigate(index)"
          class="ma-1"
          outlined
        >
          {{ index + 1 }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

const props = defineProps<{
  questions: QuizQuestion[];
  currentIndex: number;
  answeredQuestions: number[];
}>();

const emit = defineEmits(['navigate']);

function isAnswered(index: number): boolean {
  return props.answeredQuestions.includes(props.questions[index].id);
}

function navigate(index: number) {
  emit('navigate', index);
}
</script>

<style scoped>
.question-navigator .v-chip {
  cursor: pointer;
}
</style>
