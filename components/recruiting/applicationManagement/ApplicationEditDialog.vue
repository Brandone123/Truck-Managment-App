<!-- src/components/recruiting/ApplicationEditDialog.vue -->
<template>
  <v-dialog v-model="dialog" fullscreen>
    <v-card class="grey-background" style="display: flex; flex-direction: column; height: 100vh;">
      <!-- Toolbar -->
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ application?.id ? 'Edit Application' : 'Add Application' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Scrollable Content -->
      <v-card-text style="flex: 1; overflow-y: auto; padding: 0;">
        <v-container  max-width="800">
          <v-card class="mb-2">
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <JobAutocompleteInput :readonly="currentApplication.id" persistent-hint
                    :hint="currentApplication.id ? 'Job can not be updated' : ''" v-model="currentApplication.job_id"
                    item-value="id" label="Select Job" color="primary" :rules="[validation.required]"
                    @selection="setSelectedJob" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <ApplicationResponse ref="application" v-if="currentForm" :form="currentForm.elements"
            v-model:responses="currentApplication.response_data" />
        </v-container>
      </v-card-text>

      <!-- Sticky Footer Actions -->
      <v-divider></v-divider>
      <v-card-actions style="position: sticky; bottom: 0; background: white; z-index: 10;">
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="primary" :disabled="!selectedJob" @click="saveApplication">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue';
import type { Application } from '@/types/recruiting/applicantApplication';
import { useValidation } from '~/composables/formValidation';
import ApplicationResponse from '@/components/recruiting/applicationManagement/components/ApplicationResponse.vue';
import JobAutocompleteInput from '@/components/recruiting/jobManagement/components/JobAutocompleteInput.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  application: {
    type: Object as PropType<Partial<Application>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const validation = useValidation();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});


interface ApplicantInstance {
  applicationForm: HTMLFormElement | null;
}

const application = ref<ApplicantInstance | null>(null);
const selectedJob = ref<any>(null);
const currentApplication = ref<Partial<Application>>({ ...props.application });

const currentForm = computed(() => {
  return selectedJob.value?.application_form?.current_version
});

const setSelectedJob = (job: any) => {
  selectedJob.value = job
}

const saveApplication = async () => {
  let formStatus = await application?.value?.applicationForm?.validate();
  if (!formStatus.valid) {
    return;
  }

  const payload: Partial<Application> = {
    ...currentApplication.value,
    response_data: currentApplication.value.response_data,
    form_id: selectedJob.value?.application_form_id,
    application_form_version_id: currentForm.value?.id,
    submission_source: 'Web Application'
  };

  emit('save', payload as Application);
};

watch(
  () => props.application,
  (newApplication) => {
    currentApplication.value = { ...newApplication };
  }
);

watch(() => dialog.value, (val) => {
  selectedJob.value = null
})
</script>

<style scoped>
/* Add your styles here */
</style>