<!-- src/components/workforce/leave/LeaveAccrualEditDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>
          {{ currentLeaveAccrual.id ? 'Edit Leave Accrual' : 'Add Leave Accruel' }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="leaveAccrualform">
          <v-row>
            <v-col cols="12">
              <!-- Employee Selection -->
              <SharedInputEmployeeAutoCompleteInput variant="outlined" flat density="compact"
                v-if="!currentLeaveAccrual.id" v-model="currentLeaveAccrual.user_id" label="Employee"
                :rules="[validation.required]">
              </SharedInputEmployeeAutoCompleteInput>
            </v-col>

            <v-col cols="12">
              <!-- Leave Type Selection -->
              <v-autocomplete v-model="currentLeaveAccrual.leave_type_id" :items="leaveTypeOptions"
                item-title="leave_type_name" item-value="id" label="Leave Type" :rules="[validation.required]"
                hide-no-data hide-selected clearable variant="outlined" density="compact" flat :readonly="currentLeaveAccrual.id ? true: false" :hint="currentLeaveAccrual.id ? 'Readonly': null"></v-autocomplete>
            </v-col>

            <v-col>
              <!-- Accrual Date -->
              <v-text-field v-model="currentLeaveAccrual.accrual_date" label="Accrual Date" type="date"
                variant="outlined" density="compact" flat :rules="[validation.required]"></v-text-field>
            </v-col>

            <v-col>
              <!-- Accrual Days -->
              <v-text-field v-model="currentLeaveAccrual.accrual_days" label="Accrual Days" type="number"
                variant="outlined" density="compact" flat
                :rules="[validation.required, validation.minNumber(0.5, 'Must be at least 0.5 days')]"></v-text-field>
            </v-col>

          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveAccrual">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { LeaveAccrual } from '@/types/workforce/leaveRecord';
import { LeaveStore } from '@/stores/workforce/leaveStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  leaveAccrual: {
    type: Object as PropType<Partial<LeaveAccrual>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Local copy of the leave accrual for editing
const currentLeaveAccrual = ref<Partial<LeaveAccrual>>({ ...props.leaveAccrual });
const leaveAccrualform = ref<HTMLFormElement | null>(null);

// Watch for prop changes to update the local leave accrual
watch(
  () => props.leaveAccrual,
  (newVal) => {
    currentLeaveAccrual.value = { ...newVal };
  }
);

// Fetch employee and leave type options
// const employeeStore = useEmployeeStore();
const validation = useValidation();
const leaveStore = LeaveStore();


const leaveTypeOptions = computed(() => {
  return leaveStore.leaveTypes;
});

onMounted(async () => {
  if (leaveStore.leaveTypes.length === 0) {
    await leaveStore.fetchLeaveTypes();
  }
});

/**
 * Save the leave accrual by emitting the save event.
 */
const saveAccrual = async () => {
  let formStatus = await leaveAccrualform.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  // Prepare payload
  const payload: Partial<LeaveAccrual> = { ...currentLeaveAccrual.value };

  // Emit the save event with the current leave accrual data
  emit('save', payload as LeaveAccrual);

  dialog.value = false;
};
</script>

