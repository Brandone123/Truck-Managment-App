<template>
  <v-card class="flex-card">
       <!-- person of interest -->
    <v-card-title>Service Reminders</v-card-title>
    <v-card-text>
      <v-row class="fill-height align-center">
        <v-col cols="6" class="text-center">
          <div class="overdue text-h4">{{ ServiceReminders.overdue }}</div>
          <div>Overdue</div>
        </v-col>
        <v-col cols="6" class="text-center">
          <div class="due-soon text-h4">{{ ServiceReminders.dueSoon}} </div>
          <div>Due Soon</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">

const serviceStore = useMaintenanceDashboardStore();
const { ServiceReminders} = storeToRefs(serviceStore);


</script>

<style scoped>
.flex-card {
  display: flex;
  flex-direction: column;
  height: 218px;
}

.overdue {
  color: red;
  font-size: 24px;
}

.due-soon {
  color: orange;
  font-size: 24px;
}
</style>