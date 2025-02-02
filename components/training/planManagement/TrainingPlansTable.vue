<template>
    <v-data-table
      :headers="headers"
      :items="plans"
      :loading="loading"
      class="elevation-1"
      :items-per-page="10"
      item-key="id"
    >
      <template #top>
        <v-text-field
          v-model="search"
          label="Search Plans"
          append-icon="mdi-magnify"
          single-line
          hide-details
        ></v-text-field>
      </template>
  
      <template #item.name="{ item }">
        <!-- Link or button to go to plan details page -->
        <v-btn variant="text" color="primary" :to="`/training/TrainingPlan/${item.id}`">
          {{ item.name }}
        </v-btn>
      </template>
  
      <template #item.actions="{ item }">
        <v-btn color="info" small @click="$emit('edit-plan', item)">
          <v-icon left>mdi-pencil</v-icon>
          Edit
        </v-btn>
        <v-btn color="red" small @click="$emit('delete-plan', item)">
          <v-icon left>mdi-delete</v-icon>
          Delete
        </v-btn>
      </template>
    </v-data-table>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  import type { TrainingPlan } from '@/types/training/trainingPlan';
  import { defineProps, defineEmits } from 'vue';
  
  interface Props {
    plans: TrainingPlan[];
    loading: boolean;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits(['edit-plan', 'delete-plan']);
  
  const search = ref('');
  
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Name', value: 'name' },
    { title: 'Description', value: 'description' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];
  
  // If you need filtering on the table items:
  const filteredPlans = computed(() => {
    if (!search.value.trim()) {
      return props.plans;
    }
    return props.plans.filter((plan) =>
      plan.name.toLowerCase().includes(search.value.toLowerCase()),
    );
  });
  </script>
  
  <style scoped>
  /* Add any table-specific styling here */
  </style>
  