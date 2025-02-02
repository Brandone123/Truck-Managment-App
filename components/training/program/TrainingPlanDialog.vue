<!-- src/components/training/programs/TrainingPlanDialog.vue -->

<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isNew ? 'New Training Plan' : 'Edit Training Plan' }}</span>
        </v-card-title>
  
        <v-divider></v-divider>
  
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="tempPlan.name"
                  label="Training Plan Name"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="tempPlan.description"
                  label="Training Plan Description"
                  required
                />
              </v-col>
              <v-col cols="12">
                <h3>Courses in this Plan</h3>
                <v-btn color="secondary" @click="openAddCourseToPlanDialog" small>
                  <v-icon left>mdi-plus</v-icon>
                  Add Course
                </v-btn>
                <v-data-table
                  :headers="courseHeaders"
                  :items="tempPlan.courses"
                  item-key="id"
                  class="elevation-1 mt-2"
                  :items-per-page="5"
                >
                  <template #item.actions="{ item }">
                    <v-btn color="red" icon @click="removeCourseFromPlan(item.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
  
        <v-divider></v-divider>
  
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="savePlan">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
  
      <!-- Add Course to Plan Dialog -->
      <v-dialog v-model="isAddCourseDialogOpen" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Add Course to Plan</span>
          </v-card-title>
  
          <v-divider></v-divider>
  
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="selectedCourseId"
                    :items="availableCourses"
                    item-text="name"
                    item-value="id"
                    label="Select Course"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="courseOrder"
                    label="Order"
                    type="number"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-switch
                    v-model="courseRequired"
                    label="Required?"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="closeAddCourseDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="addCourseToPlan">
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed, onMounted } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import { useCourseStore } from '@/stores/training/courseStore';
  import type { TrainingPlan } from '@/types/training/trainingPlan';
  
  const props = defineProps<{
    isNew: boolean;
    planToEdit?: TrainingPlan | null;
  }>();
  
  const emit = defineEmits(['close-dialog', 'save-plan']);
  
  // Controls if the dialog is visible
  const dialog = ref(true);
  
  // Local copy of the plan data
  const tempPlan = ref<Partial<TrainingPlan>>({
    name: '',
    description: '',
    courses: [],
  });
  
  // Watch for changes in `planToEdit`
  watch(
    () => props.planToEdit,
    (newVal) => {
      if (newVal) {
        // Editing
        tempPlan.value = { ...newVal };
      } else {
        // Creating new => reset fields
        tempPlan.value = {
          name: '',
          description: '',
          courses: [],
        };
      }
    },
    { immediate: true },
  );
  
  const isNew = computed(() => props.isNew);
  
  // Training Plan Courses Table Headers
  const courseHeaders = [
    { title: 'ID', value: 'id' },
    { title: 'Title', value: 'title' },
    { title: 'Order', value: 'order' },
    { title: 'Required', value: 'required' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];
  
  // Add Course Dialog State
  const isAddCourseDialogOpen = ref(false);
  const selectedCourseId = ref<number | null>(null);
  const courseOrder = ref<number>(1);
  const courseRequired = ref<boolean>(true);
  
  // Get available courses to add (not already in the plan)
  const courseStore = useCourseStore();
  const availableCourses = computed(() => {
    const addedCourseIds = tempPlan.value.courses?.map(c => c.id) || [];
    return courseStore.courses.filter(c => !addedCourseIds.includes(c.id));
  });
  
  /**
   * Open the dialog to add a course to the plan.
   */
  function openAddCourseToPlanDialog() {
    isAddCourseDialogOpen.value = true;
    selectedCourseId.value = null;
    courseOrder.value = 1;
    courseRequired.value = true;
  }
  
  /**
   * Close the add course dialog.
   */
  function closeAddCourseDialog() {
    isAddCourseDialogOpen.value = false;
  }
  
  /**
   * Add a course to the training plan.
   */
  function addCourseToPlan() {
    if (selectedCourseId.value === null) return;
    const course = courseStore.getCourseById(selectedCourseId.value);
    if (!course) return;
  
    tempPlan.value.courses?.push({
      id: course.id,
      title: course.name,
      order: courseOrder.value,
      required: courseRequired.value,
    });
  
    isAddCourseDialogOpen.value = false;
  }
  
  /**
   * Remove a course from the training plan.
   * @param courseId - The ID of the course to remove.
   */
  function removeCourseFromPlan(courseId: number) {
    tempPlan.value.courses = tempPlan.value.courses?.filter(c => c.id !== courseId);
  }
  
  /**
   * Close the main dialog.
   */
  function closeDialog() {
    dialog.value = false;
    emit('close-dialog');
  }
  
  /**
   * Save the training plan (create or update).
   */
  function savePlan() {
    emit('save-plan', { ...tempPlan.value });
    dialog.value = false;
  }
  </script>
  
  <style scoped>
  .headline {
    font-weight: bold;
  }
  </style>
  