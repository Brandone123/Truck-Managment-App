<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="text-h5">
          {{ isEdit ? 'Edit Meeting' : 'Add New Meeting' }}
        </span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="isFormValid">
          <!-- Meeting Type -->
          <v-select
            v-model="meetingData.type"
            :items="['General', 'Departmental']"
            label="Meeting Type"
            :rules="[v => !!v || 'Type is required']"
            required
          />

          <!-- Department (only if type is Departmental) -->
          <v-select
            v-if="meetingData.type === 'Departmental'"
            v-model="meetingData.department"
            :items="departmentOptions"
            label="Department"
          />

          <!-- Title -->
          <v-text-field
            v-model="meetingData.title"
            label="Meeting Title"
            :rules="[v => !!v || 'Title is required']"
            required
          />

          <!-- Date -->
          <v-text-field
            v-model="meetingData.date"
            label="Date"
            type="date"
            :rules="[v => !!v || 'Date is required']"
            required
          />

          <!-- Time -->
          <v-text-field
            v-model="meetingData.time"
            label="Time"
            type="time"
          />

          <!-- Recurring Checkbox -->
          <v-checkbox
            v-model="meetingData.isRecurring"
            label="Recurring Meeting?"
          />

          <!-- End Date (only if recurring) -->
          <v-text-field
            v-if="meetingData.isRecurring"
            v-model="meetingData.endDate"
            label="End Date"
            type="date"
          />

          <!-- Meeting Link -->
          <v-text-field
            v-model="meetingData.meetingLink"
            label="Online Meeting Link (URL)"
          />

          <!-- Attendees -->
          <v-select
            v-model="meetingData.attendees"
            :items="attendeeOptions"
            label="Invite Attendees"
            multiple
            chips
          />

          <!-- Description -->
          <v-textarea
            v-model="meetingData.description"
            label="Description"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text :disabled="!isFormValid" @click="saveMeeting">
          {{ isEdit ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { MeetingStore } from '@/stores/meeting/meetingStore';
import type { Meeting } from '@/types/meeting/meeting';

interface Props {
  isEdit: boolean;
  meeting?: Meeting | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', meetingData: Partial<Meeting>): void;
}>();

// Dialog open/close
const dialog = ref(true);
const isFormValid = ref(false);

// Local reference to the store so we can access departmentOptions, attendeeOptions, etc.
const store = MeetingStore();
const departmentOptions = store.departmentOptions;
const attendeeOptions = store.attendeeOptions;

const meetingData = ref<Partial<Meeting>>({
  type: 'General',
  title: '',
  date: '',
  time: '',
  department: '',
  description: '',
  isRecurring: false,
  endDate: '',
  meetingLink: '',
  attendees: [],
});

const isEdit = computed(() => props.isEdit);

// Watch for changes in the `meeting` prop to populate or reset form
watch(
  () => props.meeting,
  (newVal) => {
    if (newVal) {
      // If editing, load existing meeting details
      meetingData.value = { ...newVal };
    } else {
      // Reset to defaults for new meeting
      meetingData.value = {
        type: 'General',
        title: '',
        date: '',
        time: '',
        department: '',
        description: '',
        isRecurring: false,
        endDate: '',
        meetingLink: '',
        attendees: [],
      };
    }
  },
  { immediate: true },
);

function closeDialog() {
  dialog.value = false;
  emit('close');
}

function saveMeeting() {
  if (!isFormValid.value) return;
  emit('save', { ...meetingData.value });
  dialog.value = false;
}
</script>

<style scoped>
/* Additional dialog styling here */
</style>
