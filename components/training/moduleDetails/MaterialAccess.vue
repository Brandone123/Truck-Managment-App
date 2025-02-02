<!-- src/components/training/moduleDetails/MaterialAccess.vue -->
<template>
  <v-card flat>
    <v-card-title>Additional Materials</v-card-title>
    <v-list dense>
      <v-list-item
        v-for="material in materials"
        :key="material.id"
        @click="openMaterial(material)"
        style="cursor: pointer;"
      >
        <v-list-item-action>
          <v-icon>mdi-open-in-new</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ material.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ material.description }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTrainingModuleStore } from '@/stores/training/trainingModuleStore';
import type { ModuleMaterial } from '@/types/training/trainingModule';

const props = defineProps<{
  moduleId: number;
}>();

const store = useTrainingModuleStore();

// Get the module
const module = computed(() => store.getModuleById(props.moduleId));

// Get materials
const materials = computed(() => module.value?.materials || []);

// Open material in a new tab
function openMaterial(material: ModuleMaterial) {
  window.open(material.link, '_blank');
}
</script>

<style scoped>
/* Optional: Add hover effects or other styles */
</style>
