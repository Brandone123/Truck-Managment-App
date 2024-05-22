<template>
  <!-- <v-card class="mb-4">
    <v-card-title>Add New Question</v-card-title>
    <v-card-text> -->
      <v-row>
        <v-col cols="12">
          <v-text-field density="comfortable" variant="outlined" label="Question Text" v-model="newQuestion.text"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-select density="comfortable" variant="outlined" :items="questionTypes" label="Question Type" v-model="newQuestion.type"
            @change="onTypeChange"></v-select>
        </v-col>
        <v-col cols="12" v-if="newQuestion.type === 'multiple-choice'">
          <p class="subheader">Options</p>
          <v-text-field v-for="(option, index) in newQuestion.options" :key="index" label="Option Text"
            v-model="option.text" density="comfortable" variant="outlined"></v-text-field>
          <v-btn icon small @click="addOption">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-btn color="success" density="comfortable" @click="submitQuestion">Add Question</v-btn>
        </v-col>
      </v-row>
    <!-- </v-card-text>
  </v-card> -->
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['question-created'])

const questionTypes = ['multiple-choice', 'true/false', 'short-answer'];

const newQuestion = ref({
  text: '',
  type: '',
  options: [{ text: '' }, { text: '' }],
  correctAnswer: null
});

function addOption() {
  newQuestion.value.options.push({ text: '' });
}

function onTypeChange() {
  if (newQuestion.value.type !== 'multiple-choice') {
    newQuestion.value.options = [];
  }
}

function submitQuestion() {
  emit('question-created', { ...newQuestion.value });
  // Reset form after submission
  newQuestion.value = {
    text: '',
    type: 'multiple-choice',
    options: [{ text: '' }, { text: '' }],
    correctAnswer: null
  };
}
</script>