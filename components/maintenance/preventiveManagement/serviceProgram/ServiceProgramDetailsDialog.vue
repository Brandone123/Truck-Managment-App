<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" width="80vw" height="98vh" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Service Program Details</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-table>
          <tbody>
            <tr>
              <td class="text-h6"><strong>Program ID: </strong>{{ serviceProgram.id }}</td>
            </tr>
          </tbody>
        </v-table>
        <v-table>
          <thead>
            <tr>
              <th><strong>Program Name</strong></th>
              <th><strong>Description</strong></th>
              <!-- <th><strong>Status</strong></th> -->
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ serviceProgram.program_name }}</td>
              <td>{{ serviceProgram.description }}</td>
              <!-- <td><v-chip :color="getStatusColor(serviceProgram.status)">{{ serviceProgram.status }}</v-chip></td> -->
            </tr>
          </tbody>
        </v-table>
        <v-expansion-panels>
          <v-expansion-panel elevation="0">
            <v-expansion-panel-title class="title"> Service Tasks</v-expansion-panel-title>
            <v-expansion-panel-text>
              <div v-for="(task, i) in serviceProgram.subscribed_tasks" :key="i">
                <template v-for="(service_task_id, index) in task.service_tasks" :key="index">
                  <div>
                    {{ getServiceTaskName(service_task_id) }}
                  </div>
                  <v-divider v-if="i + 1 < task.service_tasks.length"></v-divider>
                </template>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel elevation="0">
            <v-expansion-panel-title class="title"> Subscribed Vehicles</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-table>
                <thead>
                  <tr>
                    <th><strong>Vehicle ID</strong></th>
                    <th><strong>Vehicle Name</strong></th>
                    <th><strong>Subscription Date</strong></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="vehicle in serviceProgram.subscribed_vehicles">
                    <td>{{ vehicle.id }}</td>
                    <td>{{ getVehicleName(vehicle.id) }}</td>
                    <td>{{ vehicle.subscription_date }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ServiceProgram } from '@/types/maintenance/ServiceProgram';

const assetStore = useAssetStore()
const { assetList } = storeToRefs(assetStore)

const serviceTaskStore = useServiceTaskStore()
const { serviceTaskList } = storeToRefs(serviceTaskStore)

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  serviceProgram: {
    type: Object as PropType<ServiceProgram>,
    required: true,
  },
});

const getVehicleName = (vehicle_id: number) => {
  return assetList.value.find(asset => asset.id == vehicle_id)?.name
}

const getServiceTaskName = (serviceTaskId: number) => {
  const taskName = serviceTaskList.value.find(task => task.id == serviceTaskId)
  return taskName ? taskName.name : ''
}

const emit = defineEmits(['update:modelValue']);

const step = ref(1)

const close = () => {
  emit('update:modelValue', false);
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'green';
    case 'Inactive':
      return 'red';
    default:
      return '';
  }
};

watch(
  () => props.modelValue,
  (newModalValue) => {
    if (newModalValue == false) {
      step.value = 1
    }
  }
)
</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>