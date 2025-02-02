<template>
  <v-dialog v-model="dialog" max-width="600px" scrollable persistent>
    <v-card><v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ currentShift.id ? 'Edit Shift' : 'Create Shift'
          }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="shiftForm">
          <v-row>
            <v-col cols="12">
              <v-text-field variant="outlined" flat density="compact" v-model="currentShift.shift_name"
                label="Shift Name*" :rules="[validation.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" flat density="compact" type="time" v-model="currentShift.start_time"
                label="Start Time*" format="24hr" :rules="[validation.required]" full-width></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" flat density="compact" type="time" v-model="currentShift.end_time"
                label="End Time*" format="24hr" :rules="[validateShiftTime]" full-width
                :readonly="!currentShift.start_time" :hint="!currentShift.start_time ? 'Set Start Time first' : ''"
                :min="currentShift.start_time || null"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea variant="outlined" flat density="compact" v-model="currentShift.description"
                label="Description" :rules="[]"></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveShift">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import type { Shift } from '@/types/workforce/schedule';
import { ScheduleStore } from '@/stores/workforce/scheduleStore';
import { useLayoutStore } from '@/stores/useLayoutStore'; // Adjust the import as per actual store
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  shift: {
    type: Object as PropType<Partial<Shift>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentShift = ref<Partial<Shift>>({ ...props.shift });

const shiftForm = ref<HTMLFormElement | null>(null);

// Stores
const scheduleStore = ScheduleStore();
const layoutStore = useLayoutStore();

// Watch for changes in props.shift
watch(
  () => props.shift,
  (newShift) => {
    currentShift.value = { ...newShift };
  }
);

const validateShiftTime = (value: string) => {
  if (!value) {
    return 'Required'
  }

  const startTime = currentShift.value.start_time;

  if (new Date(`1970-01-01T${value}`).getTime() <= new Date(`1970-01-01T${startTime}`).getTime()) {
    return 'End time must be greater than start time.';
  }
  return true;
};


function ensureTimeWithSeconds(time: string) {
  // Match the format H:i or H:i:s using regex
  const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

  if (!timeRegex.test(time)) {
    throw new Error("Invalid time format");
  }

  // Check if the input is in H:i format (doesn't have seconds)
  if (time.length === 5) {
    return `${time}:00`; // Append :00 for seconds
  }

  return time; // Already in H:i:s format
}

const saveShift = async () => {
  let formStatus = await shiftForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  let payload = {
    ...currentShift.value,
    start_time: ensureTimeWithSeconds(currentShift.value.start_time as string),
    end_time: ensureTimeWithSeconds(currentShift.value.end_time as string)
  }

  // Emit save event
  emit('save', payload);
};
</script>

<style scoped>
/* Add any necessary styles */
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

</style>