<template>
    <v-card class="flex-card">
      <v-card-title>Vehicle Status</v-card-title>
      <v-card-text class="fill-height pb-0" style="overflow-y:auto">
        <v-list density="compact">
          <template v-for="(item, index) in vehicleStatus" :key="index">
            <v-list-item :title="item.title">
              <template v-slot:prepend>
                <v-avatar size="12" :color="item.color"></v-avatar>
              </template>
              <template v-slot:append>
                <v-chip :color="item.color">{{ item.count }}</v-chip>
              </template>
            </v-list-item>
            <v-divider v-if="index+1 < vehicleStatus.length"></v-divider>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">

  const vehicleStatusStore = useMaintenanceDashboardStore();
  const {vehicleStatus} = storeToRefs(vehicleStatusStore)

  </script>
  
  <style scoped>
  .flex-card {
    display: flex;
    flex-direction: column;
    height: 218px;
  }
  </style>
  