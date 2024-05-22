<template>
    <div>
      <h2>Training Sessions</h2>
      <ul>
        <li v-for="session in trainingSessions" :key="session.id">
          <h3>{{ session.name }}</h3>
          <p>{{ session.date }}</p>
          <p>{{ session.duration }}</p>
          <p>{{ session.location }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  
  interface TrainingSession {
    id: number;
    name: string;
    date: string;
    duration: string;
    location: string;
  }
  
  const trainingSessions = ref<TrainingSession[]>([
    {
      id: 1,
      name: 'Session 1',
      date: '2022-01-01',
      duration: '2 hours',
      location: 'Training Room A',
    },
    {
      id: 2,
      name: 'Session 2',
      date: '2022-01-08',
      duration: '1.5 hours',
      location: 'Training Room B',
    },
    {
      id: 3,
      name: 'Session 3',
      date: '2022-01-15',
      duration: '3 hours',
      location: 'Training Room C',
    },
  ]);
  </script>
  
  <style scoped>
  /* Add custom styles for the component here */
  </style>