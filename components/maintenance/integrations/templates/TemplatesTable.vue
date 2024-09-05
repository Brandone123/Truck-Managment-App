<template>
    <SharedUiCustomTable :showFooterInHead="false" :headers="templateHeaders" :items="templatesList" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" dense @click="$emit('delete', item.id)">mdi-delete</v-icon>
      </template>
    </SharedUiCustomTable>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useTemplatesStore } from '@/stores/maintenance/templatesStore';
  
  const templatesStore = useTemplatesStore();
  
  const templatesList = computed(() => templatesStore.getTemplatesList);
  const loading = computed(() => templatesStore.loading);
  
  const templateHeaders = [
    { title: 'Template ID', key: 'templateId' },
    { title: 'Template Name', key: 'templateName' },
    { title: 'Template Type', key: 'templateType' },
    { title: 'Created Date', key: 'createdDate' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions' },
  ];
  </script>
  