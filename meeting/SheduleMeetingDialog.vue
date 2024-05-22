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

    selectedDate: {
        required: false,
        default: null
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

const showScheduleButton = computed(() => {
  const currentPath = window.location.pathname;
  return currentPath === '/meeting/meeting_schedule';
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

const meetingListStore = useMeetingStore();

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
  return props.updating ? 'Meeting Info' : 'Create Meeting';
});

watch([meetingDate, meetingTime], ([date, time]) => {
  meetingInfo.value.date_and_time = `${date} ${time}`;
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Schedule Meeting';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    meetingListStore.updateMeeting(meetingInfo.value);
  } else {
    meetingListStore.createMeeting(meetingInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (meetingForm.value) {
    (meetingForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

const allowedTimeStep = (m: any) => m % 15 === 0

watch(dialog, (val) => {
  if (val && props.updating) {
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
      resetForm()
  }
})
</script>

<template>
   <v-dialog v-model="dialog" scrollable width="800px">
      <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Schedule a New Meeting
        </v-btn>
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
                    <v-text-field v-model="meetingInfo.title" variant="solo" flat label="Name" density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
            
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="date" v-model="meetingDate" label="Select Date" variant="solo" flat density="compact"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="time" format="24hr" variant="solo" flat density="compact" label="Start Time"
                        v-model="meetingTime"
                        :allowed-minutes="allowedTimeStep"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                     <v-text-field v-model="meetingInfo.duration" variant="solo" flat density="compact" :rules="[rules.required, rules.number]" label="Duration (hours)" 
                        type="number" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <!-- <v-autocomplete v-model="meetingInfo.organizer" :items="employeeList" item-text="name" item-value="id" label="Organizer"
                :rules="[rules.required]" return-object single-line required></v-autocomplete> -->
                    <v-text-field v-model="meetingInfo.organizer" variant="solo" flat label="Organizer" density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-textarea v-model="meetingInfo.agenda" variant="solo" flat density="compact" label="Agenda" rows="4" required></v-textarea>
                </v-col>

                    <!-- <v-select v-model="meetingInfo.attendees" :items="users" item-text="name" item-value="id" label="Attendees"
                    multiple chips small-chips></v-select> -->
  
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="save">
                {{ saveButtonText }}
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
