<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h5">Standard Operating Procedures (SOPs)</span>
    </div>


    <!-- Standard Operating Procedures (SOPs) -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-primary text-h6">Overview</span>
        </div>

        <v-expansion-panels multiple accordion>
          <v-expansion-panel v-for="(sop, index) in sops" :key="index">
            <v-expansion-panel-title>{{ sop.title }}</v-expansion-panel-title>
            <v-expansion-panel-text>
              Last Updated: {{ sop.lastUpdated }}
              <v-divider class="my-4"></v-divider>
              <div class="content" v-html="sop.content"></div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>


      <!-- Job Description -->

      <v-col cols="12">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-primary text-h6">Job Description</span>
        </div>
        <v-card outlined class="mb-2" v-for="job in jobs" :key="job.id">
          <v-card-title>{{ job.title }}</v-card-title>
          <v-card-text>{{ job.description }}</v-card-text>
        </v-card>
      </v-col>


      <!-- Employee Daily Tasks -->

      <v-col cols="12">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-primary text-h6">Employee Daily Tasks</span>
        </div>
        <v-card>
          <v-list>
            <v-list-item v-for="(task, index) in tasks" :key="index">
              <v-list-item-title>{{ task.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ task.frequency }}</v-list-item-subtitle>
              <v-divider class="mt-4" v-if="index < tasks.length - 1"></v-divider>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const sops = ref([
  {
    id: 1,
    title: 'Equipment Handling Procedure',
    lastUpdated: '2023-01-15',
    content: 'This procedure covers the steps necessary to handle equipment safely. <ul><li>Always wear protective gear.</li><li>Follow the manufacturer’s instructions for equipment use.</li><li>Report any equipment malfunctions immediately.</li></ul>'
  },
  {
    id: 2,
    title: 'Safety and Emergency Response',
    lastUpdated: '2023-02-20',
    content: 'This document outlines the procedures to be followed in the event of an emergency. <ul ><li>Evacuate the area following posted evacuation routes.</li><li>Use fire extinguishers only if trained.</li><li>Contact emergency services immediately.</li></ul>'
  },
]);

const jobs = ref([
  { id: 1, title: 'Software Developer', description: 'Responsible for developing and maintaining software applications. Requires proficiency in programming languages such as Java and Python.' },
  { id: 2, title: 'Warehouse Manager', description: 'Oversees warehouse operations, including inventory management, staff scheduling, and compliance with safety regulations.' },
]);

const tasks = ref([
  { id: 1, title: 'Code review and feature development.', frequency: 'Daily' },
  { id: 2, title: 'Inventory checks and order management.', frequency: 'Weekly' },
]);
</script>

<style scoped>
.content :deep ul {
  padding-right: 20px !important;
  padding-left: 20px !important;
}
</style>