<template>
  <v-select variant="solo" density="comfortable" v-model="selectedProgram" :items="programs" item-title="name" item-value="id" label="Choose a program"
    return-object @change="onProgramSelect" clearable></v-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface TrainingProgram {
  id: number;
  name: string;
}

const programs = ref<TrainingProgram[]>([
  { id: 1, name: 'Safety Training' },
  { id: 2, name: 'Operational Excellence' },
  { id: 3, name: 'Customer Service Excellence' },
  // Additional programs can be added here
]);

const selectedProgram = ref<TrainingProgram | null>(null);

const onProgramSelect = (program: TrainingProgram) => {
  console.log('Selected program:', program);
  // Additional logic to handle the selection can be implemented here
  // This could include setting the state for other components or making an API call to fetch program details
};
</script>