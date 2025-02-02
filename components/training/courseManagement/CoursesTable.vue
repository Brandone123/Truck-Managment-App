<template>
    <v-data-table
      :headers="headers"
      :items="filteredCourses"
      :loading="loading"
      class="elevation-1"
      :items-per-page="10"
      item-key="id"
    >
      <template #top>
        <v-text-field
          v-model="search"
          label="Search Courses"
          append-icon="mdi-magnify"
          single-line
          hide-details
        ></v-text-field>
      </template>
  
      <template #item.name="{ item }">
        <!-- Go to Course Details page -->
        <v-btn variant="text" color="primary" :to="`/training/CourseManagement/${item.id}`">
          {{ item.name }}
        </v-btn>
      </template>
  
      <template #item.actions="{ item }">
        <v-btn color="info" small @click="$emit('edit-course', item)">
          <v-icon left>mdi-pencil</v-icon>
          Edit
        </v-btn>
        <v-btn color="red" small @click="$emit('delete-course', item)">
          <v-icon left>mdi-delete</v-icon>
          Delete
        </v-btn>
      </template>
    </v-data-table>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import type { Course } from '@/types/training/course';
  
  interface Props {
    courses: Course[];
    loading: boolean;
  }
  
  const props = defineProps<Props>();
  const emit = defineEmits(['edit-course', 'delete-course']);
  
  const search = ref('');
  
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Name', value: 'name' },
    { title: 'Description', value: 'description' },
    { title: 'Active', value: 'active' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];
  
  // Filter the courses by search
  const filteredCourses = computed(() => {
    if (!search.value.trim()) {
      return props.courses;
    }
    return props.courses.filter((c) =>
      c.name.toLowerCase().includes(search.value.toLowerCase()),
    );
  });
  </script>
  
  <style scoped>
  /* Add table-specific styling here */
  </style>
  