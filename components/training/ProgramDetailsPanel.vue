<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between">
      <span class="v-card-title px-0 font-weight-bold text-primary">Program Details</span>
    </div>

    <v-expansion-panels density="compact">
      <v-expansion-panel v-for="(module, index) in programModules" :key="index">
        <v-expansion-panel-title>{{ module.title }}</v-expansion-panel-title>
        <v-expansion-panel-text>
          <p>{{ module.description }}</p>
          <!-- Additional module details here -->
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Module {
  id: number;
  title: string;
  description: string;
  // Additional module properties
}

const programModules = ref<Array<Module>>([
  // Sample data - this should come from your store or props
  { id: 1, title: 'Module 1', description: 'Description of Module 1' },
  { id: 2, title: 'Module 2', description: 'Description of Module 2' },
  // More modules...
]);

</script>