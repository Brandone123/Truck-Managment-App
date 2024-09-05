<template>
  <v-card class="flex-card">
    <v-card-title>All Faults</v-card-title>
    <v-card-text>
      <v-row class="fill-height align-center">
        <v-col cols="6" class="text-center">
          <div class="open  text-h4">{{allFaults.open}} </div>
          <div>Open</div>
        </v-col>
        <v-col cols="6" class="text-center">
          <div class="pending  text-h4">{{allFaults.pending}} </div>
          <div>Pending</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const allFaultsStore = useMaintenanceDashboardStore();
const {allFaults} = storeToRefs(allFaultsStore)
</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}

.open {
  color: red;
  font-size: 24px;
}

.pending {
  color: blue;
  font-size: 24px;
}
</style>