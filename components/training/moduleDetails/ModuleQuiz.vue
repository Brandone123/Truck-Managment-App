<template>
  <v-card flat>
    <v-card-title>{{ quiz.title }}</v-card-title>
    <v-card-text>
      <v-form ref="form" @submit.prevent="submitQuiz">
        <ol class="px-5">
          <li v-for="(question, index) in quiz.questions" :key="index">
            <v-subheader>{{ question.text }}</v-subheader>
            <v-radio-group v-model="(answers as any)[index]">
              <v-radio v-for="(option, optionIndex) in question.options" :key="optionIndex" :label="option.text"
                :value="option.id"></v-radio>
            </v-radio-group>
          </li>
        </ol>
        <v-btn type="submit" color="primary" density="comfortable" class="text-none">Submit Quiz</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface QuizOption {
  id: number;
  text: string;
}

interface QuizQuestion {
  text: string;
  options: QuizOption[];
}

interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

const quiz = ref<Quiz>({
  title: 'Module 1 Quiz',
  questions: [
    {
      text: 'What is the main focus of this module?',
      options: [
        { id: 1, text: 'Safety' },
        { id: 2, text: 'Efficiency' },
        { id: 3, text: 'Cost-saving' },
      ],
    },
    {
      text: 'Which of the following is a key component of our product?',
      options: [
        { id: 1, text: 'Feature A' },
        { id: 2, text: 'Feature B' },
        { id: 3, text: 'Feature C' },
      ],
    },
    // ... more questions
  ],
});

const answers = ref<Object>({});

const form = ref(null);

function submitQuiz() {
  console.log('Submitted answers:', answers.value);
  // You might want to process the quiz results here or send them to an API endpoint
  // After submission, you can clear the form or give feedback to the user
  // form.value.reset();
}
</script>