<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h6">Recent Updates</span>
    </div>
    <v-card>
      <v-card-text>
        <v-list>
          <v-list-item v-for="update in updates" :key="update.id" two-line>
            <template v-slot:prepend>
              <v-icon color="primary">mdi-information</v-icon>
            </template>

            <v-list-item-title>{{ update.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ update.date }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const updates = ref([
  { id: 1, title: 'New Safety Training Available', date: 'March 15, 2024' },
  { id: 2, title: 'Updated SOPs for Equipment Use', date: 'March 20, 2024' },
  { id: 3, title: 'Office Reopening Guidelines', date: 'March 22, 2024' },
]);

</script>

<style scoped>
/* Optional styling */
</style>