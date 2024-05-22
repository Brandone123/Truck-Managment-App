<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h6">Upcoming Events</span>
    </div>
    <v-card>
      <v-card-text>
        <v-table>
          <!-- <thead>
            <tr>
              <th></th>
            </tr>
          </thead> -->
          <tbody>
            <tr v-for="(event, index) in events" :key="index">
              <td>
                <div class="font-weight-bold">{{ event.title }}</div>
                <div>{{ event.description }}</div>
                <div class="text-caption">{{ event.date }}</div>
              </td>
            </tr>
          </tbody>
        </v-table>
        <!-- <v-timeline align-top dense>
          <v-timeline-item
            v-for="event in events"
            :key="event.id"
            :color="event.color"
            small
            fill-dot
          >
            <template #opposite>
              {{ event.date }}
            </template>
<v-card outlined>
  <v-card-title>{{ event.title }}</v-card-title>
  <v-card-text>
    {{ event.description }}
    <v-chip v-if="event.location" small>{{ event.location }}</v-chip>
  </v-card-text>
</v-card>
</v-timeline-item>
</v-timeline> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const events = ref([
  { id: 1, date: 'April 5, 2024', title: 'Safety Training Session', description: 'Mandatory for all warehouse staff.', location: 'Conference Room B', color: 'blue' },
  { id: 2, date: 'April 12, 2024', title: 'Department Meeting', description: 'Quarterly performance review.', location: 'Online (Zoom)', color: 'green' },
  { id: 3, date: 'April 20, 2024', title: 'Equipment Maintenance', description: 'Equipment will be unavailable for use.', location: 'Warehouse', color: 'amber' },
]);

</script>

<style scoped>
/* Optional: Add styles here */
</style>