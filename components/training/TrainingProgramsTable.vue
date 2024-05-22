<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between">
      <span class="v-card-title px-0 font-weight-bold text-primary">Training Programs</span>
            <!-- Dialogs for Creating/Editing Training Programs -->
            <TrainingProgramDialog />
    </div>

     <v-card>
    <!--  <v-card-text> -->
        <v-data-table density="compact" :headers="headers" :items="programs" :search="search">
          <template v-slot:item.name="{item}">
          <v-btn variant="text" color="primary" class="text-none" density="comfortable" to="program_details">{{ item.name }}</v-btn>
          </template>
        </v-data-table>
      <!-- </v-card-text> -->

    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { VDataTable } from 'vuetify/components'
import TrainingProgramDialog from '@/components/training/TrainingProgramDialog.vue';
type Headers = InstanceType<typeof VDataTable>['headers']


interface Program {
  id: number;
  name: string;
  description: string;
  targetAudience: string;
  completionTime: number;
  active: boolean;
}

const search = ref('');

const headers = ref<Headers>([
  { title: 'ID', align: 'start', sortable: false, key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Target Audience', key: 'targetAudience' },
  { title: 'Estimated Completion Time', key: 'completionTime' },
  { title: 'Active', key: 'active' },
]);

const programs = ref<Program[]>([
  // Populate with your program data or fetch from an API
  { id: 1, name: 'Safety Training', description: 'Learn about safety', targetAudience: 'Drivers', completionTime: 5, active: true },
  // More programs...
]);

</script>

<style scoped>
/* Add any additional styling for your TrainingProgramsTable here */
</style>