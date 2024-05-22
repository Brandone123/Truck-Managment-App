<template>
  <div>
    <!-- Page Title -->
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Training Assignments</span>
      <!-- Assignment Options -->
      <!-- Includes options for automatic or manual assignment, and setting due dates -->
      <AssignmentDialog />
    </div>

    <!-- Training Program Selector -->
    <!-- Allows the user to select a training program or module to assign  -->
    <v-row class="mt-4">
      <v-spacer></v-spacer>
      <v-col sm="12" md="6" lg="4">
        <TrainingProgramSelector />
      </v-col>
    </v-row>


    <!-- Current Assignments -->
    <!-- Displays a list or table of current assignments, with options to edit or revoke them -->
    <CurrentAssignmentsTable />

  </div>
</template>

<script setup lang="ts">
import TrainingProgramSelector from '@/components/training/assignment/TrainingProgramSelector.vue';
import AssignmentDialog from '@/components/training/assignment/AssignmentDialog.vue';
import CurrentAssignmentsTable from '@/components/training/assignment/CurrentAssignmentsTable.vue';
</script>