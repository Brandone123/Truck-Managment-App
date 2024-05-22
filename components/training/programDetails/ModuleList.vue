<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between">
      <span class="v-card-title px-0 font-weight-bold text-primary">Modules</span>
    </div>
    <v-expansion-panels >
      <v-expansion-panel v-for="(module, i) in modules" :key="i" :title="module.title"
        :subtitle="module.shortDescription" :text="module.description"></v-expansion-panel>
    </v-expansion-panels>
    <!-- Rest of your component -->
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';

interface Module {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  expanded: boolean;
}

const modules = ref<Array<Module>>([
  {
    id: 1,
    title: 'Module 1: Introduction',
    shortDescription: 'An overview of the program structure.',
    description: 'Full details about Module 1.',
    expanded: false,
  },
  {
    id: 2,
    title: 'Module 2: Safety Standards',
    shortDescription: 'Understanding safety protocols.',
    description: 'Full details about Module 2.',
    expanded: false,
  },
  // ... more modules
]);

const toggleModule = (moduleId: number) => {
  const module = modules.value.find((m) => m.id === moduleId);
  if (module) {
    module.expanded = !module.expanded;
  }
};
</script>

<style scoped>
.module-detail {
  background-color: #f5f5f5;
}
</style>