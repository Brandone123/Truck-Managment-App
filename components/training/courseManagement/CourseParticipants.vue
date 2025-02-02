<!-- src/components/training/courseManagement/CourseParticipants.vue -->

<template>
    <div>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="font-weight-bold text-primary">Course Participants</span>
          <v-btn color="primary" @click="openAssignParticipantsDialog" density="comfortable">
            <v-icon left>mdi-account-plus</v-icon>
            Assign Participants
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="participants"
            :search="search"
            item-key="id"
            class="elevation-1"
            :items-per-page="10"
          >
            <template #top>
              <v-text-field
                v-model="search"
                label="Search Participants"
                append-icon="mdi-magnify"
                single-line
                hide-details
              ></v-text-field>
            </template>
  
            <template #item.name="{ item }">
              {{ item.name }}
            </template>
  
            <template #item.department="{ item }">
              {{ item.department }}
            </template>
  
            <template #item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" text-color="white">
                {{ item.status }}
              </v-chip>
            </template>
  
            <template #item.actions="{ item }">
              <v-btn color="red" small @click="confirmRemoveParticipant(item)">
                <v-icon left>mdi-account-remove</v-icon>
                Remove
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
  
      <!-- Assign Participants Dialog -->
      <AssignParticipantsDialog
        v-if="isAssignDialogOpen"
        :courseId="courseId"
        @close-dialog="closeAssignDialog"
        @assign-participants="handleAssignParticipants"
      />
  
      <!-- Remove Confirmation Dialog -->
      <v-dialog v-model="isRemoveDialogOpen" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirm Removal</v-card-title>
          <v-card-text>
            Are you sure you want to remove participant "{{ participantToRemove?.name }}" from the course?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="isRemoveDialogOpen = false">Cancel</v-btn>
            <v-btn color="red darken-1" text @click="removeParticipant">Remove</v-btn>
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
  import { useTrainingEmployeeStore } from '~/stores/training/trainingEmployeeStore';
  
  // Components
  import AssignParticipantsDialog from '@/components/training/courseManagement/AssignParticipantsDialog.vue';
  
  // Types
  import type { Participant } from '@/types/training/course';
  import type { Employee } from '@/types/training/course';
  
  const props = defineProps<{
    courseId: number | undefined;
  }>();
  
  const emit = defineEmits(['']); // No specific emits needed here
  
  const courseStore = useCourseStore();
  const employeeStore = useTrainingEmployeeStore();
  
  // Local state
  const search = ref('');
  const isAssignDialogOpen = ref(false);
  const isRemoveDialogOpen = ref(false);
  const participantToRemove = ref<Participant | null>(null);
  
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  });
  
  // Fetch necessary data
  onMounted(async () => {
    if (props.courseId) {
      await courseStore.fetchCourses();
      await employeeStore.fetchEmployees();
    }
  });
  
  // Computed: Get participants associated with the course
  const participants = computed<Participant[]>(() => {
    return courseStore.participants.filter(p => p.courseId === props.courseId);
  });
  
  // Headers for the data table
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Name', value: 'name' },
    { title: 'Department', value: 'department' },
    { title: 'Status', value: 'status' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];
  
  /**
   * Get color based on participant status.
   * @param status - The status of the participant.
   * @returns The color string.
   */
  function getStatusColor(status: string): string {
    switch (status) {
      case 'Enrolled':
        return 'blue';
      case 'Completed':
        return 'green';
      case 'Dropped':
        return 'red';
      default:
        return 'grey';
    }
  }
  
  /**
   * Open the dialog to assign participants.
   */
  function openAssignParticipantsDialog() {
    isAssignDialogOpen.value = true;
  }
  
  /**
   * Close the assign participants dialog.
   */
  function closeAssignDialog() {
    isAssignDialogOpen.value = false;
  }
  
  /**
   * Handle assigning participants to the course.
   * @param selectedEmployeeIds - Array of employee IDs to assign.
   */
  function handleAssignParticipants(selectedEmployeeIds: number[]) {
    selectedEmployeeIds.forEach(employeeId => {
      courseStore.assignParticipantToCourse(props.courseId!, employeeId);
    });
    snackbar.value = {
      show: true,
      message: 'Participants assigned successfully.',
      color: 'success',
    };
    isAssignDialogOpen.value = false;
  }
  
  /**
   * Confirm removal of a participant.
   * @param participant - The participant to remove.
   */
  function confirmRemoveParticipant(participant: Participant) {
    participantToRemove.value = participant;
    isRemoveDialogOpen.value = true;
  }
  
  /**
   * Remove a participant from the course.
   */
  function removeParticipant() {
    if (participantToRemove.value) {
      courseStore.removeParticipantFromCourse(props.courseId!, participantToRemove.value.id);
      snackbar.value = {
        show: true,
        message: 'Participant removed successfully.',
        color: 'success',
      };
      isRemoveDialogOpen.value = false;
      participantToRemove.value = null;
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
  