<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Reference Feedback</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
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
      <v-divider></v-divider>
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
import type { Interview, Reference } from '@/types/recruiting/recruitment';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();

const auth = useAuthStore();

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  feedbackReference: {
    type: Object as () => Reference | null,
    default: null,
  },
});

// Emits
const emit = defineEmits(['update:modelValue', 'close', 'save']);

// Rules for form validation
const rules = {
  required: (value: any) => !!value || 'Required',
};

const referenceFeedback = ref<Partial<Reference>>({ ...props.feedbackReference });

// Current feedback form data
const feedBack = ref('');

// Watch for changes in feedback prop to update form data
watch(
  () => props.feedbackReference,
  (newFeedback) => {
    feedBack.value = '';
  },
  { immediate: true }
);

// Dialog visibility
const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

// Reference to the form
const feedbackForm = ref<HTMLFormElement | null>(null);

// Submit form
const submit = async () => {
  const isValid = await feedbackForm.value?.validate();
  if (!isValid) return;

  const currentMessage = feedBack.value;

  if (!referenceFeedback.value?.reference_feedback) {
      referenceFeedback.value.reference_feedback = [];
    }

    referenceFeedback.value.reference_feedback.push({
      author: auth?.user?.name,
      feedback_details: currentMessage,
      created_at: new Date().toISOString(),
    });
  
    // Save reference feedback
    emit('save', {
      ...referenceFeedback.value,
      application_id: parseInt(route.params.applicationId as string, 10),
    });

  dialog.value = false;
};
</script>