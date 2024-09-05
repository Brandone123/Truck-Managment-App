<template>
  <SharedUiCustomTable :showFooterInHead="false" :headers="recallHeaders" :items="recalls" :loading="loading">
    <template v-slot:item.actions="{ item }">
      <v-icon class="ml-2" color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
      <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
      <v-icon class="ml-2" color="red" dense @click="$emit('delete', item)">mdi-delete</v-icon>
    </template>
  </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRecallsStore } from '@/stores/maintenance/recallsStore';
import type { Asset } from '~/types/maintenance/assetTypes';
import type { Recall } from '~/types/maintenance/recallsTypes';

const recallsStore = useRecallsStore();
const { recallsList, loading } = storeToRefs(recallsStore)

const assetStore = useAssetStore()
const { assetList } = storeToRefs(assetStore)

const recalls = computed(() => {
  return recallsList.value.map(recall => {
    return {
      ...recall,
      vehicle: assetList.value.find((asset: Asset) => asset.id == recall.vehicle_id) as Asset || {} as Asset
    }
  })
})

const recallHeaders = [
  { title: 'Recall ID', key: 'id' },
  { title: 'Vehicle ID', key: 'vehicle_id' },
  { title: 'Vehicle Name', key: 'vehicle.name' },
  { title: 'Make', key: 'vehicle.make' },
  { title: 'Model', key: 'vehicle.model' },
  { title: 'Year', key: 'vehicle.year' },
  // { title: 'Recall Date', key: 'recallDate' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions' },
];
</script>