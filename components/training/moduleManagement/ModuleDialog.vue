<!-- src/components/training/moduleManagement/ModuleDialog.vue -->

<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isEdit ? 'Edit Module' : 'Add New Module' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <!-- Course Selection Dropdown -->
            <v-select
              v-model="tempModule.courseId"
              :items="courseOptions"
              item-title="name"
              item-value="id"
              label="Select Course"
              :rules="[v => !!v || 'Course is required']"
              required
            ></v-select>
  
            <!-- Module Title -->
            <v-text-field
              v-model="tempModule.title"
              label="Module Title"
              :rules="[v => !!v || 'Title is required']"
              required
            ></v-text-field>
  
            <!-- Module Description -->
            <v-textarea
              v-model="tempModule.description"
              label="Module Description"
              auto-grow
            ></v-textarea>
  
            <!-- Active Switch -->
            <v-switch
              v-model="tempModule.active"
              label="Active?"
              class="mt-4"
            ></v-switch>
  
            <!-- Optionally, handle file uploads or other fields here -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text :disabled="!valid" @click="saveModule">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import type { TrainingModule, Course } from '@/types/training/trainingModule';
  
  interface Props {
    isEdit: boolean;
    module?: TrainingModule | null;
    courses: Course[]; // Receive courses from parent
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', moduleData: Partial<TrainingModule>): void;
  }>();
  
  const dialog = ref(true);
  const valid = ref(false);
  
  // Temp module data for form
  const tempModule = ref<Partial<TrainingModule>>({
    courseId: null,
    title: '',
    description: '',
    active: true,
    notes: [],
    materials: [],
    chapters: [],
  });
  
  // Populate form if editing
  watch(
    () => props.module,
    (newVal) => {
      if (newVal) {
        tempModule.value = { ...newVal };
      } else {
        // Reset for new module
        tempModule.value = {
          courseId: props.courses.length ? props.courses[0].id : null,
          title: '',
          description: '',
          active: true,
          notes: [],
          materials: [],
          chapters: [],
        };
      }
    },
    { immediate: true },
  );
  
  // Prepare course options for dropdown
  const courseOptions = computed(() => props.courses);
  
  // Determine if in edit mode
  const isEdit = computed(() => props.isEdit);
  
  function closeDialog() {
    dialog.value = false;
    emit('close');
  }
  
  function saveModule() {
    if (!valid.value) return;
    emit('save', { ...tempModule.value });
    dialog.value = false;
  }
  </script>
  
  <style scoped>
  /* Add any styling for the dialog here */
  </style>
  