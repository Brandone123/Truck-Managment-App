<!-- src/components/training/trainingQuiz/QuizQuestions.vue -->
<template>
    <div>
      <!-- Questions List -->
      <v-card>
        <v-card-title>
          Questions
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openAddQuestionDialog">
            <v-icon left>mdi-plus</v-icon>
            Add New Question
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="questionHeaders"
            :items="quiz?.questions || []"
            :items-per-page="5"
            class="elevation-1"
          >
            <template #item.options="{ item }">
              <ul>
                <li v-for="(option, index) in item.options" :key="index">
                  {{ index + 1 }}. {{ option }}
                </li>
              </ul>
            </template>
  
            <template #item.correctOption="{ item }">
              {{ item.options[item.correctOptionIndex] }}
            </template>
  
            <template #item.actions="{ item }">
              <v-btn color="info" small @click="openEditQuestionDialog(item)">
                <v-icon left>mdi-pencil</v-icon>
                Edit
              </v-btn>
              <v-btn color="red" small @click="confirmDeleteQuestion(item)">
                <v-icon left>mdi-delete</v-icon>
                Delete
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
  
      <!-- Add/Edit Question Dialog -->
      <v-dialog v-model="isQuestionDialogOpen" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ isEditMode ? 'Edit Question' : 'Add New Question' }}</span>
          </v-card-title>
  
          <v-divider></v-divider>
  
          <v-card-text>
            <QuestionForm
              :question="selectedQuestion"
              :is-edit-mode="isEditMode"
              @save="handleSaveQuestion"
              @cancel="closeQuestionDialog"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
  
      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete the question
            "<strong>{{ questionToDelete?.questionText }}</strong>"?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="red darken-1" text @click="handleDeleteQuestion">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Snackbar for Notifications -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.message }}
        <v-btn text @click="snackbar.show = false">Close</v-btn>
      </v-snackbar>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useTrainingQuizStore } from '@/stores/training/trainingQuizStore';
  import type { Quiz, QuizQuestion } from '@/types/training/trainingQuiz';
  import QuestionForm from '@/components/training/trainingQuiz/QuestionForm.vue';
  
  const props = defineProps<{
    quiz: Quiz | undefined;
  }>();
  
  const quizStore = useTrainingQuizStore();
  
  // Dialog state
  const isQuestionDialogOpen = ref(false);
  const isEditMode = ref(false);
  const selectedQuestion = ref<QuizQuestion | null>(null);
  
  // Delete confirmation
  const deleteDialog = ref(false);
  const questionToDelete = ref<QuizQuestion | null>(null);
  
  // Snackbar
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  });
  
  // Headers for the questions table
  const questionHeaders = [
    { title: 'ID', value: 'id' },
    { title: 'Question', value: 'questionText' },
    { title: 'Options', value: 'options' },
    { title: 'Correct Answer', value: 'correctOption' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];
  
  /**
   * Open the dialog to add a new question.
   */
  function openAddQuestionDialog() {
    isEditMode.value = false;
    selectedQuestion.value = null;
    isQuestionDialogOpen.value = true;
  }
  
  /**
   * Open the dialog to edit an existing question.
   * @param question - The question to edit.
   */
  function openEditQuestionDialog(question: QuizQuestion) {
    isEditMode.value = true;
    selectedQuestion.value = { ...question };
    isQuestionDialogOpen.value = true;
  }
  
  /**
   * Close the add/edit question dialog.
   */
  function closeQuestionDialog() {
    isQuestionDialogOpen.value = false;
  }
  
  /**
   * Handle saving a question (create or update).
   * @param questionData - The data from the form.
   */
  async function handleSaveQuestion(questionData: Partial<QuizQuestion>) {
    if (!props.quiz) return;
    if (isEditMode.value && selectedQuestion.value) {
      await quizStore.updateQuestion(props.quiz.id, selectedQuestion.value.id, questionData);
      snackbar.value = {
        show: true,
        message: 'Question updated successfully.',
        color: 'success',
      };
    } else {
      await quizStore.addQuestion(props.quiz.id, {
        quizId: props.quiz.id,
        questionText: questionData.questionText || '',
        options: questionData.options || [],
        correctOptionIndex: questionData.correctOptionIndex || 0,
        id: 0, // Will be set by the store
      });
      snackbar.value = {
        show: true,
        message: 'Question added successfully.',
        color: 'success',
      };
    }
    isQuestionDialogOpen.value = false;
  }
  
  /**
   * Open the delete confirmation dialog.
   * @param question - The question to delete.
   */
  function confirmDeleteQuestion(question: QuizQuestion) {
    questionToDelete.value = question;
    deleteDialog.value = true;
  }
  
  /**
   * Handle deleting a question.
   */
  async function handleDeleteQuestion() {
    if (!props.quiz || !questionToDelete.value) return;
    await quizStore.deleteQuestion(props.quiz.id, questionToDelete.value.id);
    snackbar.value = {
      show: true,
      message: 'Question deleted successfully.',
      color: 'success',
    };
    deleteDialog.value = false;
    questionToDelete.value = null;
  }
  </script>
  
  <style scoped>
  /* Add any necessary styles */
  </style>
  