<!-- src/components/workforce/leave/LeaveRequestEditDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>
          {{ currentLeaveRequest.id ? 'Edit Leave Request' : 'Create Leave Request' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="leaveForm">
          <v-row>
            <!-- Employee Selection (Only for Creating) -->
            <v-col cols="12">
              <SharedInputEmployeeAutoCompleteInput variant="outlined" flat density="compact"
                v-if="!currentLeaveRequest.id" v-model="currentLeaveRequest.user_id" label="Employee"
                :rules="[validation.required]" @change="fetchLeaveBalances">
              </SharedInputEmployeeAutoCompleteInput>
            </v-col>

            <v-col cols="12">
              <UserLeaveBalancesAutocompleteInput v-model="currentLeaveRequest.leave_type_id"
                :userId="currentLeaveRequest.user_id" item-value="leave_type_id" label="Leave Type"
                :rules="[validation.required]" hide-no-data hide-selected variant="outlined" flat density="compact"
                clearable :hint="!currentLeaveRequest.user_id ? 'Select the employee first' : ''"
                @selection="setAlternativeData" />
            </v-col>

            <v-col cols="12" md="6">
              <!-- Start Date -->
              <v-text-field variant="outlined" flat density="compact" v-model="currentLeaveRequest.start_date"
                label="Start Date" type="date" :rules="[validation.required]"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <!-- End Date -->
              <v-text-field variant="outlined" flat density="compact" v-model="currentLeaveRequest.end_date"
                label="End Date" type="date" :rules="[validation.required, endDateAfterStartDate]" clearable
                :readonly="!currentLeaveRequest.start_date"
                :hint="!currentLeaveRequest.start_date ? 'Set start date first' : ''"
                :min="currentLeaveRequest.start_date || null">
              </v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <!-- Total Days -->
              <v-text-field v-model="currentLeaveRequest.total_days"
                label="Request Days (computed from start and end dates)" type="number" readonly variant="outlined" flat
                density="compact" :rules="[validation.minNumber(0.5, 'Set start and end dates'), validateTotalDays]"
                hint="Read only value"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select v-model="currentLeaveRequest.status" :items="statuses" lable="Status" variant="outlined" flat
                density="compact" item-value="value" item-title="text">

              </v-select>
            </v-col>

            <v-col cols="12">
              <!-- Reason -->
              <v-textarea variant="outlined" flat density="compact" v-model="currentLeaveRequest.reason"
                label="Reason"></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveRequest">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { LeaveRequest, LeaveType, LeaveBalance } from '@/types/workforce/leaveRecord';
import { useEmployeeStore } from '@/stores/employee';
import { LeaveStore } from '@/stores/workforce/leaveStore';
import { useValidation } from '~/composables/formValidation';
import { useLayoutStore } from '@/stores/useLayoutStore';
import UserLeaveBalancesAutocompleteInput from './components/UserLeaveBalancesAutocompleteInput.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  leaveRequest: {
    type: Object as PropType<Partial<LeaveRequest>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const validation = useValidation();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Local copy of the leave request for editing
const currentLeaveRequest = ref<Partial<LeaveRequest>>({ ...props.leaveRequest });
const leaveForm = ref<HTMLFormElement | null>(null);

const remainingDays = ref<number | null>(0);
const firstLoad = ref<boolean>(false);

const fetchLeaveBalances = async () => {
  if (currentLeaveRequest.value.user_id) {
    await leaveStore.fetchLeaveBalanceByUserId(currentLeaveRequest.value.user_id as number);
  }
};

const endDateAfterStartDate = (value: any) => {
  if (!value || !currentLeaveRequest.value.start_date) return 'End date is required';
  return new Date(value) >= new Date(currentLeaveRequest.value.start_date)
    ? true
    : 'End date must be greate or equal to start date';
};

const statuses = computed(() => {
  const allStatuses = [
    { text: 'Pending', value: 'Pending' },
    { text: 'Approved', value: 'Approved' },
    { text: 'Rejected', value: 'Rejected' },
    { text: 'Cancelled', value: 'Cancelled' }
  ];

  if (['Approved', 'Cancelled', 'Rejected'].includes(currentLeaveRequest.value?.status || '')) {
    return allStatuses.filter(status => status.value !== 'Pending');
  }

  return allStatuses;
});

// Watch for prop changes to update the local leave request
watch(
  () => props.leaveRequest,
  (newVal) => {
    currentLeaveRequest.value = { ...newVal };
  }
);

const validateTotalDays = (daysCount: any) => {
  if (remainingDays.value !== null && currentLeaveRequest.value.status == 'Approved' && daysCount > remainingDays.value) {
    return `Requested days cannot exceed the remaining balance of ${remainingDays.value} days.`;
  }
  return true;
};

// Fetch employee and leave type options
const leaveStore = LeaveStore();


const setAlternativeData = (leaveBalance: Record<string, any>) => {
  currentLeaveRequest.value.leave_balance_id = leaveBalance.leave_balance_id;
  remainingDays.value = leaveBalance.leave_balance_remaining_days
  leaveForm.value?.validate()
}
/**
 * Save the leave request by emitting the save event.
 */
const saveRequest = async () => {
  let formStatus = await leaveForm.value?.validate();
  if (!formStatus.valid) {
    return;
  }

  // Prepare payload
  const payload: Partial<LeaveRequest> = {
    leave_type_id: Number(currentLeaveRequest.value.leave_type_id),
    leave_balance_id: Number(currentLeaveRequest.value.leave_balance_id),
    user_id: Number(currentLeaveRequest.value.user_id),
    start_date: currentLeaveRequest.value.start_date,
    end_date: currentLeaveRequest.value.end_date,
    total_days: Number(currentLeaveRequest.value.total_days),
    reason: currentLeaveRequest.value.reason,
    status: currentLeaveRequest.value.status || 'Pending',
  };

  // If editing, exclude 'id' from payload
  if (currentLeaveRequest.value.id) {
    const { id, ...updatePayload } = payload;
    emit('save', { ...updatePayload, id: currentLeaveRequest.value.id } as LeaveRequest);
  } else {
    // If creating, ensure user_id is set
    if (!payload.user_id && currentLeaveRequest.value.user_id) {
      payload.user_id = Number(currentLeaveRequest.value.user_id);
    }
    emit('save', payload as LeaveRequest);
  }
};

// Watch for changes in start_date and end_date to calculate total_days
watch(
  [() => currentLeaveRequest.value.start_date, () => currentLeaveRequest.value.end_date],
  ([startDate, endDate]) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        const diffTime = end.getTime() - start.getTime();
        currentLeaveRequest.value.total_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include start day
      } else if (end == start) {
        currentLeaveRequest.value.total_days = 1;
      }
      else {
        currentLeaveRequest.value.total_days = 0;
      }
    } else {
      currentLeaveRequest.value.total_days = 0;
    }
  }
);

watch(() => currentLeaveRequest.value.user_id, (newVal) => {
  if (dialog.value && !currentLeaveRequest.value.id) {
    currentLeaveRequest.value.leave_type_id = undefined;
    let today = new Date().toISOString().slice(0, 10)
    currentLeaveRequest.value.start_date = today
    currentLeaveRequest.value.end_date = today
    currentLeaveRequest.value.total_days = 1
  }
})


watch(() => currentLeaveRequest.value.leave_type_id, (newVal) => {
  if (dialog.value && (!firstLoad.value || !currentLeaveRequest.value.id)) {
    let today = new Date().toISOString().slice(0, 10)
    currentLeaveRequest.value.start_date = today
    currentLeaveRequest.value.end_date = today
    currentLeaveRequest.value.total_days = 1
  } else {
    firstLoad.value = false
  }
})

watch(() => currentLeaveRequest.value.total_days, () => {
  leaveForm.value?.validate()
})

watch(() => currentLeaveRequest.value.status, () => {
  leaveForm.value?.validate()
})
</script>


<style scoped>
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
  width: auto
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
  width: auto
}
</style>