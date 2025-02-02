<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>
          {{ currentSchedule.id ? 'Edit Schedule' : 'Create Schedule' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="scheduleForm">
          <v-row>
            <v-col cols="12">
              <SharedInputEmployeeAutoCompleteInput variant="outlined" flat density="compact"
                v-model="currentSchedule.user_id" label="Employee*" :rules="[validation.required]">
              </SharedInputEmployeeAutoCompleteInput>
            </v-col>
            <v-col cols="12">
              <v-autocomplete variant="outlined" flat density="compact" v-model="currentSchedule.shift_id"
                :items="shiftOptions" item-title="shift_name" item-value="id" label="Shift" clearable></v-autocomplete>

            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" flat density="compact" v-model="currentSchedule.schedule_date"
                label="Schedule Date*" type="date" :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete variant="outlined" flat density="compact" v-model="currentSchedule.route_id"
                :items="routeOptions" item-title="route_name" item-value="id" label="Route" clearable></v-autocomplete>

            </v-col>
            <v-col cols="12" md="6">
              <v-select variant="outlined" flat density="compact" v-model="currentSchedule.status"
                :items="statusOptions" item-title="text" item-value="value" label="Status*"
                :rules="[validation.required]"></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveSchedule">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { Schedule } from '@/types/workforce/schedule';
import { ScheduleStore } from '@/stores/workforce/scheduleStore';
import { useEmployeeStore } from '@/stores/employee';
//import { useRoleStore } from '@/stores/roleStore'; // If roles are needed
import { useLayoutStore } from '@/stores/useLayoutStore'; // Adjust the import as per actual store
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  schedule: {
    type: Object as PropType<Partial<Schedule>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentSchedule = ref<Partial<Schedule>>({ ...props.schedule });

const scheduleForm = ref<HTMLFormElement | null>(null);

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

// Status options
const statusOptions = [
  { text: 'Scheduled', value: 'Scheduled' },
  { text: 'Completed', value: 'Completed' },
  { text: 'Cancelled', value: 'Cancelled' },
];

// Fetch data on mounted
onMounted(async () => {
  await scheduleStore.fetchShifts();
});

// Watch for changes in props.schedule
watch(
  () => props.schedule,
  (newSchedule) => {
    currentSchedule.value = { ...newSchedule };
  }
);

const saveSchedule = async () => {
  let formStatus = await scheduleForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  // Emit save event
  emit('save', currentSchedule.value as Schedule);
};

const closeDialog = () => {
  emit('close');
};
</script>

<style scoped>
/* Add any necessary styles */
</style>