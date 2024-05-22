<template>

  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h5">Training and Certification Management</span>
    </div>

    <v-expansion-panels density="compact">
      <v-expansion-panel v-for="(training, index) in  training_programs " :key="index">
        <v-expansion-panel-title>
          <div class="d-flex flex-column w-100">
            <div class="font-weight-bold"> {{ training.title }}</div>
            <div class="d-flex justify-center">
              <v-card class="mx-2" variant="tonal" color="primary">
                <v-card-text class="d-flex flex-column pa-1">
                  Completed
                  <v-progress-linear :model-value="training.completed" :height="10" color="primary">
                    <template v-slot:default="{ value }" class="t"> {{ value }} % </template>
                  </v-progress-linear>
                </v-card-text>
              </v-card>

              <v-card class="mx-2" variant="tonal" color="primary">
                <v-card-text class="d-flex flex-column pa-1">
                  Pending
                  <v-progress-linear :model-value="training.completed" :height="10" color="primary">
                    <template v-slot:default="{ value }" class="t"> {{ value }} % </template>
                  </v-progress-linear>
                </v-card-text>
              </v-card>

              <v-card class="mx-2" variant="tonal" color="primary">
                <v-card-text class="d-flex flex-column pa-1">
                  Unstarted
                  <v-progress-linear :model-value="training.completed" :height="10" color="light blue" striped>
                    <template v-slot:default="{ value }"> {{ value }} % </template>
                  </v-progress-linear>
                </v-card-text>
              </v-card>

            </div>
          </div>

        </v-expansion-panel-title>
        <v-expansion-panel-text>
          {{ training.description }}
          <v-divider class="my-2"></v-divider>

          <div class="d-flex justify-space-between">
            <span class="text-primary text-h6">Trainers</span>
            <v-btn color="primary" density="comfortable">Add Trainer</v-btn>
          </div>
          <v-data-table density="compact" :headers="trainerHeaders" :items="trainers">
            <template v-slot:item.actions="{ item }">
              <v-btn @click="" icon density="comfortable" variant="tonal" color="red">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <div class="d-flex justify-space-between mt-4">
            <span class="text-primary text-h6">Training Sessions</span>
            <v-btn color="primary" density="comfortable">Add Training Session</v-btn>
          </div>
          <v-data-table density="compact" :headers="trainingSessionHeaders" :items="trainingSessions"></v-data-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import TrainingPrograms from '@/components/hr/training/TrainingPrograms.vue';
import CertificationStatus from '@/components/hr/training/CertificationStatus.vue';
import TrainingSessions from '@/components/hr/training/TrainingSessions.vue';

import { ref } from 'vue'

interface Program {
  id: number;
  title: string;
  description: string;
  targetAudience: string;
  completionTime: number;
  completed: number;
  pending: number;
  incomplete: number;
}

// Dummx program data - replace this with real data fetched from your API/store
const training_programs = ref<Program[]>([
  {
    id: 1,
    title: 'Advanced Safety Training',
    description: 'An in-depth course on advanced safety procedures and protocols.',
    targetAudience: 'Experienced drivers and safety officers',
    completionTime: 15,
    completed: 25,
    pending: 25,
    incomplete: 50,
  },
  {
    id: 2,
    title: 'Training 2',
    description: 'An in-depth course on advanced safety procedures and protocols.',
    targetAudience: 'Experienced drivers and safety officers',
    completionTime: 15,
    completed: 25,
    pending: 25,
    incomplete: 50,
  },
]);


const trainingSessionHeaders = ref([
  { title: 'Date', value: 'date' },
  { title: 'Start Time', value: 'start_time' },
  { title: 'End Time', value: 'end_time' },
])

const trainerHeaders = ref([
  { title: 'Id', value: 'id' },
  { title: 'Name', value: 'full_name' },
  { title: 'Department', value: 'department.name' },
  { title: 'Actions', value: 'actions' }
])

const trainingSessions = ref([
  { id: 1, date: '2024-01-01', start_time: '13:00', end_time: '15:00' }
])

const trainers = ref([
  { id: 1, full_name: 'John Doe', department: { id: 1, name: 'Human Resources' } }
])

</script>

<style scoped>
/* Add custom styles for the component here */
</style>