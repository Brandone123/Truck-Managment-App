<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useMeetingStore } from '@/stores/meeting';
import { ref, computed, watch } from 'vue';
import type { MeetingResolutionInfo } from '@/types/meeting/meeting_resolution';
import { useMeetingResolutionStore } from '~/stores/meeting_resolution';

const emit = defineEmits(['update:show', 'addMeetingResolution', 'editMeetingResolution']);

const props = defineProps({
    item: {
        type: Object as () => MeetingResolutionInfo,
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

const showResolutionButton = computed(() => {
  const currentPath = window.location.pathname;
  return currentPath === '/meeting/meeting_resolutions';
});


const dialog = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    emit('update:show', newValue);
  },
});

const meetingResolutionForm = ref(null);

const meetingResolutionListStore = useMeetingResolutionStore();

const meetingListStore = useMeetingStore();
const {meetingList} = storeToRefs(meetingListStore)

const departmentListStore = useDepartmentStore();
const {departmentList} = storeToRefs(departmentListStore)

const meetingDate = ref('');
const meetingTime = ref('');

const defaultMeetingResolution = ref<MeetingResolutionInfo>({
  id: null,
  meeting_id: null,
  department_id: null,
  status: null,
  resolution_details: null,
  timestamp: null,
})

const meetingResolutionInfo = ref(defaultMeetingResolution.value);

const title = computed(() => {
  return props.updating ? 'Meeting Resolution Info' : 'Create Meeting Resolution';
});

watch([meetingDate, meetingTime], ([date, time]) => {
  meetingResolutionInfo.value.timestamp = `${date} ${time}`;
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Meeting Resolution';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    meetingResolutionListStore.updateMeetingResolution(meetingResolutionInfo.value);
  } else {
    meetingResolutionListStore.createMeetingResolution(meetingResolutionInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (meetingResolutionForm.value) {
    (meetingResolutionForm.value as HTMLFormElement).reset(); // Reset the form
  }
};


const allowedTimeStep = (m: any) => m % 15 === 0

watch(dialog, (val) => {
  if (val && props.updating) {
      meetingResolutionInfo.value = Object.assign({}, props.item as MeetingResolutionInfo)
      if (meetingResolutionInfo.value.timestamp) {
      const [date, time] = meetingResolutionInfo.value.timestamp.split(' ');
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
        <v-btn v-if="showResolutionButton" density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add a New Resolution of Meeting
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
          <v-form ref="meetingResolutionForm">

            <v-row class="my-4">
                <v-col cols="12" md="6" class="pb-0">
                    <v-autocomplete v-model="meetingResolutionInfo.meeting_id"  variant="solo" flat density="compact"
                     :items="meetingList" item-title="title" item-value="id" label="Select A Meeting"
                :rules="[rules.required]"></v-autocomplete>
                </v-col>

                <v-col cols="12" md="6" class="pb-0">
                    <v-autocomplete v-model="meetingResolutionInfo.department_id" variant="solo" flat label="Select A department"
                                    :items='departmentList' item-title="name" item-value="id" density="compact"  :rules="[rules.required]"></v-autocomplete>
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
                    <v-autocomplete v-model="meetingResolutionInfo.status" variant="solo" flat label="Status"
                                    :items="['Pending', 'In progress', 'Completed']" density="compact"  :rules="[rules.required]"></v-autocomplete>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-textarea v-model="meetingResolutionInfo.resolution_details" variant="solo" flat density="compact" label="Resolution" rows="4" required></v-textarea>
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
