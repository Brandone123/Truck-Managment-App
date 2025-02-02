<!-- src/components/workforce/leave/LeaveBalanceAdjustDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>
          {{ currentLeaveBalance.id ? 'Edit Leave Balance Adjustment' : 'Create Leave Balance Adjustment' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form">
          <v-row>

            <!-- Employee Information (Read-only) -->
            <v-col cols="12">
              <SharedInputEmployeeAutoCompleteInput variant="outlined" flat density="compact"
                v-if="!currentLeaveBalance.id" v-model="currentLeaveBalance.user_id" label="Employee"
                :rules="[validation.required]"></SharedInputEmployeeAutoCompleteInput>
            </v-col>

            <!-- Leave Type Information (Read-only) -->
            <v-col cols="12" md="6">
              <v-autocomplete v-model="currentLeaveBalance.leave_type_id" :items="leaveTypeOptions"
                item-title="leave_type_name" item-value="id" label="Leave Type"
                :readonly="currentLeaveBalance.id ? true : false" :hint="currentLeaveBalance.id ? 'Readonly' : ''"
                :persistent-hint="currentLeaveBalance.id ? true : false" :rules="[validation.required]" hide-no-data
                hide-selected variant="outlined" flat density="compact" clearable></v-autocomplete>
            </v-col>

            <!-- Year (Read-only) -->
            <v-col cols="12" md="6">
              <v-text-field v-model.number="currentLeaveBalance.year" label="Year" variant="outlined" density="compact"
                type="year" readonly hint="Readonly" persistent-hint></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <!-- Allocated Days Change -->
              <v-text-field v-model.number="currentLeaveBalance.allocated_days" :label="allocatedDaysLabel"
                type="number" density="compact" variant="outlined" :rules="[allocatedDaysValidator]"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <!-- Used Days Change -->
              <v-text-field v-model.number="currentLeaveBalance.used_days" :label="usedDaysLabel" type="number"
                density="compact" variant="outlined" :rules="[usedDaysValidator]"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveAdjustment">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { LeaveBalance } from '@/types/workforce/leaveRecord';
import { LeaveStore } from '@/stores/workforce/leaveStore';
import { useLayoutStore } from '@/stores/useLayoutStore';

import { useValidation } from '@/composables/formValidation'

const validation = useValidation()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  leaveBalance: {
    type: Object as PropType<Partial<LeaveBalance>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const leaveStore = LeaveStore();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Local copy of the leave balance for adjustment
const currentLeaveBalance = ref<Partial<LeaveBalance>>({ ...props.leaveBalance });

const form = ref<HTMLFormElement | null>(null);

// Watch for prop changes to update the local leave balance
watch(
  () => props.leaveBalance,
  (newVal) => {
    currentLeaveBalance.value = { ...newVal };
  }
);

// Reactive labels
const allocatedDaysLabel = computed(() => {
  return currentLeaveBalance.value?.id ? 'Change allocated days' : 'Allocated days';
});

const usedDaysLabel = computed(() => {
  return currentLeaveBalance.value?.id ? 'Change used days' : 'Used days';
});

const leaveTypeOptions = computed(() => {
  return leaveStore.leaveTypes;
});

/**
 * Save the leave balance adjustment by emitting the save event.
 */
const saveAdjustment = async () => {
  let formStatus = await form.value?.validate()
  if (!formStatus?.valid) {
    return;
  }

  let payload = { ...currentLeaveBalance.value }
  // Emit the save event with the current leave balance adjustment data
  emit('save', payload);
};

/**
 * Validator for used days.
 * Ensures used days do not exceed allocated days.
 */
const usedDaysValidator = (value: any) => {
  // Allow empty or null values if they are valid in your context
  if (value === null || value === undefined) {
    return true;
  }

  // Ensure the value is a number
  const usedDays = Number(value);
  const allocatedDays = Number(currentLeaveBalance.value?.allocated_days || 0);

  if (isNaN(usedDays)) {
    return `Used days must be a valid number`;
  }

  if (usedDays < 0) {
    return `Used days cannot be negative`;
  }

  if (usedDays > allocatedDays) {
    return `Used days cannot exceed allocated days (${allocatedDays})`;
  }

  return true;
}



/**
 * Validator for used days.
 * Ensures used days do not exceed allocated days.
 */
const allocatedDaysValidator = (value: any) => {
  // Allow empty or null values if they are valid in your context
  if (value === null || value === undefined) {
    return true;
  }

  // Ensure the value is a number
  const allocatedDays = Number(value);
  const usedDays = Number(currentLeaveBalance.value?.used_days || 0);

  if (isNaN(allocatedDays)) {
    return `Used days must be a valid number`;
  }

  if (allocatedDays < 0) {
    return `Used days cannot be negative`;
  }

  if (usedDays > allocatedDays) {
    return `Allocated days must exceed used days (${usedDays})`;
  }

  return true;
}

/**
 * Close the dialog without saving.
 */
const closeDialog = () => {
  emit('close');
};
</script>

<style scoped>
/* Optional: Add any custom styles here */
</style>
