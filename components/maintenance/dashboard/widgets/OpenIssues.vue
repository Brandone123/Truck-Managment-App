<template>
  <!-- person of interest -->
  <v-card class="flex-card">
    <v-card-title>Open Issues</v-card-title>
    <v-card-text>
      <v-row class="fill-height align-center">
        <v-col cols="6" class="text-center">
          <div class="open text-h4">{{ openIssues.dueSoon }} </div>
          <div>Open</div>
        </v-col>
        <v-col cols="6" class="text-center">
          <div class="overdue text-h4">{{ openIssues.overdue }} </div>
          <div>Overdue</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">

const maintenanceStore = useMaintenanceDashboardStore();
 const {openIssues}  = storeToRefs(maintenanceStore)

</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}

.open {
  color: orange;
  font-size: 24px;
}

.overdue {
  color: red;
  font-size: 24px;
}
</style>