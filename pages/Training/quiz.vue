<template>
  <div>
    <!-- Quiz Introduction or Instructions -->
    <QuizInstructions />

    <v-card>
      <v-card-text>
        <div class="d-flex justify-space-between flex-wrap">
          <!-- Question Navigator -->
          <!-- Allows users to see which questions they've answered or skipped -->
          <QuestionNavigator />

          <!-- Quiz Timer -->
          <!-- Optionally, display a countdown timer if the quiz is timed -->
          <QuizTimer />
        </div>
        <v-divider class="my-4"></v-divider>
        <!-- Current Question Display -->
        <!-- Displays the question text, any associated media, and answer options -->
        <CurrentQuestion class="mx-8" />

        <!-- Answer Options -->
        <!-- Renders the options for the current question, differentiating between multiple choice, true/false, or other types -->
        <!-- <AnswerOptions /> -->

        <v-divider class="my-4"></v-divider>

        <!-- Navigation Controls -->
        <!-- Buttons to navigate between questions, submit answers, and finalize the quiz -->
        <QuizNavigationControls />

        <div class="d-flex justify-center">
          <!-- Quiz Submission Confirmation -->
          <!-- Modal or dialog confirming quiz submission and optionally displaying results or feedback -->
          <QuizSubmissionConfirmation />
        </div>
      </v-card-text>


    </v-card>

  </div>
</template>

<script setup lang="ts">
// Import each component; these are placeholders for the actual component imports
import QuizInstructions from '@/components/training/quiz/QuizInstructions.vue';
import QuestionNavigator from '@/components/training/quiz/QuestionNavigator.vue';
import CurrentQuestion from '@/components/training/quiz/CurrentQuestion.vue';
import AnswerOptions from '@/components/training/quiz/AnswerOptions.vue';
import QuizTimer from '@/components/training/quiz/QuizTimer.vue';
import QuizNavigationControls from '@/components/training/quiz/QuizNavigationControls.vue';
import QuizSubmissionConfirmation from '@/components/training/quiz/QuizSubmissionConfirmation.vue';
</script>