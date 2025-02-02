<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ currentTask.id ? 'Edit Task' : 'Add Task' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="taskForm">
          <v-row>
            <v-col cols="12" md="6">
              <TaskCategoryAutoCompleteInput :readonly="currentTask.id" persistent-hint
                :hint="currentTask.id ? 'Task Category can not be updated' : ''" v-model="currentTask.task_category_id"
                item-value="id" label="Select Task Category" color="primary" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="6">
              <ApplicationAutocompleteInput :readonly="currentTask.id" persistent-hint
                :hint="currentTask.id ? 'Application can not be updated' : ''" v-model="currentTask.application_id"
                item-value="id" label="Select Application" color="primary" :rules="[rules.required]" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select variant="outlined" flat density="compact" label="Status" :items="statusOptions"
                v-model="currentTask.status" :rules="[rules.required]" required></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" flat density="compact" v-model="currentTask.due_date" label="Due Date"
                type="date" :rules="[rules.required]" :min="minDate"></v-text-field>
            </v-col>
            <!-- <v-col cols="12" md="6">
              <EmployeeAutoCompleteInput v-model="currentTask.assigned_to" item-value="id" item-title="full_name"
                 variant="outlined" flat density="compact" label="Select Supervisor" color="primary" :rules="[rules.required]" />
            </v-col> -->
            <!-- <v-col cols="12">
              <v-textarea variant="outlined" flat density="compact" label="Description"
                v-model="currentTask.description" auto-grow></v-textarea>
            </v-col> -->
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveTask">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, computed } from 'vue';
import type { OnboardingTask } from '@/types/recruiting/onboardingOrientation';
import { ApplicantApplicationStore } from '~/stores/recruiting/applicationManagement/applicantApplicationStore';
import { storeToRefs } from 'pinia';
import ApplicationAutocompleteInput from '../applicationManagement/components/ApplicationAutocompleteInput.vue';
import EmployeeAutoCompleteInput from '~/components/shared/input/EmployeeAutoCompleteInput.vue';
import TaskCategoryAutoCompleteInput from './components/TaskCategoryAutoCompleteInput.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  task: {
    type: Object as PropType<Partial<OnboardingTask>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentTask = ref<Partial<OnboardingTask>>({ ...props.task });

const applicantStore = ApplicantApplicationStore();
const { applications } = storeToRefs(applicantStore);

if (!applications.value.length) {
  applicantStore.fetchApplications();
}

const statusOptions = ['Not Started', 'In Progress', 'Completed'];

const rules = {
  required: (value: any) => !!value || 'Required',
};

const getMinDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const minDate = ref(getMinDate()); 

watch(
  () => props.task,
  (newTask) => {
    currentTask.value = { ...newTask };
  },
  { immediate: true }
);

const taskForm = ref<HTMLFormElement | null>(null);

const saveTask = async () => {
  const isValid = await taskForm.value?.validate();
  if (!isValid) return;

  emit('save', currentTask.value);
};
</script>

<style scoped>
/* Add your styles here */
</style>
