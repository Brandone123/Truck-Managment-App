<template>
    <v-list dense>
      <v-list-item-group>
        <v-list-item v-for="faq in faqs" :key="faq.id">
          <v-list-item-content>
            <v-list-item-title>{{ faq.question }}</v-list-item-title>
            <v-list-item-subtitle v-for="answer in faq.answers" :key="answer.text">
              {{ answer.text }} - Votes: {{ answer.votes }}
              <v-btn icon small color="green" @click="voteAnswer(faq, answer)">
                <v-icon>mdi-thumb-up</v-icon>
              </v-btn>
            </v-list-item-subtitle>
            <AddAnswer :faqId="faq.id" @answer-added="addAnswer" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import AddAnswer from './AddAnswer.vue';
  
  const props = defineProps({
    faqs: Array
  });
  
  const voteAnswer = (faq, answer) => {
    answer.votes++;
  };
  
  const addAnswer = (faqId, answerText) => {
    const faq = props.faqs.find(f => f.id === faqId);
    if (faq) {
      faq.answers.push({ text: answerText, votes: 0 });
    }
  };
  </script>
  