<!-- src/components/workforce/leave/LeaveTypeEditDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="600px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>
          {{ currentLeaveType.id ? 'Edit Leave Type' : 'Create Leave Type' }} </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="leaveTypeform">
          <v-row>
            <v-col cols="12">
              <!-- Leave Type Name -->
              <v-text-field v-model="currentLeaveType.leave_type_name" label="Leave Type Name" variant="outlined" flat
                density="compact" :rules="[validation.required, uniqueName]"></v-text-field>
            </v-col>

            <v-col cols="12">
              <!-- Description -->
              <v-textarea v-model="currentLeaveType.description" variant="outlined" flat density="compact"
                label="Description"></v-textarea>
            </v-col>

            <v-col cols="12" md="6">
              <!-- Max Days Per Year -->
              <v-text-field v-model="currentLeaveType.max_days_per_year" variant="outlined" flat density="compact"
                label="Max Days Per Year" type="number"
                :rules="[validation.required, validation.minNumber(1)]"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <!-- Carry Over Allowed -->
              <v-switch v-model="currentLeaveType.carry_over_allowed" variant="outlined" flat density="compact"
                label="Carry Over Allowed"
                :color="currentLeaveType.carry_over_allowed ? 'primary' : 'secondary'"></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveType">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { LeaveType } from '@/types/workforce/leaveRecord';
import { LeaveStore } from '@/stores/workforce/leaveStore';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  leaveType: {
    type: Object as PropType<Partial<LeaveType>>,
    required: true,
  },
});

const leaveStore = LeaveStore();

const {
  leaveTypes,
} = storeToRefs(leaveStore);

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const validation = useValidation();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Local copy of the leave type for editing
const currentLeaveType = ref<Partial<LeaveType>>({ ...props.leaveType });
const leaveTypeform = ref<HTMLFormElement | null>(null);


const uniqueName = (value: any) => {
  // Check if the condition name already exists in the list
  const isDuplicate = (leaveTypes.value || []).some(
    (leaveType) => leaveType.leave_type_name?.toLocaleLowerCase() === value?.toLocaleLowerCase() && leaveType.id != props.leaveType?.id
  )

  return !isDuplicate ? true : 'Leave type name already exists';
}

// Watch for prop changes to update the local leave type
watch(
  () => props.leaveType,
  (newVal) => {
    currentLeaveType.value = {
      ...newVal,
      carry_over_allowed: Boolean(newVal.carry_over_allowed),
    };
  },
  { immediate: true }
);

/**
 * Save the leave type by emitting the save event.
 */
const saveType = async () => {
  let formStatus = await leaveTypeform.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  // Emit the save event with the current leave type data
  emit('save', currentLeaveType.value as LeaveType);
  dialog.value = false
};

</script>

<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}
</style>