<!-- src/components/recruiting/ApplicationFormEditDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="900px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title>{{ applicationForm?.id ? 'Edit Application Form' : 'Create Application Form'
          }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="applicationFormRef">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field variant="outlined" flat density="compact" label="Form Name"
                  v-model="currentApplicationForm.name" :rules="[validation.required, uniqueName]"
                  required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea variant="outlined" flat density="compact" label="Description"
                  v-model="currentApplicationForm.description" :rules="[validation.required]"
                  required></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveApplicationForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue';
import type { ApplicationForm } from '@/types/recruiting/applicantApplication';
import { ApplicantApplicationStore } from '~/stores/recruiting/applicationManagement/applicantApplicationStore';
import { storeToRefs } from 'pinia';
import { useValidation } from '~/composables/formValidation';
import type { JobPosting } from '@/types/recruiting/jobManagement';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  applicationForm: {
    type: Object as PropType<Partial<ApplicationForm>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const validation = useValidation();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const jobManagementStore = JobManagementStore();
const { jobPostings } = storeToRefs(jobManagementStore);

const currentJobPosting = ref<Partial<JobPosting>>({});

const applicantApplicationStore = ApplicantApplicationStore();
const { applicationForms } = storeToRefs(applicantApplicationStore);

const currentApplicationForm = ref<Partial<ApplicationForm>>({ ...props.applicationForm });

watch(
  () => props.applicationForm,
  (newForm) => {
    currentApplicationForm.value = { ...newForm };
  }
);

const jobTypes = ['Driver', 'Office Staff', 'Other'];

const uniqueName = (value: any) => {
  const isDuplicate = (applicationForms.value || []).some(
    (applicationForm) =>
      applicationForm.name?.toLowerCase() === value?.toLowerCase() &&
      applicationForm.id != props.applicationForm?.id
  );

  return !isDuplicate ? true : 'Application Form name already exists';
};

const applicationFormRef = ref<HTMLFormElement | null>(null);

const saveApplicationForm = async () => {
  const isValid = await applicationFormRef.value?.validate();
  if (!isValid) return;

  emit('save', {
    ...currentApplicationForm.value,
  });
};
</script>