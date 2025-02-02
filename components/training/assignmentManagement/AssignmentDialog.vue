<!-- src/components/training/assignmentManagement/AssignmentDialog.vue -->

<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Edit Assignment' : 'Assign Training' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isValid">
            <v-select
              v-model="assignment.type"
              :items="assignmentTypes"
              label="Assignment Type"
              :rules="[v => !!v || 'Assignment type is required']"
              @change="onTypeChange"
            ></v-select>
  
            <v-select
              v-if="assignment.type === 'Program'"
              v-model="assignment.programId"
              :items="activePrograms"
              item-text="name"
              item-value="id"
              label="Select Program"
              :rules="[v => !!v || 'Program is required']"
            ></v-select>
  
            <v-select
              v-if="assignment.type === 'TrainingPlan'"
              v-model="assignment.trainingPlanId"
              :items="filteredTrainingPlans"
              item-text="name"
              item-value="id"
              label="Select Training Plan"
              :rules="[v => !!v || 'Training Plan is required']"
            ></v-select>
  
            <v-select
              v-if="assignment.type === 'Course'"
              v-model="assignment.courseId"
              :items="activeCourses"
              item-text="name"
              item-value="id"
              label="Select Course"
              :rules="[v => !!v || 'Course is required']"
            ></v-select>
  
            <v-select
              v-if="assignment.type === 'Course' && showTrainingPlanSelection"
              v-model="assignment.trainingPlanId"
              :items="filteredTrainingPlans"
              item-text="name"
              item-value="id"
              label="Select Training Plan (Optional)"
            ></v-select>
  
            <v-select
              v-model="assignment.employeeId"
              :items="employees"
              item-text="name"
              item-value="id"
              label="Select Employee"
              :rules="[v => !!v || 'Employee is required']"
            ></v-select>
  
            <v-select
              v-model="assignment.status"
              :items="assignmentStatuses"
              label="Status"
              :rules="[v => !!v || 'Status is required']"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="close">Cancel</v-btn>
          <v-btn color="primary" :disabled="!isValid" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { defineProps, defineEmits, onMounted } from 'vue';
  import type { Assignment, Program, TrainingPlan, Course, Employee } from '@/types/training/trainingAssignment';
  import { useTrainingAssignmentStore } from '@/stores/training/trainingAssignmentStore';
  
  const props = defineProps<{
    isEdit: boolean;
    assignment?: Assignment;
  }>();
  
  const emit = defineEmits(['close-dialog', 'save-assignment']);
  
  const store = useTrainingAssignmentStore();
  
  const dialog = ref(true);
  const isValid = ref(false);
  
  const assignmentTypes = ['Program', 'TrainingPlan', 'Course'];
  const assignmentStatuses = ['Active', 'Completed', 'Dropped'];
  
  // Initialize assignment data
  const assignment = ref<Partial<Assignment>>({
    type: '',
    programId: undefined,
    trainingPlanId: undefined,
    courseId: undefined,
    employeeId: undefined,
    status: 'Active',
  });
  
  if (props.isEdit && props.assignment) {
    assignment.value = { ...props.assignment };
  }
  
  // Form validation
  const form = ref();
  
  // Watch for prop changes to close the dialog
  watch(dialog, (val) => {
    if (!val) {
      emit('close-dialog');
    }
  });
  
  // Computed: Get active programs
  const activePrograms = computed<Program[]>(() => store.programs.filter(p => p.active));
  
  // Computed: Get active training plans based on selected program
  const filteredTrainingPlans = computed<TrainingPlan[]>(() => {
    if (assignment.value.programId) {
      return store.trainingPlans.filter(tp => tp.programId === assignment.value.programId && tp.active);
    }
    return [];
  });
  
  // Computed: Get active courses
  const activeCourses = computed<Course[]>(() => store.courses.filter(c => c.active));
  
  // Computed: Get all employees
  const employees = computed<Employee[]>(() => store.employees);
  
  // Optional Training Plan selection for Course assignments
  const showTrainingPlanSelection = computed(() => {
    return assignment.value.type === 'Course';
  });
  
  // Handle changes when assignment type changes
  function onTypeChange(newType: string) {
    // Reset dependent fields
    if (newType !== 'Program') {
      assignment.value.programId = undefined;
    }
    if (newType !== 'TrainingPlan') {
      assignment.value.trainingPlanId = undefined;
    }
    if (newType !== 'Course') {
      assignment.value.courseId = undefined;
      assignment.value.trainingPlanId = undefined;
    }
  }
  
  function close() {
    dialog.value = false;
  }
  
  async function save() {
    if (!assignment.value.type || !assignment.value.employeeId) {
      // Basic validation
      return;
    }
  
    try {
      if (props.isEdit && assignment.value.id) {
        // Update existing assignment
        await store.updateAssignmentStatus(assignment.value.id, assignment.value.status as any);
        // Additional update logic if needed
      } else {
        // Create new assignment based on type
        if (assignment.value.type === 'Program' && assignment.value.programId) {
          await store.assignProgramToEmployee(assignment.value.employeeId, assignment.value.programId);
        } else if (assignment.value.type === 'TrainingPlan' && assignment.value.trainingPlanId) {
          await store.assignTrainingPlanToEmployee(assignment.value.employeeId, assignment.value.trainingPlanId);
        } else if (assignment.value.type === 'Course' && assignment.value.courseId) {
          await store.assignCourseToEmployee(assignment.value.employeeId, assignment.value.courseId, assignment.value.trainingPlanId);
        }
      }
  
      emit('save-assignment');
      dialog.value = false;
    } catch (error: any) {
      alert(error.message || 'Failed to save assignment.');
    }
  }
  </script>
  
  <style scoped>
  .text-h5 {
    font-size: 1.25rem;
    font-weight: bold;
  }
  </style>
  