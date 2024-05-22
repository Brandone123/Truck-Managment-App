<template>
    <v-card>
      <v-card-title>Recruitment Statistics</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-card outlined>
              <v-card-title>Total Applications</v-card-title>
              <v-card-text>{{ stats.totalApplications }}</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card outlined>
              <v-card-title>Interviews Scheduled</v-card-title>
              <v-card-text>{{ stats.interviewsScheduled }}</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card outlined>
              <v-card-title>Positions Filled</v-card-title>
              <v-card-text>{{ stats.positionsFilled }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // Sample statistics data
  const stats = ref({
    totalApplications: 120,
    interviewsScheduled: 35,
    positionsFilled: 10,
  });
  </script>
  