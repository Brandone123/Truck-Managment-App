<script setup lang="ts">
// Import necessary Vuetify components and any other dependencies
import { ref } from 'vue';
import { VCard, VCardTitle, VCardText, VRow, VCol, VSelect } from 'vuetify/components';

// Define the reactive data for the component
const trucks = ref([]);
const trailers = ref([]);
const drivers = ref([]);
const dispatchers = ref([]);

// Options for assets and personnel (these would typically come from a backend API)
const truckOptions = ['Truck 1', 'Truck 2', 'Truck 3'];
const trailerOptions = ['Trailer 1', 'Trailer 2', 'Trailer 3'];
const driverOptions = ['Driver 1', 'Driver 2', 'Driver 3'];
const dispatcherOptions = ['Dispatcher 1', 'Dispatcher 2', 'Dispatcher 3'];
</script>

<template>
  <v-card>
    <v-card-title>Asset Assignment</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            label="Dedicated Trucks"
            v-model="trucks"
            :items="truckOptions"
            multiple
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            label="Dedicated Trailers"
            v-model="trailers"
            :items="trailerOptions"
            multiple
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            label="Dedicated Drivers"
            v-model="drivers"
            :items="driverOptions"
            multiple
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            label="Dedicated Dispatchers"
            v-model="dispatchers"
            :items="dispatcherOptions"
            multiple
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/* Add any necessary styles here */
</style>
