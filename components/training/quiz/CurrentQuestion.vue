<template>
  <div>
    <ol type="A">
      <li v-for="(currentQuestion, i) in questionList" :key="i">
        <div class="question-text" v-html="currentQuestion.text"></div>
        <div class="question-media" v-if="currentQuestion.mediaUrl">
          <img :src="currentQuestion.mediaUrl" :alt="`Question media`" class="media-image">
        </div>
        <v-radio-group v-model="selectedOption">
          <v-radio v-for="(option, j) in currentQuestion.answerOptions" :key="j" :label="option.text"
            :value="option.id"></v-radio>
        </v-radio-group>
      </li>
    </ol>

  </div>

  <!-- </v-card-text>
    </v-card> -->
</template>

<script setup lang="ts">
import { ref } from 'vue';


interface AnswerOption {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  mediaUrl?: string;
  answerOptions: AnswerOption[];
  correctAnswer: AnswerOption
}

// Sample data for the current question
const questionList = ref<Question[]>([
  {
    id: 1,
    text: 'What is the primary function of XYZ component in the ABC system?',
    mediaUrl: 'https://example.com/media/xyz-component.png',
    answerOptions: [
      { id: 1, text: 'Option A' },
      { id: 2, text: 'Option B' },
      { id: 3, text: 'Option C' },
      { id: 4, text: 'Option D' },
    ],
    correctAnswer: { id: 1, text: 'Option A' },
  }
]);

const selectedOption = ref<number | null>(null);

const submitAnswer = () => {
  console.log('Submitted answer ID:', selectedOption.value);
  // Here you might emit an event or make an API call to record the answer
  // For example, this.$emit('answer-submitted', selectedOption.value);
};

</script>

<style scoped>
.question-text {
  margin-bottom: 20px;
}

.media-image {
  max-width: 100%;
  height: auto;
}


</style>