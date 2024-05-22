<template>
    <v-row justify="center">
      <v-col cols="12" md="4" v-for="stat in stats" :key="stat.title">
        <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-avatar size="56" :color="stat.color">
                <v-icon dark>{{ stat.icon }}</v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="8">
              <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
              <div class="text-caption">{{ stat.title }}</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      </v-col>
    </v-row>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const stats = ref([
    { title: 'Open Tasks', value: 24, icon: 'mdi-format-list-checks', color: 'primary' },
    { title: 'Upcoming Meetings', value: 3, icon: 'mdi-calendar-clock', color: 'green' },
    { title: 'Pending Trainings', value: 5, icon: 'mdi-school-outline', color: 'red' },
  ]);
  
  </script>
  
  <style scoped>
  /* Additional styles if needed */
  </style>
  