<!-- src/components/recruiting/applicationManagement/dialogs/InterviewEditDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ interview?.id ? 'Edit Interview' : 'Add Interview' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="interviewForm" @submit.prevent="submitForm">
          <v-container>
            <v-row>
              <!-- Job Selection -->
              <!-- <v-col cols="12">
                  <JobAutocompleteInput :readonly="currentInterview.id" persistent-hint
                    :hint="currentInterview.id ? 'Job can not be updated' : ''" v-model="currentInterview.job_id"
                    item-value="id" label="Select Job" color="primary"  :rules="[rules.required]" />
                </v-col> -->

              <v-col cols="12">
                <EmployeeAutoCompleteInput variant="outlined" density="comfortable"
                  v-model="currentInterview.interviewers" item-value="id" label="Select Interviewers" color="primary"
                  multiple :rules="[rules.required]" />
              </v-col>

              <!-- Interview Date -->

              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required, validateStartTime]" density="comfortable"
                  label="Start Time*" v-model="currentInterview.interview_start_date" variant="outlined"
                  type="datetime-local" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required, validateEndTime]" density="comfortable" label="End Time*"
                  v-model="currentInterview.interview_end_date" variant="outlined" type="datetime-local"
                  :disabled="!currentInterview.interview_start_date" />
              </v-col>

              <!-- Interview Status -->
              <v-col cols="12" md="6">
                <v-select label="Interview Status" :items="interviewStatuses"
                  v-model="currentInterview.interview_status" :rules="[rules.required]" variant="outlined"
                  density="comfortable"></v-select>
              </v-col>

              <!-- Interview Notes -->
              <v-col cols="12">
                <v-textarea label="Interview Notes" v-model="currentInterview.interview_notes" variant="outlined"
                  density="comfortable"></v-textarea>
              </v-col>

              <!-- Interview Feedback -->
              <!-- <v-col cols="12">
                <v-textarea label="Interview Feedback" v-model="currentInterview.interview_feedback" variant="outlined"
                  density="comfortable"></v-textarea>
              </v-col> -->
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
import type { Interview, Applicant, Job, User } from '@/types/recruiting/recruitment';
import JobAutocompleteInput from '@/components/recruiting/jobManagement/components/JobAutocompleteInput.vue';
import EmployeeAutoCompleteInput from '~/components/shared/input/EmployeeAutoCompleteInput.vue';
import { useRoute } from 'vue-router';
import moment from 'moment'

const route = useRoute();

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  interview: {
    type: Object as () => Interview | null,
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

// Current interview form data
const currentInterview = ref<Partial<Interview>>({ ...props.interview });

// Validation rules
const validateStartTime = (value: string) => {
  if (!value) return true;
  const now = moment().format('YYYY-MM-DDTHH:mm');
  return value >= now || 'Start Date cannot be in the past.';
}

const validateEndTime = (value: string) => {
  if (!value) return true;
  if (!currentInterview.value.interview_start_date) return 'Start Date must be selected first.';
  return value > currentInterview.value.interview_start_date || 'End Date must be after Start Time.';
}

// Watch for changes in interview prop to update form data
watch(
  () => props.interview,
  (newInterview) => {
    currentInterview.value = { ...newInterview };
  }
);

const interviewStatuses = ['Scheduled', 'Completed', 'Canceled'];

const rules = {
  required: (value: any) => !!value || 'Required',
};

// Reference to the form
const interviewForm = ref<HTMLFormElement | null>(null);

// Submit form
const submitForm = async () => {
  const isValid = await interviewForm.value?.validate();
  if (!isValid) return;
  emit('save', {
    ...currentInterview.value,
    application_id: parseInt(route.params.applicationId as string, 10)
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