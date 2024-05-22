<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ref, computed, watch } from 'vue';
import type { MeetingBlockerInfo } from '@/types/meeting/meeting_blocker';
import { useMeetingBlockerStore } from '~/stores/meeting_blocker';
import { storeToRefs } from 'pinia';
import {useMeetingResolutionStore} from '~/stores/meeting_resolution';

const emit = defineEmits(['update:show', 'addMeetingBlocker', 'editMeetingBlocker']);

const props = defineProps({
    item: {
        type: Object as () => MeetingBlockerInfo,
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

const meetingBlockerForm = ref(null);


const meetingBlockerListStore = useMeetingBlockerStore();

const meetingResolutionListStore = useMeetingResolutionStore();
const {meetingResolutionList} = storeToRefs(meetingResolutionListStore)

const meetingDate = ref('');
const meetingTime = ref('');

const defaultMeetingBlocker = ref<MeetingBlockerInfo>({
    id: null,
    resolution_id: null,
    blocker_details: null,
    assigned_to: null,
    resolution_plan: null,
    timestamp: null,
})

const meetingBlockerInfo = ref(defaultMeetingBlocker.value);

const title = computed(() => {
  return props.updating ? 'Meeting Blocker Info' : 'Create Meeting Blocker';
});

watch([meetingDate, meetingTime], ([date, time]) => {
  meetingBlockerInfo.value.timestamp = `${date} ${time}`;
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Meeting Blocker';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    meetingBlockerListStore.updateMeetingBlocker(meetingBlockerInfo.value);
  } else {
    meetingBlockerListStore.createMeetingBlocker(meetingBlockerInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (meetingBlockerForm.value) {
    (meetingBlockerForm.value as HTMLFormElement).reset(); // Reset the form
  }
};


const allowedTimeStep = (m: any) => m % 15 === 0

watch(dialog, (val) => {
  if (val && props.updating) {
      meetingBlockerInfo.value = Object.assign({}, props.item as MeetingBlockerInfo)
      if (meetingBlockerInfo.value.timestamp) {
      const [date, time] = meetingBlockerInfo.value.timestamp.split(' ');
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
          Add a New Blocker of Meeting
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
          <v-form ref="meetingBlockerForm">

            <v-row class="my-4">
                <v-col cols="12" md="6" class="pb-0">
                    <v-autocomplete v-model="meetingBlockerInfo.resolution_id"  variant="solo" flat density="compact"
                     :items="meetingResolutionList" item-title="resolution_details" item-value="id" label="Select A Resolution"
                :rules="[rules.required]"></v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="meetingBlockerInfo.assigned_to" variant="solo" flat density="compact" label="Assigned To" required></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-text-field v-model="meetingBlockerInfo.blocker_details" variant="solo" flat density="compact" label="Blocker Details" required></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="date" v-model="meetingDate" label="Select Date" variant="solo" flat density="compact"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="time" format="24hr" variant="solo" flat density="compact" label="Start Time"
                        v-model="meetingTime" :allowed-minutes="allowedTimeStep"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-textarea v-model="meetingBlockerInfo.resolution_plan" variant="solo" flat density="compact" label="Resolution Plan" rows="3" required></v-textarea>
                </v-col>
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
