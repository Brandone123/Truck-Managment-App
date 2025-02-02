<!-- src/components/training/quiz/CurrentQuestion.vue -->

<template>
  <v-card outlined class="mb-4">
    <v-card-title>
      <span>Question {{ currentIndex + 1 }} of {{ totalQuestions }}</span>
    </v-card-title>
    <v-card-text>
      <div class="question-text" v-html="question.questionText"></div>
      <div class="question-media" v-if="question.mediaUrl">
        <img :src="question.mediaUrl" alt="Question media" class="media-image">
      </div>
      <AnswerOptions 
        v-model:selectedOption="selectedOption"
        :options="question.options" 
        :mode="mode"
        :correctOptionIndex="question.correctOptionIndex"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, onMounted } from 'vue';
import AnswerOptions from '@/components/training/quiz/AnswerOptions.vue';

interface QuizQuestion {
  id: number;
  questionText: string;
  mediaUrl?: string;
  options: string[];
  correctOptionIndex: number;
}

const props = defineProps<{
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  mode: 'take' | 'preview';
}>();

const emit = defineEmits(['answer-selected']);

/**
 * Reactive reference to hold the currently selected option.
 * Initialized to null and updated based on user interaction or preview mode.
 */
const selectedOption = ref<number | null>(null);

/**
 * Initializes the selectedOption based on the mode.
 * In 'preview' mode, it automatically selects the correct option.
 */
onMounted(() => {
  if (props.mode === 'preview') {
    selectedOption.value = props.question.correctOptionIndex;
  }
});

/**
 * Watches for changes in selectedOption.
 * Emits an event when a new option is selected in 'take' mode.
 */
watch(selectedOption, (newVal) => {
  if (props.mode === 'take' && newVal !== null) {
    emit('answer-selected', props.question.id, newVal);
  }
});
</script>

<style scoped>
.question-text {
  margin-bottom: 20px;
}

.media-image {
  max-width: 100%;
  height: auto;
}
</style>
