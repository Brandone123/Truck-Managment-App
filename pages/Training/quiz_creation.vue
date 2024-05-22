<template>
  <div>
    <!-- Page Title -->
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Create/Edit Quiz</span>
    </div>
    <v-card>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- Quiz Title -->
          <v-text-field density="comfortable" variant="outlined" v-model="quiz.title"
            :rules="[v => !!v || 'Title is required']" label="Quiz Title" required></v-text-field>

          <!-- Quiz Description -->
          <v-textarea density="comfortable" variant="outlined" v-model="quiz.description" label="Description"
            rows="3"></v-textarea>

          <!-- Associated Training Module/Program -->
          <v-select density="comfortable" variant="outlined" v-model="quiz.associatedModule" :items="modules"
            item-title="name" item-value="id" label="Associated Module/Program"></v-select>

          <v-divider class="my-4"></v-divider>
 
          <!-- Quiz Settings -->
          <div class=" subheader text-h6">Quiz Settings</div>
          <quiz-settings :settings="quiz.settings"></quiz-settings>

          <v-divider class="my-4"></v-divider>

          <!-- Questions List from Existing List -->
          <div class=" subheader text-h6">Select Questions from Existing List</div>
          <quiz-questions-list :questions="quiz.questions" @remove-question="removeQuestion"></quiz-questions-list>

          <!-- Question Creation -->
          <v-subheader class="text-h6 my-4">Create New Question</v-subheader>
          <question-creation @add-new-question="addQuestion"></question-creation>

          <v-btn :disabled="!valid" color="primary" @click="saveQuiz">Save Quiz</v-btn>
          </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QuizQuestionsList from '@/components/training/quizCreation/QuizQuestionsList.vue';
import QuestionCreation from '@/components/training/quizCreation/QuestionCreation.vue';
import QuizSettings from '@/components/training/quizCreation/QuizSettings.vue';

const valid = ref(true);

interface Question {
  id?: number;
  type: string;
  text: string;
}

interface QuizSettings {

}

interface Quiz {
  id?: number;
  title: string;
  description: string;
  associatedModule: number | null;
  questions: Question[];
  settings: QuizSettings;
}

const quiz = ref<Quiz>({
  title: '',
  description: '',
  associatedModule: null,
  questions: [
    {id:1, type: 'multiple-choice', text:'question 1 text'},
    {id:2, type: 'multiple-choice', text:'question 2 text'},
    {id:3, type: 'multiple-choice', text:'question 3 text'},
  ],
  settings: {}
});

const modules = ref([
  { id: 1, name: 'Module 1: Introduction' },
  { id: 2, name: 'Module 2: Safety Training' },
  // Add more modules as needed
]);

const addQuestion = (newQuestion: Question) => {
  quiz.value.questions.push(newQuestion);
};

const removeQuestion = (index: number) => {
  quiz.value.questions.splice(index, 1);
};

const saveQuiz = () => {
  if (valid.value) {
    // Here you would implement the API call to save the quiz, using quiz.value for the payload
    console.log('Saving quiz:', quiz.value);
  }
};
</script>