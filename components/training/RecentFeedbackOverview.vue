<template>
    <v-card>
      <v-card-title>Recent Feedback Overview</v-card-title>
      <v-card-text>
        <v-carousel cycle height="200">
          <v-carousel-item v-for="feedback in feedbacks" :key="feedback.id">
            <v-row class="fill-height" align="center" justify="center">
              <v-col class="text-center">
                <div>{{ feedback.comment }}</div>
                <v-chip small :color="feedback.rating > 3 ? 'green' : 'red'" dark>{{ feedback.rating }}/5</v-chip>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const feedbacks = ref([
    { id: 1, comment: 'The Safety Training module was very informative and easy to understand.', rating: 5 },
    { id: 2, comment: 'Operational Excellence training could use more interactive examples.', rating: 3 },
    { id: 3, comment: 'Customer Service Fundamentals was engaging and helpful. Loved it!', rating: 4 },
  ]);
  </script>
  