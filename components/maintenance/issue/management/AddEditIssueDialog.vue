<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px" scrollable>
      <v-card class="grey-background">
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ localIssue?.id ? 'Edit Issue' : 'Add Issue' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="issueForm">
            <v-row>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" v-model="localIssue.vehicle_name" label="Vehicle Name" :items="vehicles" item-title="asset_name" item-value="id" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" v-model="localIssue.priority" :items="['Low', 'Medium', 'High']" label="Priority" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" v-model="localIssue.reported_date" label="Reported Date" type="date" required></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-textarea variant="solo" flat density="compact" v-model="localIssue.description" label="Issue Description" required></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-textarea variant="solo" flat density="compact" v-model="localIssue.notes" label="Notes"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dense @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveIssue">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, watch, defineProps, defineEmits } from 'vue';
  import type { Issue } from '~/types/maintenance/issueTypes';
  
  const props = defineProps({
    modelValue: Boolean,
    issue: {
      type: Object as any,
      default: () => ({
        id: null,
        vehicle_name: '',
        description: '',
        reported_date: '',
        priority: '',
        status: '',
        notes: '',
        attachments: [],
      }),
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'save']);
  
  const localIssue = ref<Issue>({ ...props.issue });

  const vehiclesStore = useVehicleStore();
  const vehicles = computed(() => vehiclesStore.getVehicleList);
  
  watch(() => props.issue, (newIssue) => {
    localIssue.value = { ...newIssue };
  });
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };
  
  const saveIssue = () => {
    emit('save', localIssue.value);
    emit('update:modelValue', false);
  };

  onMounted(() => {
    vehiclesStore.fetchVehicleList();
  })
  </script>
  
  <style scoped>
  </style>
  