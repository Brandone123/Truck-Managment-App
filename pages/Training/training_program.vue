<template>
  <div>
    <!-- Quick Access Menu -->
    <QuickAccessMenu />
    <v-row class="align-center" no-gutters>

      <!-- <v-col md="6" class="pa-0">
        <QuickAccessMenu />
      </v-col> -->
      <v-spacer></v-spacer>
      <!-- Search Field -->
      <v-col cols="12" md="6" lg="4" class="pa-0">
        <v-text-field hide-details variant="solo" density="compact" v-model="search" prepend-inner-icon="mdi-magnify"
          label="Search for a program..." class="my-4" />
      </v-col>
    </v-row>

    <!-- Training Programs Table -->
    <TrainingProgramsTable class="my-3" />

    <!-- Expansion Panel for Program Details -->
    <!-- <ProgramDetailsPanel /> -->

    <!-- Feedback Submission and Display -->
    <div class="mx-n4 mb-n4 mt-5 px-5 pb-5 background-primary">
    <ProgramFeedback />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QuickAccessMenu from '@/components/training/QuickAccessMenu.vue';
import TrainingProgramsTable from '@/components/training/TrainingProgramsTable.vue';
// import ProgramDetailsPanel from '@/components/training/ProgramDetailsPanel.vue';
import ProgramFeedback from '@/components/training/ProgramFeedback.vue';

const search = ref('');
const newProgramDialog = ref(false);

// Methods and additional script logic go here...
</script>

<style scoped>

.background-primary {
  background-color: rgba(var(--v-theme-primary), var(--v-border-opacity));
}
</style>