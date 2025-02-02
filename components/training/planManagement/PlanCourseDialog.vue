<!-- src/components/training/planManagement/PlanCourseDialog.vue -->

<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Edit Course in Plan' : 'Add Course to Plan' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <!-- Select Course -->
            <v-select
              v-model="selectedCourseId"
              :items="availableCourses"
              item-text="name"
              item-value="id"
              label="Select Course"
              :rules="[v => !!v || 'Course is required']"
              required
              :disabled="isEdit"
            ></v-select>
  
            <!-- Order -->
            <v-text-field
              v-model.number="courseOrder"
              label="Order"
              type="number"
              :rules="[v => v > 0 || 'Order must be a positive number']"
              required
            ></v-text-field>
  
            <!-- Required Switch -->
            <v-switch
              v-model="courseRequired"
              label="Required?"
            ></v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text :disabled="!isFormValid" @click="saveCourse">
            {{ isEdit ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import { useCourseStore } from '@/stores/training/courseStore';
  import type { PlanCourse } from '@/types/training/trainingPlan';
  import type { Course } from '@/types/training/course';
  
  const props = defineProps<{
    isEdit: boolean;
    course: PlanCourse | null;
  }>();
  
  const emit = defineEmits<{
    (e: 'close-dialog'): void;
    (e: 'save-course', courseData: Partial<PlanCourse>): void;
  }>();
  
  const dialog = ref(true);
  const isFormValid = ref(false);
  
  const courseStore = useCourseStore();
  
  // Local form data
  const selectedCourseId = ref<number | null>(null);
  const courseOrder = ref<number>(1);
  const courseRequired = ref<boolean>(true);
  
  // Computed: Available courses to add (excluding already added courses)
  const availableCourses = computed<Course[]>(() => {
    if (!props.course) {
      // When adding, exclude courses already in the plan
      // Assuming the parent component filters available courses
      return courseStore.courses.filter(c => true); // Adjust if necessary
    } else {
      // When editing, keep the current course
      return courseStore.courses;
    }
  });
  
  // Watch for changes in the `course` prop to populate or reset form
  watch(
    () => props.course,
    (newVal) => {
      if (newVal) {
        // Editing
        selectedCourseId.value = newVal.id;
        courseOrder.value = newVal.order;
        courseRequired.value = newVal.required;
      } else {
        // Adding new course to the plan
        selectedCourseId.value = null;
        courseOrder.value = 1;
        courseRequired.value = true;
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
   * Save the course (add or update) in the plan.
   */
  function saveCourse() {
    if (!isFormValid.value) return;
  
    const courseData: Partial<PlanCourse> = {
      id: selectedCourseId.value || 0, // `id` is required for editing
      title: getCourseTitle(selectedCourseId.value),
      order: courseOrder.value,
      required: courseRequired.value,
    };
  
    emit('save-course', courseData);
    dialog.value = false;
  }
  
  /**
   * Get the course title based on course ID.
   * @param courseId - The ID of the course.
   * @returns The course title or an empty string.
   */
  function getCourseTitle(courseId: number | null): string {
    if (!courseId) return '';
    const course = courseStore.getCourseById(courseId);
    return course ? course.name : '';
  }
  </script>
  
  <style scoped>
  .text-h5 {
    font-size: 1.25rem;
    font-weight: bold;
  }
  </style>
  