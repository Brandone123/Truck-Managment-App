<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between">
      <span class="v-card-title px-0 font-weight-bold text-primary"
        >Training Programs</span
      >
      <!-- Button to open the dialog for creating a new program -->
      <v-btn color="primary" dark @click="openNewProgramDialog" density="comfortable">
        Add New Program
      </v-btn>
    </div>

    <v-card>
      <v-data-table
        density="compact"
        :headers="headers"
        :items="filteredPrograms"
        :search="search"
        item-key="id"
      >
        <!-- Program Name is clickable to go to details page -->
        <template #item.name="{ item }">
          <v-btn
            variant="text"
            color="primary"
            class="text-none"
            density="comfortable"
            :to="`/training/TrainingProgram/${item.id}`"
          >
            {{ item.name }}
          </v-btn>
        </template>

        <!-- Edit/Delete Buttons -->
        <template #item.actions="{ item }">
          <v-btn color="info" small @click="$emit('edit-program', item)">
            <v-icon left>mdi-pencil</v-icon>
            Edit
          </v-btn>
          <v-btn color="red" small @click="$emit('delete-program', item)">
            <v-icon left>mdi-delete</v-icon>
            Delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TrainingProgram } from '@/types/training/program';
import { defineProps, defineEmits } from 'vue';

interface Props {
  search: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['edit-program', 'delete-program']);

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Target Audience', key: 'targetAudience' },
  { title: 'Estimated Completion Time', key: 'completionTime' },
  { title: 'Active', key: 'active' },
  { title: 'Actions', key: 'actions', sortable: false },
];

// In a real scenario, you might inject or use a store directly here.
import { useTrainingProgramStore } from '~/stores/training/traininProgramStore';
const programStore = useTrainingProgramStore();

/** Emitted when we want to create a new program (program: null) */
function openNewProgramDialog() {
  emit('edit-program', null);
}

/** Filtered programs based on the search text */
const filteredPrograms = computed<TrainingProgram[]>(() => {
  if (!props.search) {
    return programStore.programs;
  }
  return programStore.programs.filter((p) =>
    p.name.toLowerCase().includes(props.search.toLowerCase()),
  );
});
</script>

<style scoped>
/* Add any additional styling here */
</style>
