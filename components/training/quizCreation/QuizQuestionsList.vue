<template>
    <v-card outlined class="mb-4">
      <v-card-title>Quiz Questions List</v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item-group v-model="selectedQuestions" multiple>
            <v-list-item
              v-for="(question, index) in questions"
              :key="index"
              @click="toggleSelection(question.id as number)"
            >
                <v-list-item-title>{{ question.text }}</v-list-item-title>
                <v-list-item-subtitle>Type: {{ question.type }}</v-list-item-subtitle>
              <v-list-item-action>
                <v-icon>
                  {{ selectedQuestions.includes(question.id as number) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                </v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-btn color="primary" @click="addSelectedQuestions">Add Selected Questions</v-btn>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps } from 'vue';
  
  interface Question {
    id?: number;
    type: string;
    text: string;
  }

  const props = defineProps({
    questions: Array<Question>
  });
  
  const emit = defineEmits(['add-questions',])

  const selectedQuestions = ref<number[]>([1]);
  
  // This method toggles the selection state of a question
  const toggleSelection = (questionId : number) => {
    const index = selectedQuestions.value.indexOf(questionId);
    if (index > -1) {
      selectedQuestions.value.splice(index, 1);
    } else {
      selectedQuestions.value.push(questionId);
    }
  };
  
  // This method emits an event to add the selected questions to the quiz
  const addSelectedQuestions = () => {
    emit('add-questions', selectedQuestions.value);
    selectedQuestions.value = []; // Reset selection after adding
  };
  </script>
  