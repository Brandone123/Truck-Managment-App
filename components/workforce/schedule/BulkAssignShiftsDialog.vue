<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Bulk Assign Shifts</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="scheduleForm">
          <v-row>
            <v-col cols="12">
              <SharedInputEmployeeAutoCompleteInput variant="outlined" flat density="compact" multiple
                v-model="selectedEmployees" label="Select Employees*" :rules="[validation.required]">
              </SharedInputEmployeeAutoCompleteInput>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete variant="outlined" flat density="compact" v-model="selectedShiftId" :items="shiftOptions"
                item-title="shift_name" item-value="id" label="Shift" clearable></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" flat density="compact" v-model="scheduleDate" label="Schedule Date*"
                type="date" :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete variant="outlined" flat density="compact" v-model="selectedRouteId" :items="routeOptions"
                item-title="route_name" item-value="id" label="Route" clearable></v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveBulkAssign">Assign Shifts</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
// import type { BulkAssignPayload } from '@/types/workforce/schedule';
import { ScheduleStore } from '@/stores/workforce/scheduleStore';
// import { useRoleStore } from '@/stores/roleStore'; // If needed
import { useLayoutStore } from '@/stores/useLayoutStore'; // Adjust the import as per actual store
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const scheduleForm = ref<HTMLFormElement | null>(null);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Selected values
const selectedEmployees = ref<number[]>([]);
const selectedShiftId = ref<number | null>(null);
const scheduleDate = ref<string>('');
const selectedRouteId = ref<number | null>(null);

// Stores
const scheduleStore = ScheduleStore();
const layoutStore = useLayoutStore();

// Dummy route data
const routeOptions = ref([
  { id: 1, route_name: 'Route A' },
  { id: 2, route_name: 'Route B' },
  { id: 3, route_name: 'Route C' },
]);

const shiftOptions = computed(() => scheduleStore.shifts);

// Fetch data on mounted
onMounted(async () => {
  // if (employeeStore.employeeList.length === 0) {
  //   await employeeStore.fetchEmployeeList({});
  // }
  // if (scheduleStore.shifts.length === 0) {
  await scheduleStore.fetchShifts();
  // }
});

// Watch for changes in props.modelValue to reset form when dialog is closed
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === false) {
      // Reset form when dialog is closed
      selectedEmployees.value = [];
      selectedShiftId.value = null;
      scheduleDate.value = '';
      selectedRouteId.value = null;
    }
  }
);

const saveBulkAssign = async () => {
  let formStatus = await scheduleForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  let payload = {
    user_ids: selectedEmployees.value,
    shift_id: selectedShiftId.value,
    schedule_date: scheduleDate.value,
    route_id: selectedRouteId.value || undefined,
  }

  emit('save', payload);
};
</script>

<style scoped>
/* Add any necessary styles */
</style>