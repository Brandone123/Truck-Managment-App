<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="mb-4" outlined>
            <v-card-title class="text-h5">Department FAQs</v-card-title>
            <v-card-text>
              <FAQList :faqs="faqs" />
              <AskQuestion @question-submitted="addQuestion" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import FAQList from '@/components/employeeInformationAndOperation/faq/FAQList.vue';
  import AskQuestion from '@/components/employeeInformationAndOperation/faq/AskQuestion.vue';
  
  const faqs = ref([
    // Sample FAQ data
    { id: 1, question: 'How do I reset my password?', answers: [{ text: 'Go to settings and click on "Reset Password".', votes: 3 }]},
    { id: 2, question: 'Where can I find the SOP documents?', answers: [{ text: 'SOP documents are available on the intranet.', votes: 5 }]},
  ]);
  
  const addQuestion = (newQuestion) => {
    const nextId = faqs.value.length + 1;
    faqs.value.push({ id: nextId, question: newQuestion, answers: [] });
  };
  </script>
  