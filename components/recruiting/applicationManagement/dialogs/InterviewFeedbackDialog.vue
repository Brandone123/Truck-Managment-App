<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <!-- Toolbar -->
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Interview Feedback</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Card Content -->
      <v-card-text>
        <v-form ref="feedbackForm">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  label="Feedback Details"
                  v-model="feedBack"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="comfortable"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <!-- Divider -->
      <v-divider></v-divider>

      <!-- Card Actions -->
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="primary" @click="submit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, computed } from 'vue';
import type { Interview } from '@/types/recruiting/recruitment';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();

// Auth Store
const auth = useAuthStore();

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  feedback: {
    type: Object as () => Interview | null,
    default: null,
  },
});

// Emits
const emit = defineEmits(['update:modelValue', 'close', 'save']);

// Validation Rules
const rules = {
  required: (value: any) => !!value || 'Required',
};

// Reactive Data
const currentInterview = ref<Partial<Interview>>({ ...props.feedback });
const feedBack = ref('');

// Computed Property: Dialog Visibility
const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

// Watcher: Resets Feedback Data When Prop Changes
watch(
  () => props.feedback,
  () => {
    feedBack.value = '';
  },
  { immediate: true }
);

// Form Reference
const feedbackForm = ref<HTMLFormElement | null>(null);

// Submit Function
const submit = async () => {
  const isValid = await feedbackForm.value?.validate();
  if (!isValid) return;

  // Initialize the feedback array if not already present
  if(!currentInterview.value.interview_feedback){
    currentInterview.value.interview_feedback = []
  }

  currentInterview.value.interview_feedback.push({
      author: auth?.user?.name,
      feedback_details: feedBack.value,
      created_at: new Date().toISOString(),
    })

  // Emit the updated interview object
  emit('save', {
    ...currentInterview.value,
    application_id: parseInt(route.params.applicationId as string, 10),
  });

  // Close the dialog
  dialog.value = false;
};
</script>