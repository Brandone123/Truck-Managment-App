<!-- src/components/training/courseManagement/AssignParticipantsDialog.vue -->

<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">Assign Participants</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <v-select
              v-model="selectedEmployees"
              :items="availableEmployees"
              item-text="name"
              item-value="id"
              label="Select Employees"
              multiple
              chips
              clearable
              :rules="[v => v.length > 0 || 'At least one employee must be selected']"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text :disabled="!isFormValid" @click="assignParticipants">
            Assign
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import { useTrainingEmployeeStore } from '~/stores/training/trainingEmployeeStore';
  import { useCourseStore } from '@/stores/training/courseStore';
  
  // Types
  import type { Employee } from '@/types/training/course';
  
  const props = defineProps<{
    courseId: number;
  }>();
  
  const emit = defineEmits<{
    (e: 'close-dialog'): void;
    (e: 'assign-participants', selectedEmployeeIds: number[]): void;
  }>();
  
  const dialog = ref(true);
  const isFormValid = ref(false);
  
  const employeeStore = useTrainingEmployeeStore();
  const courseStore = useCourseStore();
  
  // Local form data
  const selectedEmployees = ref<number[]>([]);
  
  // Computed: Available employees to assign (exclude already assigned)
  const availableEmployees = computed<Employee[]>(() => {
    const assignedIds = courseStore.participants
      .filter(p => p.courseId === props.courseId)
      .map(p => p.employeeId);
    return employeeStore.employees.filter(e => !assignedIds.includes(e.id));
  });
  
  /**
   * Close the dialog without assigning.
   */
  function closeDialog() {
    dialog.value = false;
    emit('close-dialog');
  }
  
  /**
   * Assign selected employees to the course.
   */
  function assignParticipants() {
    emit('assign-participants', selectedEmployees.value);
    dialog.value = false;
  }
  </script>
  
  <style scoped>
  .text-h5 {
    font-size: 1.25rem;
    font-weight: bold;
  }
  </style>
  