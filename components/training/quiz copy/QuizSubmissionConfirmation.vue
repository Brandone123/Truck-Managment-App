<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="success" variant="outlined" @click="submitQuiz">Submit Quiz</v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5">
        Quiz Submission Confirmation
      </v-card-title>
      <v-card-text>
        <p>Your quiz has been successfully submitted!</p>
        <p>Score: {{ score }}%</p>
        <p>Thank you for completing the quiz. You can review your answers or proceed to the next module.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="close">Close</v-btn>
        <v-btn color="primary" variant="text" @click="reviewAnswers">Review Answers</v-btn>
        <v-btn color="primary" @click="proceedToNextModule">Next Module</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Example reactive state for the dialog visibility and the quiz score
const dialog = ref(false);
const score = ref(80); // Example score, replace with actual data as needed

// Methods for handling the dialog actions
const close = () => {
  dialog.value = false;
};

const reviewAnswers = () => {
  // Logic for allowing the user to review their quiz answers
  console.log("Reviewing answers...");
  close();
};

const proceedToNextModule = () => {
  // Logic for proceeding to the next module, potentially navigating to a different route
  console.log("Proceeding to the next module...");
  close();
  // For example, using Vue Router to navigate:
  // router.push({ name: 'nextModule' });
};

const submitQuiz = () => {
  console.log('Quiz Submitted');
  // Emit an event or call a method to submit the quiz answers
  // For example, this.$emit('quiz-submitted');
};
</script>