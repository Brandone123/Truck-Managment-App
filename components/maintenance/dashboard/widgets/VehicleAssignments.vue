<template>
  <v-card class="flex-card">
    <v-card-title>Vehicle Assignments</v-card-title>
    <v-card-text>
      <v-row class="fill-height align-center">
        <v-col cols="6" class="text-center">
          <div class="assigned  text-h4">{{vehicleAssignments.Assigned}} </div>
          <div>Assigned</div>
        </v-col>
        <v-col cols="6" class="text-center">
          <div class="unassigned  text-h4">{{ vehicleAssignments.Unassigned }} </div>
          <div>Unassigned</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const vehicleAssignmentStore = useMaintenanceDashboardStore();
const {vehicleAssignments} = storeToRefs(vehicleAssignmentStore)

</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}

.assigned {
  color: green;
  font-size: 24px;
}

.unassigned {
  color: orange;
  font-size: 24px;
}
</style>