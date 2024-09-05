<template>
    <SharedUiCustomTable :showFooterInHead="false" :headers="equipmentHeaders" :items="equipmentList" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon color="red" dense @click="$emit('delete', item.id)">mdi-delete</v-icon>
      </template>
    </SharedUiCustomTable>
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    search: String,
    equipmentList: Array,
    loading: Boolean,
  });
  
  const emit = defineEmits(['view', 'edit', 'delete']);
  
  const equipmentHeaders = [
    { title: 'Equipment ID', key: 'id' },
    { title: 'Equipment Name', key: 'name' },
    { title: 'Type', key: 'type' },
    { title: 'Status', key: 'status' },
    { title: 'Location', key: 'location' },
    { title: 'Purchase Date', key: 'purchase_date' },
    { title: 'Last Service Date', key: 'last_service_date' },
    { title: 'Actions', key: 'actions' },
  ];
  </script>
  