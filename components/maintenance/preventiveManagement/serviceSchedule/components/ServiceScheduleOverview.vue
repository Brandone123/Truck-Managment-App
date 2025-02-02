<template>
  <div class="flex-grow-1" style="overflow-y: auto; position: relative; height: 100vh;">
    <v-row no-gutters>
      <v-col cols="12" md="6" class="pa-2">
        <v-card>
          <v-card-title class="font-weight-bold">Details</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">Vehicle Name</v-col>
              <v-col cols="12" md="6">
                <SharedTableDynamicVehicleItem :vehicle="serviceSchedule.vehicle" v-if="serviceSchedule.vehicle" />
                <span v-else>N/A</span>
              </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col cols="12" md="6">Program Name</v-col>
              <v-col cols="12" md="6">
                <SharedTableDynamicProgramItem :program="serviceSchedule.program" v-if="serviceSchedule.program" />
                <span v-else>N/A</span>
              </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col cols="12" md="6">Due Date</v-col>
              <v-col cols="12" md="6">{{ serviceSchedule.due_date }}</v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col cols="12" md="6">Status</v-col>
              <v-col cols="12" md="6">
                <v-chip density="compact" variant="flat" :color="getStatusColor(serviceSchedule.status)">
                  {{ serviceSchedule.status }}
                </v-chip>
              </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  serviceSchedule: {
    type: Object as any,
    required: true,
  },
  loadingDetails: {
    type: Boolean
  }
});

const getStatusColor = (status: string) => {
  switch ((status || '')) {
    case 'Completed':
      return 'primary';
    case 'Overdue':
      return 'orange';
    case 'Upcoming':
      return 'pink';
    default:
      return 'grey';
  }
}

</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}

.spinner-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>