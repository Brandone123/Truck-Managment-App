<!-- src/components/training/programs/ProgramCourses.vue -->

<template>
    <div>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="font-weight-bold text-primary">Courses</span>
          <v-btn color="primary" @click="openAddCourseDialog" density="comfortable">
            <v-icon left>mdi-plus</v-icon>
            Add New Course
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="courses"
            :search="search"
            item-key="id"
            class="elevation-1"
            :items-per-page="10"
          >
            <template #top>
              <v-text-field
                v-model="search"
                label="Search Courses"
                append-icon="mdi-magnify"
                single-line
                hide-details
              />
            </template>
  
            <template #item.name="{ item }">
              {{ item.name }}
            </template>
  
            <template #item.description="{ item }">
              {{ item.description }}
            </template>
  
            <template #item.active="{ item }">
              {{ item.active ? 'Yes' : 'No' }}
            </template>
  
            <template #item.actions="{ item }">
              <v-btn color="info" small @click="openEditCourseDialog(item)">
                <v-icon left>mdi-pencil</v-icon>
                Edit
              </v-btn>
              <v-btn color="red" small @click="confirmDeleteCourse(item)">
                <v-icon left>mdi-delete</v-icon>
                Delete
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
  
      <!-- Add/Edit Course Dialog -->
      <CourseDialog
        v-if="isCourseDialogOpen"
        :is-new="isNewCourse"
        :course-to-edit="selectedCourse"
        @close-dialog="closeCourseDialog"
        @save-course="handleSaveCourse"
      />
  
      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirm Delete</v-card-title>
          <v-card-text>
            Are you sure you want to delete the course "{{ courseToDelete?.name }}"?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="red darken-1" text @click="handleDeleteCourse">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Snackbar for Notifications -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.message }}
        <v-btn text @click="snackbar.show = false">Close</v-btn>
      </v-snackbar>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useCourseStore } from '@/stores/training/courseStore';
  import { useTrainingProgramStore } from '~/stores/training/traininProgramStore';
  import { defineProps, defineEmits } from 'vue';
  
  // Components
  import CourseDialog from '@/components/training/program/CourseDialog.vue';
  
  import type { Course } from '@/types/training/course';
  
  const props = defineProps<{
    programId: number;
  }>();
  
  const emit = defineEmits(['']); // No specific emits needed here
  
  const courseStore = useCourseStore();
  const programStore = useTrainingProgramStore();
  
  // Local state
  const search = ref('');
  const isCourseDialogOpen = ref(false);
  const isNewCourse = ref(true);
  const selectedCourse = ref<Course | null>(null);
  
  const deleteDialog = ref(false);
  const courseToDelete = ref<Course | null>(null);
  
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  });
  
  // Fetch courses when component is mounted or programId changes
  onMounted(() => {
    if (props.programId) {
      courseStore.fetchCourses();
    }
  });
  
  // Computed: Get courses associated with the program
  const courses = computed<Course[]>(() =>
    courseStore.courses.filter(course => isCourseInProgram(course.id)),
  );
  
  /**
   * Determine if a course is part of the given program.
   * This logic depends on how courses are associated with programs.
   * Assuming there's a relation, adjust accordingly.
   * For this example, let's assume a course can belong to multiple programs via training plans.
   */
  function isCourseInProgram(courseId: number): boolean {
    // Assuming training plans have courses linked to programs
    const trainingPlanStore = useTrainingPlanStore();
    const plans = trainingPlanStore.getPlansByProgramId(props.programId);
    for (const plan of plans) {
      if (plan.courses.some(c => c.id === courseId)) {
        return true;
      }
    }
    return false;
  }
  
  // Headers for the data table
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Name', value: 'name' },
    { title: 'Description', value: 'description' },
    { title: 'Active', value: 'active' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];
  
  /**
   * Open the dialog to add a new course.
   */
  function openAddCourseDialog() {
    isNewCourse.value = true;
    selectedCourse.value = null;
    isCourseDialogOpen.value = true;
  }
  
  /**
   * Open the dialog to edit an existing course.
   * @param course - The course to edit.
   */
  function openEditCourseDialog(course: Course) {
    isNewCourse.value = false;
    selectedCourse.value = { ...course };
    isCourseDialogOpen.value = true;
  }
  
  /**
   * Close the course dialog.
   */
  function closeCourseDialog() {
    isCourseDialogOpen.value = false;
    selectedCourse.value = null;
  }
  
  /**
   * Handle saving a course (create or update).
   * @param courseData - The course data from the dialog.
   */
  async function handleSaveCourse(courseData: Partial<Course>) {
    if (isNewCourse.value) {
      await courseStore.createCourse({
        ...courseData,
        modules: courseData.modules || [],
      });
      snackbar.value = {
        show: true,
        message: 'Course added successfully.',
        color: 'success',
      };
    } else if (selectedCourse.value) {
      await courseStore.updateCourse(selectedCourse.value.id, courseData);
      snackbar.value = {
        show: true,
        message: 'Course updated successfully.',
        color: 'success',
      };
    }
    isCourseDialogOpen.value = false;
    selectedCourse.value = null;
  }
  
  /**
   * Open the delete confirmation dialog for a course.
   * @param course - The course to delete.
   */
  function confirmDeleteCourse(course: Course) {
    courseToDelete.value = course;
    deleteDialog.value = true;
  }
  
  /**
   * Handle deleting a course.
   */
  async function handleDeleteCourse() {
    if (courseToDelete.value) {
      await courseStore.deleteCourse(courseToDelete.value.id);
      snackbar.value = {
        show: true,
        message: 'Course deleted successfully.',
        color: 'success',
      };
    }
    deleteDialog.value = false;
    courseToDelete.value = null;
  }
  </script>
  
  <style scoped>
  .font-weight-bold {
    font-weight: bold;
  }
  .text-primary {
    color: var(--v-theme-primary);
  }
  </style>
  