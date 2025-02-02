<!-- src/components/training/programs/CourseDialog.vue -->

<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isNew ? 'New Course' : 'Edit Course' }}</span>
        </v-card-title>
  
        <v-divider></v-divider>
  
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="tempCourse.name"
                  label="Course Name"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="tempCourse.description"
                  label="Course Description"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="tempCourse.active"
                  label="Active Course?"
                ></v-switch>
              </v-col>
              <!-- Additional fields for course modules can be added here -->
            </v-row>
          </v-container>
        </v-card-text>
  
        <v-divider></v-divider>
  
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveCourse">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import type { Course } from '@/types/training/course';
  
  const props = defineProps<{
    isNew: boolean;
    courseToEdit?: Course | null;
  }>();
  
  const emit = defineEmits(['close-dialog', 'save-course']);
  
  // Controls if the dialog is visible
  const dialog = ref(true);
  
  // Local copy of the course data
  const tempCourse = ref<Partial<Course>>({
    name: '',
    description: '',
    active: true,
    modules: [],
  });
  
  // Watch for changes in `courseToEdit`
  watch(
    () => props.courseToEdit,
    (newVal) => {
      if (newVal) {
        // Editing
        tempCourse.value = { ...newVal };
      } else {
        // Creating new => reset fields
        tempCourse.value = {
          name: '',
          description: '',
          active: true,
          modules: [],
        };
      }
    },
    { immediate: true },
  );
  
  const isNew = computed(() => props.isNew);
  
  /**
   * Close the dialog without saving.
   */
  function closeDialog() {
    dialog.value = false;
    emit('close-dialog');
  }
  
  /**
   * Save the course (create or update).
   */
  function saveCourse() {
    emit('save-course', { ...tempCourse.value });
    dialog.value = false;
  }
  </script>
  
  <style scoped>
  .headline {
    font-weight: bold;
  }
  </style>
  