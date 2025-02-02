<!-- src/components/training/planManagement/PlanCourses.vue -->

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="font-weight-bold text-primary">Courses in Plan</span>
        <v-btn color="primary" @click="openAddCourseDialog" density="comfortable">
          <v-icon left>mdi-plus</v-icon>
          Add Course
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
            ></v-text-field>
          </template>

          <template #item.name="{ item }">
            {{ item.title }}
          </template>

          <template #item.order="{ item }">
            {{ item.order }}
          </template>

          <template #item.required="{ item }">
            {{ item.required ? 'Yes' : 'No' }}
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
    <PlanCourseDialog
      v-if="isCourseDialogOpen"
      :is-edit="isEditMode"
      :course="selectedCourse"
      @close-dialog="closeCourseDialog"
      @save-course="handleSaveCourse"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="isDeleteDialogOpen" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete the course
          "{{ courseToDelete?.title }}" from the plan?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isDeleteDialogOpen = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteCourse">
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
import { useTrainingPlanStore } from '@/stores/training/trainingPlanStore';
import { useCourseStore } from '@/stores/training/courseStore';

// Components
import PlanCourseDialog from '@/components/training/planManagement/PlanCourseDialog.vue';

// Types
import type { PlanCourse } from '@/types/training/trainingPlan';
import type { Course } from '@/types/training/course';

const props = defineProps<{
  planId: number;
}>();

const emit = defineEmits(['']); // No specific emits needed here

const planStore = useTrainingPlanStore();
const courseStore = useCourseStore();

// Local state
const search = ref('');
const isCourseDialogOpen = ref(false);
const isEditMode = ref(false);
const selectedCourse = ref<PlanCourse | null>(null);

const isDeleteDialogOpen = ref(false);
const courseToDelete = ref<PlanCourse | null>(null);

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
});

// Fetch necessary data
onMounted(async () => {
  if (props.planId) {
    await planStore.fetchPlans();
    await courseStore.fetchCourses();
  }
});

// Computed: Get courses in the plan
const courses = computed<PlanCourse[]>(() => {
  const plan = planStore.getPlanById(props.planId);
  return plan?.courses || [];
});

// Headers for the data table
const headers = [
  { title: 'Course Title', value: 'name' },
  { title: 'Order', value: 'order' },
  { title: 'Required', value: 'required' },
  { title: 'Actions', value: 'actions', sortable: false },
];

/**
 * Open the dialog to add a new course to the plan.
 */
function openAddCourseDialog() {
  isEditMode.value = false;
  selectedCourse.value = null;
  isCourseDialogOpen.value = true;
}

/**
 * Open the dialog to edit an existing course in the plan.
 * @param course - The course to edit.
 */
function openEditCourseDialog(course: PlanCourse) {
  isEditMode.value = true;
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
 * Handle saving a course (add or edit) in the plan.
 * @param courseData - The course data from the dialog.
 */
async function handleSaveCourse(courseData: Partial<PlanCourse>) {
  try {
    if (isEditMode.value && selectedCourse.value) {
      // Update existing course in the plan
      await planStore.updatePlanCourse(
        props.planId,
        selectedCourse.value.id,
        courseData,
      );
      snackbar.value = {
        show: true,
        message: 'Course updated successfully.',
        color: 'success',
      };
    } else {
      // Add new course to the plan
      await planStore.addCourseToPlan(props.planId, courseData);
      snackbar.value = {
        show: true,
        message: 'Course added successfully.',
        color: 'success',
      };
    }
    isCourseDialogOpen.value = false;
    selectedCourse.value = null;
  } catch (error: any) {
    console.error(error);
    snackbar.value = {
      show: true,
      message: 'Failed to save course.',
      color: 'error',
    };
  }
}

/**
 * Open the delete confirmation dialog for a course.
 * @param course - The course to delete.
 */
function confirmDeleteCourse(course: PlanCourse) {
  courseToDelete.value = course;
  isDeleteDialogOpen.value = true;
}

/**
 * Handle deleting a course from the plan.
 */
async function deleteCourse() {
  if (!courseToDelete.value) return;
  try {
    await planStore.deleteCourseFromPlan(props.planId, courseToDelete.value.id);
    snackbar.value = {
      show: true,
      message: 'Course deleted successfully.',
      color: 'success',
    };
    isDeleteDialogOpen.value = false;
    courseToDelete.value = null;
  } catch (error: any) {
    console.error(error);
    snackbar.value = {
      show: true,
      message: 'Failed to delete course.',
      color: 'error',
    };
  }
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
