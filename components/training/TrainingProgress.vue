<template>
  <v-row>
    <v-col cols="12" sm="6" md="4" v-for="program in programs" :key="program.id">
      <v-card>
        <v-card-text class="d-flex justify-space-between align-center">
          <span class="text-title font-weight-bold" style="max-width: 60%;">{{ program.title }}</span>
          <v-progress-circular :model-value="program.progress" :rotate="360" :size="50" :width="5" color="primary">
            <template v-slot:default> {{ program.progress }}% </template>
          </v-progress-circular>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const programs = ref([
  { id: 1, title: 'Safety Training', progress: 75, color: 'primary' },
  { id: 2, title: 'Operational Excellence', progress: 50, color: 'secondary' },
  { id: 3, title: 'Customer Service Fundamentals', progress: 90, color: 'danger' },
]);
</script>