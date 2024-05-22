<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useMeetingStore } from '@/stores/meeting';
import { ref, computed, watch } from 'vue';
import type { MeetingInfo } from '@/types/meeting/meeting';

const emit = defineEmits(['update:show', 'addMeeting', 'editMeeting']);

const props = defineProps({
    item: {
        type: Object as () => MeetingInfo,
        required: false,
    },

    updating: {
        type: Boolean,
        default: false
    },

    show: {
        type: Boolean,
        default: false
    },
});

const dialog = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    emit('update:show', newValue);
  },
});

const meetingForm = ref(null);

const employeeListStore = useEmployeeStore();

const meetingDate = ref('');
const meetingTime = ref('');

const defaultMeeting = ref<MeetingInfo>({
  id: null,
  title: null,
  date_and_time: null,
  duration: null,
  organizer: null,
  agenda: null,
})

const meetingInfo = ref(defaultMeeting.value);

const title = computed(() => {
  return props.show ? 'Meeting Info' : '';
});

watch([meetingDate, meetingTime], ([date, time]) => {
  meetingInfo.value.date_and_time = `${date} ${time}`;
});


const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const exportData = () => {
    return;
}

const resetForm = () => {
  if (meetingForm.value) {
    (meetingForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

const allowedTimeStep = (m: any) => m % 15 === 0

watch(dialog, (val) => {
  if (val && props.show) {
      meetingInfo.value = Object.assign({}, props.item as MeetingInfo)
      if (meetingInfo.value.date_and_time) {
        const [date, time] = meetingInfo.value.date_and_time.split(' ');
        meetingDate.value = date;
        meetingTime.value = time;
      } else {
        meetingDate.value = '';
        meetingTime.value = '';
      }
    } else {
        resetForm();
        dialog.value = false
  }
})
</script>

<template>
   <v-dialog v-model="dialog" scrollable width="800px">
      <template v-slot:activator="{ props }">
          <v-btn density="comfortable" color="primary" flat v-bind="props" 
          class="text-none" @click="exportData">Export Data</v-btn>
      </template>
    <v-card class="grey-background">
        <v-toolbar color="primary" :title="title" density="compact">
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="meetingForm">

            <v-row class="my-4">
                <v-col cols="12" class="pb-0">
                    <v-text-field readonly v-model="meetingInfo.title" variant="solo" flat label="Name" density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
            
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field readonly type="date" v-model="meetingDate" label="Select Date" variant="solo" flat density="compact"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field readonly type="time" format="24hr" variant="solo" flat density="compact" label="Start Time"
                        v-model="meetingTime"
                        :allowed-minutes="allowedTimeStep"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                     <v-text-field readonly v-model="meetingInfo.duration" variant="solo" flat density="compact" :rules="[rules.required, rules.number]" label="Duration (hours)" 
                        type="number" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field readonly v-model="meetingInfo.organizer" variant="solo" flat label="Organizer" density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-textarea readonly v-model="meetingInfo.agenda" variant="solo" flat density="compact" label="Agenda" rows="4" required></v-textarea>
                </v-col>
  
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>
