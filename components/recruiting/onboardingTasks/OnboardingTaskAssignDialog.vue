<template>
    <v-dialog v-model="dialog" max-width="600px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ task.assigned_to ? 'Edit Supervisor' : 'Add Supervisor' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
  
        <v-card-text>
          <v-form ref="assignForm">
            <v-container>
              <v-row>
                <v-col cols="12">
                <EmployeeAutoCompleteInput v-model="currentTask.assigned_to" item-value="id" item-title="full_name"
                    variant="outlined" flat density="compact" label="Select Supervisor" color="primary" :rules="[rules.required]" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
  
        <v-divider></v-divider>
  
        <v-card-actions>
          <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveTask">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  
  <script setup lang="ts">
  import { defineProps, ref, watch, computed} from 'vue';
  import EmployeeAutoCompleteInput from '~/components/shared/input/EmployeeAutoCompleteInput.vue';
  import type { OnboardingTask } from '@/types/recruiting/onboardingOrientation';
  
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

const rules = {
  required: (value: any) => !!value || 'Required',
};

watch(
  () => props.task,
  (newTask) => {
    currentTask.value = { ...newTask };
  },
  { immediate: true }
);

const assignForm = ref<HTMLFormElement | null>(null);

const saveTask = async () => {
  const isValid = await assignForm.value?.validate();
  if (!isValid) return;

  emit('save', {
    ...currentTask.value,
    assigned_to: currentTask.value.assigned_to
});

dialog.value = false
};
</script>

<style scoped>
/* Add your styles here */
</style>