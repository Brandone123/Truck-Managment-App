<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Service Task #{{ serviceTask.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="font-weight-bold">Details</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Service Name</v-col>
                      <v-col cols="12" md="6">{{ serviceTask.name }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Description</v-col>
                      <v-col cols="12" md="6">{{ serviceTask.description }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Is A Group</v-col>
                      <v-col cols="12" md="6">{{ serviceTask.is_group ? 'Yes' : 'No' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Expected Labor Hours</v-col>
                      <v-col cols="12" md="6">{{ serviceTask.expected_labor_hours }}</v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-card v-if="serviceTask.is_group">
              <v-card-title class="font-weight-bold">Service Tasks</v-card-title>
              <v-card-text>
                <v-table>
                  <thead>
                    <tr>
                      <th><strong>Task</strong></th>
                      <th><strong>Description</strong></th>
                    </tr>
                  </thead>
                  <tbody v-if="serviceTask.subtasks && serviceTask.subtasks.length > 0">
                    <tr v-for="subtask in serviceTask.subtasks">
                      <td>{{ subtask.name }}</td>
                      <td>{{ subtask.description }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
            <v-card v-else>
              <v-card-title class="font-weight-bold">Parts Used</v-card-title>
              <v-card-text>
                <v-table>
                  <thead>
                    <tr>
                      <th><strong>Part</strong></th>
                      <th><strong>Location</strong></th>
                      <th><strong>Quantity</strong></th>
                    </tr>
                  </thead>
                  <tbody v-if="serviceTask.parts !== null && serviceTask.parts.length > 0">
                    <tr v-for="part in serviceTask.parts">
                      <td>{{ part.part_number }}</td>
                      <td>{{ getLocationName(part.pivot.part_location_id, part.locations) }}</td>
                      <td>{{ part.pivot.quantity }}</td>
                    </tr>
                  </tbody>
                </v-table>
                <div v-if="!hasPart" style="font-size: small; align-content: center;"
                  class="text-center text-grey pa-5">
                  <span class="text-center text-grey">Parts have not been added to this Service Task yet.</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  serviceTask: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const getLocationName = (locationId: number, inventoryLocations: any[]) => {
  return inventoryLocations.find(inventoryLocation => inventoryLocation.location_id == locationId)?.location_name;
}

const closeDialog = () => {
  emit('update:modelValue', false);
};

const hasPart = computed(() => {
  if (props.serviceTask) {
    if (props.serviceTask.parts && props.serviceTask.parts.length > 0) {
      return true;
    }
  }
  return false;
})
</script>

<style scoped></style>