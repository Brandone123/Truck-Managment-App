<template>
    <SharedUiServerTable
      :items="groups"
      :headers="tableHeaders"
      :loading="loading"
      @update:options="onOptionsUpdate"
    >
     
        <template v-slot:item.actions="{ item }">
      <!-- Single Action Icons -->
      <v-icon small @click="$emit('edit', item)" color="green">mdi-pencil</v-icon>
      <v-icon small @click="$emit('delete', item.id)" color="red">mdi-delete</v-icon>
      
   
      </template>
  
      <template v-slot:item.members="{ item }">
        <span>{{ item.employees?.length || 0 }} Members</span>
      </template> 
  
      <template v-slot:item.policies="{ item }">
        <span>{{ item.policies?.length || 0 }} Policies</span>
      </template>
    </SharedUiServerTable>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import type { Group } from '@/types/workforce/attendanceRecord';
  import { useGroupStore } from '@/stores/workforce/groupStore';
  import { storeToRefs } from 'pinia';
  
  const props = defineProps({
    groups: {
      type: Array as PropType<Group[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
  
  const groupStore = useGroupStore();
  const { pagination } = storeToRefs(groupStore);
  
  const hoveredRow = ref<number | null>(null);
  
  const tableHeaders = [
    { title: 'Name', key: 'group_name' },
    { title: 'Description', key: 'description' },
    { title: 'Members', key: 'members', sortable: false },
    { title: 'Policies', key: 'policies', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false, width: '100px', align: 'end' },
  ];
  
  const onOptionsUpdate = (options: any) => {
    groupStore.pagination = options;
    groupStore.fetchGroups(options);
  };
  </script>
  