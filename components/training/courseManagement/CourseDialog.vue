<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Edit Course' : 'Add New Course' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <v-switch
              v-model="courseData.active"
              label="Course Active?"
              class="mb-4"
            />
            <v-text-field
              v-model="courseData.name"
              label="Course Name"
              :rules="[v => !!v || 'Name is required']"
              required
            ></v-text-field>
            <v-textarea
              v-model="courseData.description"
              label="Description"
            ></v-textarea>
            <!-- Additional fields or module references as needed -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text :disabled="!isFormValid" @click="saveCourse">
            {{ isEdit ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import type { Course } from '@/types/training/course';
  
  interface Props {
    isEdit: boolean;
    course?: Course | null;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', courseData: Partial<Course>): void;
  }>();
  
  const dialog = ref(true);
  const isFormValid = ref(false);
  
  const courseData = ref<Partial<Course>>({
    active: true,
    name: '',
    description: '',
    modules: [],
  });
  
  const isEdit = computed(() => props.isEdit);
  
  watch(
    () => props.course,
    (newVal) => {
      if (newVal) {
        courseData.value = { ...newVal };
      } else {
        // Reset for a new course
        courseData.value = {
          active: true,
          name: '',
          description: '',
          modules: [],
        };
      }
    },
    { immediate: true },
  );
  
  function closeDialog() {
    dialog.value = false;
    emit('close');
  }
  
  function saveCourse() {
    if (!isFormValid.value) return;
    emit('save', { ...courseData.value });
    dialog.value = false;
  }
  </script>
  
  <style scoped>
  /* Dialog styling here */
  </style>
  