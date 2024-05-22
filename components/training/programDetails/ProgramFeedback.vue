<template>
  <div>
    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Program Feedback</span>
    </div>
    <v-card class="mb-5">
      <v-card-text>
        <div class="d-flex" v-for="(item, index) in feedbackItems" :key="index">
          <v-avatar color="grey" size="50" class="mr-2">
            <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover></v-img>
          </v-avatar>
          <div class="d-flex flex-column flex-grow-1">
            <p class="font-weight-bold">{{ item.author }}</p>
            <p>{{ item.comment }}</p>
            <v-divider class="my-4" v-if="index != feedbackItems.length -1"></v-divider>
          </div>
        </div>
      </v-card-text>
    </v-card>


    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Leave your feedback</span>
    </div>

    <v-textarea v-model="userFeedback" placeholder="Your feedback" hint="Your insights are valuable to us" outlined
      dense variant="solo" clearable></v-textarea>

    <div class="d-flex justify-end">
      <v-btn color="primary" density="comfortable" class="text-none" @click="submitFeedback">Submit Feedback</v-btn>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FeedbackItem {
  author: string;
  comment: string;
}

// Sample feedback items
const feedbackItems = ref<FeedbackItem[]>([
  {
    author: 'John Doe',
    comment: 'Very insightful program, I learned a lot about safety protocols.'
  },
  {
    author: 'Jane Smith',
    comment: 'Great content, but I wish there were more interactive quizzes.'
  },
  // More sample feedback
]);

const userFeedback = ref('');

function submitFeedback() {
  if (userFeedback.value.trim()) {
    // For demonstration, we add the new feedback directly to the array.
    // In a real application, this would involve an API call.
    feedbackItems.value.push({
      author: 'Anonymous', // Or fetch the user's name from your auth state
      comment: userFeedback.value
    });

    // Clear the input field after submission
    userFeedback.value = '';

    // Notify the user of success, e.g., using a snackbar (not shown here)
    console.log('Feedback submitted successfully.');
  }
}
</script>