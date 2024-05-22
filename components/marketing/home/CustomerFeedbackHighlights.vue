<template>
   <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary"> Customer Feedback Highlights</span>
    </div>
    <v-card class="pa-4" elevation="2">
      <v-card-text>
        <v-timeline dense>
          <v-timeline-item v-for="(feedback, index) in filteredFeedbackList.slice(0,4)" 
          :dot-color="feedback.feedback_type === 'Complaint' ? 'red' : 'blue'" :key="index" small>
            <template #opposite>
              <span>{{ feedback.date }}</span>
            </template>
            {{ feedback.feedback_details }}
            <v-chip class="ma-2" small :color="feedback.feedback_type === 'Complaint' ? 'red' : 'blue'" dark>
              {{ feedback.feedback_type }}
            </v-chip>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';

  const customerSatisfactionStores = useCustomerSatisfactionStore();
  const { feedbackList } = customerSatisfactionStores;

  const filteredFeedbackList = computed(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return feedbackList.filter(feedback => {
      if(feedback.date){
        const dateParts = feedback.date.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; 
        const day = parseInt(dateParts[2]);
        const date = new Date(year, month, day);
        const feedbackDate = new Date(year, month, day);
        const feedbackMonth = feedbackDate.getMonth();
        const feedbackYear = feedbackDate.getFullYear();

        return feedbackMonth === currentMonth && feedbackYear === currentYear;
      }
      
    });
  });
  
  </script>
  