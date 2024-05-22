<script setup lang="ts">
import { ref } from 'vue';
import { VDataTable } from 'vuetify/components';

// Sample data for lanes
const lanes = ref([
  { id: 1, name: 'Michigan to Ohio', days: 'Monday, Wednesday, Friday', trucks: 3, trailers: 3, drivers: 3, status: 'Active' },
  { id: 2, name: 'Ohio to Pennsylvania', days: 'Tuesday, Thursday', trucks: 2, trailers: 2, drivers: 2, status: 'Active' }
]);

// Define headers for the lanes table
const headers = [
  { title: 'Lane Name', key: 'name' },
  { title: 'Operational Days', key: 'days' },
  { title: 'Trucks', key: 'trucks' },
  { title: 'Trailers', key: 'trailers' },
  { title: 'Drivers', key: 'drivers' },
  { title: 'Status', key: 'status' }
];
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="lanes"
    class="elevation-1"
  ></v-data-table>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
