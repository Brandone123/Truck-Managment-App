<template>
    <v-card class="flex-card">
      <v-card-title>Vehicle Locations</v-card-title>
      <v-card-text class="fill-height pb-0" style="overflow-y:auto">
        <v-list density="compact">
          <template v-for="(item, index) in workOrders" :key="index">
            <v-list-item :title="item.title">
              <item v-slot:append>
                <v-chip>{{ item.count }}</v-chip>
              </item>
            </v-list-item>
            <v-divider v-if="index+1 < workOrders.length"></v-divider>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">

  const vehicleLocationStore = useMaintenanceDashboardStore();
const {vehicleLocations} = storeToRefs(vehicleLocationStore)
const workOrders = vehicleLocations

  </script>
  
  <style scoped>
  .flex-card {
    display: flex;
    flex-direction: column;
    height: 218px;
  }
  </style>
  