<template>
  <v-card class="flex-card">
    <v-card-title>On-Time Service Compliance</v-card-title>
    <v-card-text>
      <v-row class="fill-height align-center">
        <v-col cols="6" class="text-center">
          <div class="all-time  text-h4">{{onTImeService.overdue }} %</div>
          <div>All Time</div>
        </v-col>
        <v-col cols="6" class="text-center">
          <div class="last-30-days  text-h4">{{onTImeService.totalDue}} %</div>
          <div>Last 30 Days</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const onTImeServiceStore = useMaintenanceDashboardStore();
const {onTImeService} = storeToRefs(onTImeServiceStore)
</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}

.all-time {
  color: green;
  font-size: 24px;
}

.last-30-days {
  color: orange;
  font-size: 24px;
}
</style>