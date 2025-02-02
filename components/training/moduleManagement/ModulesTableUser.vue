<!-- src/components/training/moduleManagement/ModulesTable.vue -->

<template>
    <v-data-table
      :headers="headers"
      :items="filteredModules"
      :loading="loading"
      class="elevation-1"
      :items-per-page="10"
      item-key="id"
    >
      <template #top>
        <v-text-field
          v-model="search"
          label="Search Modules"
          append-icon="mdi-magnify"
          single-line
          hide-details
        />
      </template>
  
      <template #item.title="{ item }">
        <!-- Link to the Admin Module Detail Page -->
        <v-btn variant="text" color="primary" :to="`/training/ModuleUserSection/${item.id}`">
          {{ item.title }}
        </v-btn>
      </template>
  
      <template #item.courseName="{ item }">
        {{ item.courseName }}
      </template>
  
      <template #item.active="{ item }">
        <v-chip :color="item.active ? 'green' : 'grey'" dark>
          {{ item.active ? 'Active' : 'Inactive' }}
        </v-chip>
      </template>
  
      <template #item.actions="{ item }">
        <v-btn color="info" small @click="$emit('edit-module', item)">
          <v-icon left>mdi-pencil</v-icon>
          Edit
        </v-btn>
        <v-btn color="red" small @click="$emit('delete-module', item)">
          <v-icon left>mdi-delete</v-icon>
          Delete
        </v-btn>
      </template>
    </v-data-table>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import type { TrainingModule } from '@/types/training/trainingModule';
  
  interface Props {
    modules: (TrainingModule & { courseName: string })[];
    loading: boolean;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits(['edit-module', 'delete-module']);
  
  const search = ref('');
  
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Course Name', value: 'courseName' },
    { title: 'Title', value: 'title' },
    { title: 'Description', value: 'description' },
    { title: 'Active', value: 'active' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];
  
  const filteredModules = computed(() => {
    if (!search.value.trim()) {
      return props.modules;
    }
    return props.modules.filter((m) =>
      m.title.toLowerCase().includes(search.value.toLowerCase()) ||
      m.courseName.toLowerCase().includes(search.value.toLowerCase())
    );
  });
  </script>
  
  <style scoped>
  /* Add table-specific styling here */
  </style>
  