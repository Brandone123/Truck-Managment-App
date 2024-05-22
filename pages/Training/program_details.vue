<template>
  <v-container>
    <!-- Program Overview Component -->
    <program-overview />

    <!-- Program Progress Component -->
    <!-- <program-progress /> -->

    <!-- Module List Component -->
    <!-- Each module can expand to reveal a summary and an entry point to the detailed module view -->
    <module-list />

    <!-- Assignment Component -->
    <!-- Shows current assignments, their status, and allows navigation to assignment details -->
    <program-assignments />

    <!-- Certification Component -->
    <!-- Displays certification status, if applicable -->
    <program-certification />
  </v-container>
</template>

<script setup lang="ts">
import ProgramOverview from '@/components/training/programDetails/ProgramOverview.vue';
import ModuleList from '@/components/training/programDetails/ModuleList.vue';
import ProgramAssignments from '@/components/training/programDetails/ProgramAssignments.vue';
import ProgramCertification from '@/components/training/programDetails/ProgramCertification.vue';
</script>

<style scoped>
/* You can add page-specific styles here */
</style>