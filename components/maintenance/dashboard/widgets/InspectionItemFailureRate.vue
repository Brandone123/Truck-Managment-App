<template>
  <v-card class="flex-card">
    <v-card-title>Inspection Item Failure Rate</v-card-title>
    <v-card-text>
      <v-row class="fill-height align-center">
        <v-col cols="6" class="text-center">
          <div class="this-week text-h4">{{inspectionItems.overdue}} %</div>
          <div>This Week</div>
        </v-col>
        <v-col cols="6" class="text-center">
          <div class="change text-h4">{{inspectionItems.totalDue}} %</div>
          <div>Change From Last Week</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const inspectionItemStore = useMaintenanceDashboardStore();
const {inspectionItems} = storeToRefs(inspectionItemStore)
</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}

.this-week {
  color: blue;
  font-size: 24px;
}

.change {
  color: blue;
  font-size: 24px;
}
</style>