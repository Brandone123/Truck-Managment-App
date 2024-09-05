<template>
  <v-card class="flex-card">
    <v-card-title>Overdue Inspections</v-card-title>
    <v-card-text>
      <v-row class="fill-height align-center">
        <v-col cols="6" class="text-center">
          <div class="overdue  text-h4">{{overdueInspections.overdue}} </div>
          <div>Overdue</div>
        </v-col>
        <v-col cols="6" class="text-center">
          <div class="total-due  text-h4">{{overdueInspections.totalDue}} %</div>
          <div>% of Total Due</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">   
const overdueInspectionStore = useMaintenanceDashboardStore();
const {overdueInspections} = storeToRefs(overdueInspectionStore)
</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}

.overdue {
  color: blue;
  font-size: 24px;
}

.total-due {
  color: blue;
  font-size: 24px;
}
</style>