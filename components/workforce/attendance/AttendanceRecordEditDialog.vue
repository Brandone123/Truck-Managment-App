<template>
  <v-dialog v-model="dialog" max-width="600px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ currentAttendanceRecord.id ? 'Edit Attendance Record' : 'Create Attendance Record'
          }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="attendanceForm">
          <v-row>
            <v-col cols="12" class="pt-0">
              <SharedInputEmployeeAutoCompleteInput variant="outlined" flat density="compact"
                v-if="!currentAttendanceRecord.id" v-model="currentAttendanceRecord.user_id" label="Employee"
                :rules="[validation.required]">
              </SharedInputEmployeeAutoCompleteInput>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-text-field variant="outlined" flat density="compact" v-if="!currentAttendanceRecord.id"
                v-model="currentAttendanceRecord.date" label="Date" type="date"
                :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pt-0">
              <v-text-field ref="timePickerRef" variant="outlined" flat density="compact" v-model="currentAttendanceRecord.clock_in_time"
                label="Clock In Time" type="time" :rules="[validation.required]" step="1"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pt-0">
              <v-text-field variant="outlined" flat density="compact" v-model="currentAttendanceRecord.clock_out_time"
                label="Clock Out Time" type="time" step="1" :rules=[validateClockOutTime] clearable
                :readonly="!currentAttendanceRecord.clock_in_time"
                :hint="!currentAttendanceRecord.clock_in_time ? 'Set Clock In Time first' : ''"
                :min="currentAttendanceRecord.clock_in_time || null"></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-textarea variant="outlined" flat density="compact" v-model="currentAttendanceRecord.notes"
                label="Notes" hide-details></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveRecord">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { AttendanceRecord } from '@/types/workforce/attendanceRecord';
import { useEmployeeStore } from '@/stores/employee';
import { useValidation } from '~/composables/formValidation';
import moment from 'moment';

const validation = useValidation();

const timePickerRef = ref(null);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  attendanceRecord: {
    type: Object as PropType<Partial<AttendanceRecord>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentAttendanceRecord = ref<Partial<AttendanceRecord>>({ ...props.attendanceRecord });
const attendanceForm = ref<HTMLFormElement | null>(null);

watch(
  () => props.attendanceRecord,
  (newRecord) => {
    currentAttendanceRecord.value = {
      ...newRecord,
      clock_in_time: newRecord.clock_in_time ? moment(newRecord.clock_in_time).local().format('HH:mm:ss') : '',
      clock_out_time: newRecord.clock_out_time ? moment(newRecord.clock_out_time).local().format('HH:mm:ss') : '',
    };
  }
);

// fetch employees for selecting employee when creating record
const validateClockOutTime = (value: string) => {
  const clockInTime = currentAttendanceRecord.value.clock_in_time;
  if (!clockInTime) {
    return true; // Skip validation if clock-in time is not set
  }
  if (new Date('1970-01-01T' + value).getTime() <= new Date('1970-01-01T' + clockInTime).getTime()) {
    return 'Must be greater than Clock In Time.';
  }
  return true;
};


const saveRecord = async () => {
  let formStatus = await attendanceForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  let payload = {
    ...currentAttendanceRecord.value,
    clock_in_time: new Date(`${currentAttendanceRecord.value.date} ${currentAttendanceRecord.value.clock_in_time as string}`).toISOString(),
    clock_out_time: new Date(`${currentAttendanceRecord.value.date} ${currentAttendanceRecord.value.clock_out_time as string}`).toISOString(),
  }

  emit('save', payload);
};
</script>


<style scoped>
.v-toolbar-title {
  flex: auto !important;
}

.v-text-field :deep(input[type="time"].v-field__input::-webkit-calendar-picker-indicator) {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width:auto
}

.v-text-field :deep(input[type="date"].v-field__input::-webkit-calendar-picker-indicator) {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width:auto
}
</style>