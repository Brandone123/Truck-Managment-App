<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Edit Training Plan' : 'Add New Training Plan' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <!-- Program ID (if we let the user pick from existing programs, or default) -->
            <v-text-field
              v-model.number="planData.programId"
              label="Program ID"
              type="number"
            ></v-text-field>
  
            <v-text-field
              v-model="planData.name"
              label="Plan Name"
              :rules="[v => !!v || 'Name is required']"
              required
            ></v-text-field>
  
            <v-textarea
              v-model="planData.description"
              label="Description"
            ></v-textarea>
            <!-- Additional fields like courses, etc., can go here -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text :disabled="!isFormValid" @click="savePlan">
            {{ isEdit ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import type { TrainingPlan } from '@/types/training/trainingPlan';
  import { defineProps, defineEmits } from 'vue';
  
  interface Props {
    isEdit: boolean;
    plan?: TrainingPlan | null;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', planData: Partial<TrainingPlan>): void;
  }>();
  
  const dialog = ref(true);
  const isFormValid = ref(false);
  
  const planData = ref<Partial<TrainingPlan>>({
    programId: 1, // default
    name: '',
    description: '',
    courses: [],
  });
  
  const isEdit = computed(() => props.isEdit);
  
  // Watch for changes in the `plan` prop to populate or reset form
  watch(
    () => props.plan,
    (newVal) => {
      if (newVal) {
        planData.value = { ...newVal };
      } else {
        planData.value = {
          programId: 1, // or user picks from a dropdown
          name: '',
          description: '',
          courses: [],
        };
      }
    },
    { immediate: true },
  );
  
  function closeDialog() {
    dialog.value = false;
    emit('close');
  }
  
  function savePlan() {
    if (!isFormValid.value) return;
    emit('save', { ...planData.value });
    dialog.value = false;
  }
  </script>
  
  <style scoped>
  /* Add any additional styling for the dialog here */
  </style>
  