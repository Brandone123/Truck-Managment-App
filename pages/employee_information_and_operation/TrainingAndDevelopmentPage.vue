<template>
  <v-container>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h5">Training And Development</span>
    </div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-primary text-h6">Job Desciption</span>
        </div>
        <v-expansion-panels v-model="openPanel" multiple>
          <v-expansion-panel v-for="(program, index) in trainingPrograms" :key="index">
            <v-expansion-panel-title>
              <div class="d-flex flex-column">
                <p class="font-weight-bold">{{ program.title }}</p>
                <p class="text-caption">{{ program.description }}</p>
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <div v-html="program.objectives"></div>
              <div class="d-flex">
                <v-spacer></v-spacer>
                <v-btn color="primary" density="comfortable" class="text-none" variant="text"
                  :href="program.resourceLink" target="_blank">Access Materials</v-btn>
              </div>

            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface TrainingProgram {
  id: number;
  title: string;
  description: string;
  objectives: string;
  resourceLink: string;
}

const trainingPrograms = ref<TrainingProgram[]>([
  {
    id: 1,
    title: 'Introduction to Safety Procedures',
    description: 'Learn the basics of workplace safety.',
    objectives: 'After this course, you will be able to understand and implement basic safety procedures in your daily work.',
    resourceLink: '#',
  },
  {
    id: 2,
    title: 'Advanced Equipment Training',
    description: 'Hands-on training with the latest industry equipment.',
    objectives: 'Participants will gain practical experience with advanced machinery to improve operational efficiency.',
    resourceLink: '#',
  },
  // Add more training programs as needed
]);

const openPanel = ref<number[]>([0]);
</script>