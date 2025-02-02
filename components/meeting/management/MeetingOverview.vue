<template>
    <v-card class="mb-4">
      <v-card-title>
        <span class="text-h6">Meeting Overview</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <p>
          This is the overview tab content. Expand this as needed to show more
          details or analytics about the meeting.
        </p>
  
        <v-row>
          <v-col cols="12" md="6">
            <p><strong>Meeting Title:</strong> {{ meeting?.title }}</p>
          </v-col>
          <v-col cols="12" md="6">
            <!-- Example placeholder for future expansion -->
            <p><strong>Additional Info:</strong> Coming soon...</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue';
  import type { Meeting } from '@/types/meeting/meeting';
  
  interface Props {
    meeting?: Meeting;
  }
  
  const props = defineProps<Props>();
  </script>
  