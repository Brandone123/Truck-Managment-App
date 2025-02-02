<!-- src/components/training/trainingQuiz/QuizSettingsComponent.vue -->
<template>
    <div>
      <v-card>
        <v-card-title>
          Settings
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openEditSettingsDialog">
            <v-icon left>mdi-pencil</v-icon>
            Edit Settings
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div><strong>Passing Score:</strong> {{ quiz?.settings.passingScore }}%</div>
          <div><strong>Time Limit:</strong> {{ quiz?.settings.timeLimit }} minutes</div>
          <div><strong>Attempts Allowed:</strong> {{ quiz?.settings.attemptsAllowed }}</div>
        </v-card-text>
      </v-card>
  
      <!-- Edit Settings Dialog -->
      <v-dialog v-model="isEditSettingsDialogOpen" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Quiz Settings</span>
          </v-card-title>
  
          <v-divider></v-divider>
  
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="saveSettings">
              <!-- Passing Score -->
              <v-text-field
                v-model="settings.passingScore"
                label="Passing Score (%)"
                type="number"
                :rules="[rules.required, rules.percentage]"
                prepend-inner-icon="mdi-percent"
                required
              ></v-text-field>
  
              <!-- Time Limit -->
              <v-text-field
                v-model="settings.timeLimit"
                label="Time Limit (minutes)"
                type="number"
                :rules="[rules.required, rules.positive]"
                prepend-inner-icon="mdi-timer"
                required
              ></v-text-field>
  
              <!-- Attempts Allowed -->
              <v-text-field
                v-model="settings.attemptsAllowed"
                label="Attempts Allowed"
                type="number"
                :rules="[rules.required, rules.positive]"
                prepend-inner-icon="mdi-redo-variant"
                required
              ></v-text-field>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeEditSettingsDialog">Cancel</v-btn>
                <v-btn text type="submit" :disabled="!valid">
                  Save
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
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
  import { ref, reactive } from 'vue';
  import { useTrainingQuizStore } from '@/stores/training/trainingQuizStore';
  import type { Quiz, QuizSettings } from '@/types/training/trainingQuiz';
  
  const props = defineProps<{
    quiz: Quiz | undefined;
  }>();
  
  const quizStore = useTrainingQuizStore();
  
  // Dialog state
  const isEditSettingsDialogOpen = ref(false);
  
  // Snackbar
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  });
  
  // Form state
  const valid = ref(false);
  const settings = reactive<QuizSettings>({
    passingScore: props.quiz?.settings.passingScore || 50,
    timeLimit: props.quiz?.settings.timeLimit || 30,
    attemptsAllowed: props.quiz?.settings.attemptsAllowed || 3,
  });
  
  // Rules
  const rules = {
    required: (value: any) => !!value || 'Required.',
    percentage: (value: number) => (value >= 0 && value <= 100) || 'Must be between 0 and 100.',
    positive: (value: number) => (value > 0) || 'Must be positive.',
  };
  
  /**
   * Open the edit settings dialog.
   */
  function openEditSettingsDialog() {
    // Initialize settings with current quiz settings
    if (props.quiz?.settings) {
      settings.passingScore = props.quiz.settings.passingScore;
      settings.timeLimit = props.quiz.settings.timeLimit;
      settings.attemptsAllowed = props.quiz.settings.attemptsAllowed;
    }
    isEditSettingsDialogOpen.value = true;
  }
  
  /**
   * Close the edit settings dialog.
   */
  function closeEditSettingsDialog() {
    isEditSettingsDialogOpen.value = false;
  }
  
  /**
   * Handle form submission to save settings.
   */
  async function saveSettings() {
    if (!props.quiz) return;
    await quizStore.updateSettings(props.quiz.id, { ...settings });
    snackbar.value = {
      show: true,
      message: 'Settings updated successfully.',
      color: 'success',
    };
    isEditSettingsDialogOpen.value = false;
  }
  </script>
  
  <style scoped>
  .headline {
    font-weight: bold;
  }
  </style>
  