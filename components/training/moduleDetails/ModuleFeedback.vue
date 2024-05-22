<template>
  <div>
    <div class="d-flex flex-wrap justify-center">
      <span class="v-card-title px-0 font-weight-bold text-primary">Feedback</span>
    </div>

    <div class="d-flex" v-for="(feedback, index) in feedbackList" :key="index">
      <v-avatar color="grey" size="50" class="mr-2">
        <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover></v-img>
      </v-avatar>
      <div class="d-flex flex-column flex-grow-1">
        <p class="font-weight-bold">{{ feedback.author }}</p>
        <p>{{ feedback.comment }}</p>
        <v-divider class="my-4" v-if="index != feedbackList.length - 1"></v-divider>
      </div>
    </div>

    <v-divider class="my-4"></v-divider>

    <!-- <p class="text-primary text-subtitle" >Leave Your Feedback</p> -->
    <v-form @submit.prevent="submitFeedback">
      <v-textarea v-model="newFeedback.comment" variant="solo" flat label="Your feedback" rows="3" auto-grow clearable
        :rules="feedbackRules"></v-textarea>
      <div class="d-flex justify-center">
        <v-btn type="submit" color="primary" density="compact" class="text-none">Submit</v-btn>
      </div>
    </v-form>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FeedbackEntry {
  author: string;
  comment: string;
}

// Sample feedback list
const feedbackList = ref<FeedbackEntry[]>([
  {
    author: 'Student A',
    comment: 'This module really clarified my understanding of the topic.',
  },
  {
    author: 'Student B',
    comment: 'I would appreciate more examples in the next module.',
  },
  // Add more sample feedback as needed
]);

// New feedback input
const newFeedback = ref<FeedbackEntry>({
  author: 'Anonymous', // This could be dynamically set if you have user information
  comment: '',
});

// Feedback form rules
const feedbackRules = [
  (v: string) => !!v || 'Feedback is required',
  (v: string) => (v && v.length <= 200) || 'Feedback must be less than 200 characters',
];

// Submit new feedback
const submitFeedback = () => {
  if (newFeedback.value.comment) {
    feedbackList.value.push({ ...newFeedback.value });
    newFeedback.value.comment = ''; // Clear the input field
    // In a real application, you'd also make an API call to submit the feedback to the server
  }
};
</script>

<style scoped>
.my-4 {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>