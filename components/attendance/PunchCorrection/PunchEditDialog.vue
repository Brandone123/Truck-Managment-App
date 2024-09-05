<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }} for Attendance № {{ localPunch.attendance_id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="punchForm">
          <v-row class="mt-1">
            <v-col class="pt-0" cols="12" sm="6">
              <v-text-field v-model="employeeName" label="Employee Name*" variant="solo" flat density="compact"
                readonly></v-text-field>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-text-field v-model="localPunch.correction_type" label="Correction Type*" variant="solo" flat
                density="compact" readonly></v-text-field>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-text-field v-model="localPunch.original_time" label="Original Time" readonly variant="solo" flat
                density="compact"></v-text-field>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-row justify="center" align='center'>
                <v-text-field v-model="localPunch.corrected_time" :label="corrected_time_label" style="margin-left: 13px;"
                  variant="solo" flat density="compact">
                </v-text-field>
                <input type="datetime-local" step="1" class="hidden-placeholder mr-3 bg-white pr-4"
                  style="height: 40px; width:100px; margin-bottom: 22px;" ref="nativeDateTimeInput"
                  @input="updateCorrectedTime" />
              </v-row>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-text-field v-model="localPunch.reason" label="Reason*" variant="solo" flat density="compact"
                readonly></v-text-field>
            </v-col>
            <v-col class="pt-0" cols="12" sm="6">
              <v-select v-model="localPunch.status" :items="statusOptions" item-value="value" item-title="label"
                label="Status*" variant="solo" flat density="compact"></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveRequest">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { useValidation } from '~/composables/formValidation';
import { useAttendanceStore } from '@/stores/attendance/attendance';
import { useEmployeeStore } from '@/stores/employee';
import { storeToRefs } from 'pinia';
import type { AttendancePunchCorrection } from '~/types/attendance/attendanceTypes';

const props = defineProps({
  modelValue: Boolean,
  punch: {
    type: Object as PropType<Partial<AttendancePunchCorrection>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const attendanceStore = useAttendanceStore();
const { attendanceHistory } = storeToRefs(attendanceStore);

const employeeStore = useEmployeeStore();
const { employeeList } = storeToRefs(employeeStore);

const getEmployeeName = (user_id: any) => {
  let employee = employeeList.value.find((employee: any) => employee.user_id == user_id);
  return employee ? `${employee.first_name} ${employee.last_name}` : 'N/A';
};

const employeeName = computed(() => {
  return getEmployeeName(localPunch.value.user_id);
});

const statusOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Approved', value: 'Approved' },
];

const localPunch = ref<Partial<AttendancePunchCorrection>>(
  JSON.parse(JSON.stringify(props.punch || {}))
);
const corrected_time_local = ref('');
const corrected_time_label = ref(`Corrected Time*`);
const formatted_time = ref('')

const nativeDateTimeInput = ref<HTMLInputElement | null>(null);

function extractSubstring(inputString) {
  // Define the possible starting characters
  const startChars = ['G', 'U', 'E'];
  for (const char of startChars) {
    const index = inputString.indexOf(char);

    if (index !== -1) {
      return inputString.substring(index);
    }
  }
  return null;
}
function extractPrefixUntil(inputString) {
  const startChars = ['E', 'G', 'U'];
  let minIndex = inputString.length;
  for (const char of startChars) {
    const index = inputString.indexOf(char);
    if (index !== -1 && index < minIndex) {
      minIndex = index;
    }
  }
  return minIndex < inputString.length ? inputString.substring(0, minIndex) : inputString;
}

const updateCorrectedTime = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const inputDateTime = target.value;

  const date = new Date(inputDateTime);

  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // Use 12-hour format
    timeZoneName: 'short' // Include AM/PM in the output
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  // Remove the space before the time
  const cleanedDate = formattedDate.replace(/(\s+)(\d{1,2}:\d{2}:\d{2} [APM]+)$/g, '$2');

  console.log("===== \n", localPunch.value.corrected_time, cleanedDate);

  localPunch.value.corrected_time = extractPrefixUntil(cleanedDate);
  formatted_time.value = extractPrefixUntil(cleanedDate)
};



watch(() => props.punch, (newPunch) => {
  corrected_time_label.value = ''
  localPunch.value = JSON.parse(JSON.stringify(newPunch || {}));
  corrected_time_local.value = extractSubstring(newPunch.corrected_time)
  corrected_time_label.value = `Corrected Time*(${extractSubstring(newPunch.corrected_time)})`
  localPunch.value.corrected_time = extractPrefixUntil(localPunch.value.corrected_time)
}
);

const title = computed(() => (props.punch && props.punch.id ? 'Edit Punch' : 'Add Punch'));

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
};

const saveRequest = async () => {
  closeDialog();
  const payload: Partial<AttendancePunchCorrection> = {};
  if (localPunch.value.id) {
    payload.id = localPunch.value.id;
  }
  if (formatted_time.value != '') {
    payload.corrected_time = `${localPunch.value.corrected_time}${corrected_time_local.value}`;
  }
  if (localPunch.value.status) {
    payload.status = localPunch.value.status;
  }

  // Call the appropriate store action based on the status
  if (localPunch.value.status === 'Approved') {
    await attendanceStore.approvePunchCorrection(payload);
  } else if (localPunch.value.status === 'Rejected') {
    await attendanceStore.rejectPunchCorrection(payload);
  } else if (localPunch.value.status === 'Pending') {
    await attendanceStore.pendingPunchCorrection(payload);
  }
};
</script>

<style scoped>
.grey-background {
  background-color: #f5f5f5;
}

.hidden-placeholder::-webkit-datetime-edit-text,
.hidden-placeholder::-webkit-datetime-edit {
  color: transparent;
  /* Hide the placeholder text */
}

.hidden-placeholder {
  color: black;
  /* Set the actual input text color */
}
</style>
