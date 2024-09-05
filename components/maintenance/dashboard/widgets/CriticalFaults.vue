<template>
  <v-card class="flex-card">
    <v-card-title>Critical Faults</v-card-title>
    <v-card-text class="fill-height pb-0" style="overflow-y:auto">
      <v-list density="compact" v-if="criticalFaults.length">
        <template v-for="(item, index) in criticalFaults" :key="index">
          <v-list-item :title="item.title" :subtitle="item.date">
          </v-list-item>
          <v-divider v-if="index + 1 < criticalFaults.length"></v-divider>
        </template>
      </v-list>
      <div v-else class="fill-height d-flex justify-center align-center">
        <span>No Results</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">

const criticalFaultStore = useMaintenanceDashboardStore();
const {criticalFaults} = storeToRefs(criticalFaultStore)
</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}
</style>