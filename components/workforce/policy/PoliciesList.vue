<template>
    <SharedUiServerTable
      :items="policies"
      :headers="tableHeaders"
      :loading="loading"
      @update:options="onOptionsUpdate"
    >
      <template v-slot:item.group_count="{ item }">
        {{ item.groups ? item.groups.length : 0 }}
      </template>
      <template v-slot:item.employee_count="{ item }">
        {{ item.employees ? item.employees.length : 0 }}
      </template>
  
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="$emit('edit', item)" color="green">mdi-pencil</v-icon>
        <v-icon small @click="$emit('delete', item.id)" color="red">mdi-delete</v-icon>
      </template>
    </SharedUiServerTable>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import type { Policy } from '@/types/store/policy';
  import { usePolicyStore } from '@/stores/policyStore';
  import { storeToRefs } from 'pinia';
  
  const props = defineProps({
    policies: { type: Array as PropType<Policy[]>, required:true },
    loading: { type: Boolean, default: false },
  });
  
  const policyStore = usePolicyStore();
  const { pagination } = storeToRefs(policyStore);
  
  const hoveredRow = ref<number|null>(null);
  
  const tableHeaders = [
    { title: 'Name', key: 'policy_name' },
    { title: 'Description', key: 'description' },
    { title: '#Groups', key: 'group_count', sortable:false },
    { title: '#Employees', key: 'employee_count', sortable:false },
    { title: 'Actions', key: 'actions', sortable: false, width:'100px', align:'end' },
  ];
  
  const onOptionsUpdate = (options:any) => {
    policyStore.pagination = options;
    policyStore.fetchPolicies(options);
  };
  </script>
  