<!-- src/components/training/trainingQuiz/QuestionForm.vue -->
<template>
    <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
      <!-- Question Text -->
      <v-text-field
        v-model="formData.questionText"
        label="Question Text"
        :rules="[v => !!v || 'Question text is required']"
        required
      ></v-text-field>
  
      <!-- Question Type -->
      <v-select
        v-model="formData.type"
        :items="questionTypes"
        label="Question Type"
        :rules="[v => !!v || 'Question type is required']"
        required
        @change="onTypeChange"
      ></v-select>
  
      <!-- Multiple Choice Options -->
      <div v-if="formData.type === 'multiple-choice'">
        <p class="subheader">Options</p>
        <v-row v-for="(option, index) in formData.options" :key="index" align="center">
          <v-col cols="10">
            <v-text-field
              v-model="option.text"
              :label="`Option ${index + 1}`"
              :rules="[v => !!v || 'Option text is required']"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-radio-group v-model="formData.correctOptionIndex" row>
              <v-radio :label="'Correct'" :value="index"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-btn icon small @click="addOption">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn icon small @click="removeOption" :disabled="formData.options.length <= 2">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </div>
  
      <!-- Other question types can be handled here -->
  
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('cancel')">Cancel</v-btn>
        <v-btn text type="submit" :disabled="!valid">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, reactive } from 'vue';
  import type { QuizQuestion } from '@/types/training/trainingQuiz';
  
  const props = defineProps<{
    question: QuizQuestion | null;
    isEditMode: boolean;
  }>();
  
  const emit = defineEmits(['save', 'cancel']);
  
  const valid = ref(false);
  
  // Initialize form data
  const formData = reactive<Partial<QuizQuestion>>({
    questionText: '',
    type: 'multiple-choice',
    options: [{ text: '' }, { text: '' }],
    correctOptionIndex: 0,
  });
  
  // If editing, populate the form data
  if (props.isEditMode && props.question) {
    formData.questionText = props.question.questionText;
    formData.type = props.question.type;
    formData.options = props.question.options.map((opt) => ({ text: opt }));
    formData.correctOptionIndex = props.question.correctOptionIndex;
  }
  
  // Watch for type changes
  function onTypeChange(newType: string) {
    if (newType !== 'multiple-choice') {
      formData.options = [];
    } else if (formData.options.length < 2) {
      formData.options = [{ text: '' }, { text: '' }];
    }
  }
  
  const questionTypes = ['multiple-choice', 'true/false', 'short-answer'];
  
  /**
   * Add a new option for multiple-choice questions.
   */
  function addOption() {
    formData.options.push({ text: '' });
  }
  
  /**
   * Remove the last option, ensuring at least two options remain.
   */
  function removeOption() {
    if (formData.options.length > 2) {
      formData.options.pop();
    }
  }
  
  /**
   * Handle form submission.
   */
  function submitForm() {
    // Validate the form
    if (formData.type === 'multiple-choice') {
      // Ensure at least two options
      if (formData.options.length < 2) {
        return;
      }
      // Ensure all options have text
      for (const option of formData.options) {
        if (!option.text.trim()) {
          return;
        }
      }
      // Ensure correctOptionIndex is valid
      if (
        typeof formData.correctOptionIndex !== 'number' ||
        formData.correctOptionIndex < 0 ||
        formData.correctOptionIndex >= formData.options.length
      ) {
        return;
      }
    }
  
    // Emit the save event with the form data
    emit('save', { ...formData });
  }
  </script>
  
  <style scoped>
  .subheader {
    font-weight: bold;
    margin-top: 16px;
    margin-bottom: 8px;
  }
  </style>
  