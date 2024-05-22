<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h6">My Schedule & Duties</span>
    </div>
    <v-card>
      <v-card-text>
        <v-timeline dense>
          <v-timeline-item v-for="duty in duties" :key="duty.id" :color="duty.color" :dot-color="duty.color"
            :icon="duty.icon" fill-dot small>
            <template #opposite>
              <span class="font-weight-bold">{{ duty.time }}</span>
            </template>
            <v-card>
              <v-card-title density="compact" :class="['text-h6', `bg-${duty.color}`]">
                {{ duty.title }}
              </v-card-title>
              <v-card-text class="bg-white text--primary">
                {{ duty.description }}
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>

    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const duties = ref([
  { id: 1, time: '08:00 AM', title: 'Team Stand-up Meeting', description: 'A daily meeting where team members provide updates on their progress and discuss any challenges or roadblocks.', color: 'blue', icon: 'mdi-star' },
  { id: 2, time: '10:00 AM', title: 'Training Session: Safety Procedures', description: 'Safety Procedures: A session focused on educating participants about safety procedures and protocols to ensure a safe working environment.', color: 'green', icon: 'mdi-book-variant' },
  { id: 3, time: '01:00 PM', title: 'Project Work Time', description: 'Dedicated time for team members to work on project-related tasks and make progress towards project goals', color: 'amber', icon: 'mdi-airballoon' },
  { id: 4, time: '04:00 PM', title: 'Review Meeting with Supervisor', description: 'A meeting with a supervisor to review and discuss work progress, address any concerns, and provide feedback', color: 'red', icon: 'mdi-layers-triple' },
]);

</script>

<style scoped>
/* Styles here if needed */
</style>