<template>
    <div>
      <SharedUiCustomTable :show-footer-in-head="false" :headers="headers"
        :items="partMeasurementUnits" :loading="loading" @update:selectedFilters="selectedFilters = $event" :sticky-top="true"
        :sticky-top-offset="55" v-model="selectedItems" return-object>
        <template v-slot:item.actions="{ item }">
          <v-icon class="ml-2" color="primary" @click="emit('edit',item)">mdi-pencil</v-icon>
          <v-icon class="ml-2" color="red" @click="emit('delete',item.id)">mdi-delete</v-icon>
  
        </template>
  
      </SharedUiCustomTable>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
import { usePartMeasurementUnitstore } from '~/stores/maintenance/partMeasurementsUnits';
  
  const router = useRouter();
  const selectedFilters = ref<Record<string, string>>({})
  const activeFilter = ref<string>("all");
  const selectedItems = ref<Array<any>>([])
  
  const emit = defineEmits(['view', 'edit', 'delete']);
  
  
  const partMeasurementStore = usePartMeasurementUnitstore()
  const { partMeasurementUnits, loading,} = storeToRefs(partMeasurementStore)
  const headers = [
    { title: 'Name', key: 'name' },
    { title: 'Symbol', key: 'symbol' },
    { title: 'Actions', key: 'actions', sortable: false },
  ];
  
  onMounted(() => {
    partMeasurementStore.fetchPartMeasurementUnits()
  });
  </script>