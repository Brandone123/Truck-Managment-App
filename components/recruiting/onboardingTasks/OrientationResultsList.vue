<template>
    <SharedUiServerTable
      :items="results"
      :headers="tableHeaders"
      :loading="loading"
      :pagination.sync="pagination"
      :total-items="totalItems"
      @update:pagination="onPaginationUpdate"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn icon small @click="$emit('edit', item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon small color="red" @click="$emit('delete', item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
  
      <template v-slot:item.passed="{ item }">
        <v-chip :color="item.passed ? 'green' : 'red'" dark>
          {{ item.passed ? 'Passed' : 'Failed' }}
        </v-chip>
      </template>
  
      <template v-slot:item.completed_at="{ item }">
        <span>{{ formatDate(item.completed_at) }}</span>
      </template>
    </SharedUiServerTable>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import type { OrientationResult } from '@/types/recruiting/onboardingOrientation';
  
  const props = defineProps({
    results: {
      type: Array as PropType<OrientationResult[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object as PropType<{
        page: number;
        itemsPerPage: number;
        sortBy: string[];
        sortDirection: string[];
        search: string;
        filters: Record<string, any>;
      }>,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
  });
  
  const emit = defineEmits(['edit', 'delete', 'update:pagination']);
  
  const tableHeaders = [
    { title: 'Application ID', key: 'application_id', sortable: true },
    { title: 'Quiz ID', key: 'quiz_form_id', sortable: true },
    { title: 'Score', key: 'score', sortable: true },
    { title: 'Passed', key: 'passed', sortable: true },
    { title: 'Completed At', key: 'completed_at', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false, width: '150px' },
  ];
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
  };
  
  const onPaginationUpdate = (newPagination: any) => {
    emit('update:pagination', newPagination);
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  