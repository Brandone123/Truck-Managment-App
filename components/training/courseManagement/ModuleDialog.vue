<!-- src/components/training/courseManagement/ModuleDialog.vue -->

<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Edit Module' : 'Add New Module' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <!-- Module Title -->
            <v-text-field
              v-model="moduleData.title"
              label="Module Title"
              :rules="[v => !!v || 'Module title is required']"
              required
            ></v-text-field>
  
            <!-- Module Description -->
            <v-textarea
              v-model="moduleData.description"
              label="Module Description"
              :rules="[v => !!v || 'Module description is required']"
              required
            ></v-textarea>
  
            <!-- Content URL -->
            <v-text-field
              v-model="moduleData.contentUrl"
              label="Content URL"
              :rules="[v => !!v || 'Content URL is required', v => isValidUrl(v) || 'Invalid URL']"
              required
            ></v-text-field>
  
            <!-- Active Switch -->
            <v-switch
              v-model="moduleData.active"
              label="Active Module?"
            ></v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text :disabled="!isFormValid" @click="saveModule">
            {{ isEdit ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import type { TrainingModule } from '@/types/training/trainingModule';
  
  const props = defineProps<{
    isEdit: boolean;
    module?: TrainingModule | null;
  }>();
  
  const emit = defineEmits<{
    (e: 'close-dialog'): void;
    (e: 'save-module', moduleData: Partial<TrainingModule>): void;
  }>();
  
  const dialog = ref(true);
  const isFormValid = ref(false);
  
  // Local form data
  const moduleData = ref<Partial<TrainingModule>>({
    title: '',
    description: '',
    contentUrl: '',
    active: true,
  });
  
  // Watch for changes in the `module` prop to populate or reset form
  watch(
    () => props.module,
    (newVal) => {
      if (newVal) {
        // Editing
        moduleData.value = { ...newVal };
      } else {
        // Adding new module => reset fields
        moduleData.value = {
          title: '',
          description: '',
          contentUrl: '',
          active: true,
        };
      }
    },
    { immediate: true },
  );
  
  /**
   * Close the dialog without saving.
   */
  function closeDialog() {
    dialog.value = false;
    emit('close-dialog');
  }
  
  /**
   * Validate URL format.
   * @param url - The URL string to validate.
   * @returns Boolean indicating if the URL is valid.
   */
  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Save the module (add or update).
   */
  function saveModule() {
    if (!isFormValid.value) return;
    emit('save-module', { ...moduleData.value });
    dialog.value = false;
  }
  </script>
  
  <style scoped>
  .text-h5 {
    font-size: 1.25rem;
    font-weight: bold;
  }
  </style>
  