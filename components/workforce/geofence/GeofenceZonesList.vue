<template>
    <SharedUiServerTable
      :items="geofenceZones"
      :headers="tableHeaders"
      :loading="loading"
      @update:options="onOptionsUpdate"
    >
      <template v-slot:item.actions="{ item, index }">
       <!-- <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu> -->
        <!-- Single Action Icons -->
      <v-icon small @click="$emit('edit', item)" color="green">mdi-pencil</v-icon>
      <v-icon small @click="$emit('delete', item.id)" color="red">mdi-delete</v-icon>
      </template>
    </SharedUiServerTable>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import type { GeofenceZone } from '@/types/workforce/attendanceRecord';
  import { useGeofenceZoneStore } from '@/stores/workforce/geofenceZoneStore';
  import { storeToRefs } from 'pinia';
  
  const props = defineProps({
    geofenceZones: {
      type: Array as PropType<GeofenceZone[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
  
  const geofenceZoneStore = useGeofenceZoneStore();
  const { pagination } = storeToRefs(geofenceZoneStore);
  
  const hoveredRow = ref<number | null>(null);
  
  const tableHeaders = [
    { title: 'Name', key: 'zone_name' },
    { title: 'Description', key: 'description' },
    { title: 'Latitude', key: 'latitude' },
    { title: 'Longitude', key: 'longitude' },
    { title: 'Radius (m)', key: 'radius_meters' },
    { title: '', key: 'actions', sortable: false, width: '100px', align: 'end' },
  ];
  
  const onOptionsUpdate = (options: any) => {
    geofenceZoneStore.pagination = options;
    geofenceZoneStore.fetchGeofenceZones(options);
  };
  </script>
  