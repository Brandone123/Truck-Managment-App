<template>
  <div>

    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Recent Activity Feed</span>
    </div>
    <v-card>
      <v-card-text>
        <v-timeline density="compact">
          <v-timeline-item v-for="(activity,index) in activities" :key="index" :dot-color="activity.color" size="small">
            <v-alert :color="activity.color" icon="mdi-check"  :value="true" density="compact">
              {{ activity.description }}
              <div class="text-subtitle">{{ activity.date }}</div>
            </v-alert>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>
    </v-card>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const activities = ref([
  { id: 1, date: '2024-03-20', description: 'Completed : "Vehicle Inspection" module.', color: 'primary' },
  { id: 2, date: '2024-03-22', description: 'Passed : "Safety Compliance" quiz.', color: 'green' },
  { id: 3, date: '2024-03-25', description: 'Started : "Hazardous Materials" course.', color: 'blue' },
]);
</script>