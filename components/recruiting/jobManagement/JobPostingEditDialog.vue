<!-- src/components/recruiting/jobManagement/JobPostingEditDialog.vue -->
<template>
  <v-dialog v-model="dialog" max-width="700px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>
          {{ jobPosting?.id ? 'Edit Job Posting' : 'Create Job Posting' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="jobPostingForm">
          <v-row>
            <!-- Single Job Selection -->
            <v-col cols="12">
              <JobAutocompleteInput :readonly="currentJobPosting.id" persistent-hint :hint="currentJobPosting.id ? 'Job can not be updated' : ''" v-model="currentJobPosting.job_id"  item-value="id" label="Select Job" color="primary" :rules="[validation.required]"/>
            </v-col>

            <v-col cols="12" md="6">
              <v-select variant="outlined" flat density="compact" v-model="currentJobPosting.status"
                :items="jobPostingStatuses" label="Status" :rules="[validation.required]" required></v-select>
            </v-col>

            <!-- Single Platform Selection -->
            <v-col cols="12" md="6">
              <v-select variant="outlined" flat density="compact" v-model="currentJobPosting.platform"
                :items="dummyPlatforms" label="Select Platform" placeholder="Select Platform" item-text="title" item-value="name"
                :rules="[validation.required]" required></v-select>
            </v-col>

            <v-col cols="12">
              <v-text-field variant="outlined" flat density="compact" v-model="currentJobPosting.posting_url"
                label="Posting URL" type="url" :rules="[validation.url]"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveJobPosting">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { PropType } from 'vue';
import type { Job, JobPosting } from '@/types/recruiting/jobManagement';
import JobAutocompleteInput from './components/JobAutocompleteInput';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  jobPosting: {
    type: Object as PropType<Partial<JobPosting>>,
    required: true,
  },
  dummyPlatforms: {
    type: Array as PropType<{ title: string; name: string }[]>,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentJobPosting = ref<Partial<JobPosting>>({ ...props.jobPosting });
const jobPostingStatuses = ['Active', 'Inactive'];


watch(
  () => props.jobPosting,
  (newJobPosting) => {
    currentJobPosting.value = { ...newJobPosting };
    // Ensure fields are not arrays
    if (!currentJobPosting.value.job_id) currentJobPosting.value.job_id = undefined;
    if (!currentJobPosting.value.platform) currentJobPosting.value.platform = '';
  }
);

const jobPostingForm = ref<HTMLFormElement | null>(null);
const showDatePickerMenu = ref(false);

const saveJobPosting = async () => {
  const formStatus = await jobPostingForm.value?.validate();
  if (!formStatus.valid) return;

  emit('save', currentJobPosting.value);
};
</script>

<style scoped>
/* Add your styles here */
</style>