<!-- src/components/recruiting/applicationManagement/dialogs/CandidateFeedbackEditDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ feedback?.id ? 'Edit Candidate Feedback' : 'Add Candidate Feedback' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="feedbackForm" @submit.prevent="submitForm">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-textarea label="Feedback Details" v-model="currentFeedback.feedback_details"
                  :rules="[rules.required]" variant="outlined" density="comfortable"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submitForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import type { CandidateFeedback, Applicant } from '@/types/recruiting/recruitment';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  feedback: {
    type: Object as () => any,
    default: null,
  },
});

// Emits
const emit = defineEmits(['update:modelValue', 'close', 'save']);

// Dialog visibility
const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

// Current feedback form data
const currentFeedback = ref<Partial<any>>({ ...props.feedback });

// Watch for changes in feedback prop to update form data
watch(
  () => props.feedback,
  (newFeedback) => {
    currentFeedback.value = { ...newFeedback };
  }
);

// Menu for date picker
const menu = ref(false);

// Validation rules
const rules = {
  required: (value: any) => !!value || 'Required',
};

// Reference to the form
const feedbackForm = ref<HTMLFormElement | null>(null);

// Submit form
const submitForm = async () => {
  const isValid = await feedbackForm.value?.validate();
  if (!isValid) return;

  emit('save', {
    ...currentFeedback.value,
    application_id: parseInt(route.params.applicationId as string, 10),
    feedback_details: currentFeedback.value.feedback_details
  });
};

// Close dialog
const closeDialog = () => {
  emit('close');
};
</script>

<style scoped>
/* Add your custom styles here */
</style>