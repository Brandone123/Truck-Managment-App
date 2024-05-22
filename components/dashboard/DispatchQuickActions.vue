<template>
   <div class="d-flex justify-center flex-wrap">
      <v-btn color="primary" class="ma-2" @click="createLoad"> Add New Load</v-btn>
      <v-btn color="success" class="ma-2" @click="loadAssignment"> Load Assignment</v-btn>
      <v-btn color="info" class="ma-2" @click="scheduleLoad"> Schedule Load</v-btn>
    </div>
    <!-- <v-card outlined class="pa-4">
      <v-card-title class="text-h5">
        Dispatch Quick Actions
      </v-card-title>
      <v-card-text>
        <v-btn color="primary" class="mr-4" @click="createLoad">
          Add New Load
        </v-btn>
        <v-btn color="secondary" class="mr-4" @click="loadAssignment">
            Load Assignment
        </v-btn>
        <v-btn color="accent" @click="scheduleLoad">
          Schedule Load
        </v-btn>
      </v-card-text>
    </v-card> -->
  </template>
  
<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const router = useRouter();

  // Example setup for event handlers
  const createLoad = () => {
    router.push('/dispatch/load_boards'); 
  };
  
  const loadAssignment = () => {
    router.push('/dispatch/load_assignments'); 
  };
  
  const scheduleLoad = () => {
    router.push('/dispatch/load_sheduleV1'); 
  };

</script>
  