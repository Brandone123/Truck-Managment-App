<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ref, computed, watch } from 'vue';
import type { MeetingUpdateInfo } from '@/types/meeting/meeting_update';
import { useMeetingUpdateStore } from '~/stores/meeting_update';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['update:show', 'addMeetingUpdate', 'editMeetingUpdate']);

const props = defineProps({
    item: {
        type: Object as () => MeetingUpdateInfo,
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

const meetingUpdateForm = ref(null);

const meetingUpdateListStore = useMeetingUpdateStore();

const departmentListStore = useDepartmentStore();
const {departmentList} = storeToRefs(departmentListStore)

const meetingListStore = useMeetingStore();
const {meetingList} = storeToRefs(meetingListStore)

const meetingDate = ref('');
const meetingTime = ref('');

const defaultMeetingUpdate = ref<MeetingUpdateInfo>({
    id: null,
    meeting_id: null,
    department_team: null,
    update_details: null,
    timestamp: null,
})

const meetingUpdateInfo = ref(defaultMeetingUpdate.value);

const title = computed(() => {
  return props.updating ? 'Meeting Update Info' : 'Create Meeting Update';
});

watch([meetingDate, meetingTime], ([date, time]) => {
  meetingUpdateInfo.value.timestamp = `${date} ${time}`;
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Meeting Update';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    meetingUpdateListStore.updateMeetingUpdate(meetingUpdateInfo.value);
  } else {
    meetingUpdateListStore.createMeetingUpdate(meetingUpdateInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (meetingUpdateForm.value) {
    (meetingUpdateForm.value as HTMLFormElement).reset(); // Reset the form
  }
};


const allowedTimeStep = (m: any) => m % 15 === 0

watch(dialog, (val) => {
  if (val && props.updating) {
      meetingUpdateInfo.value = Object.assign({}, props.item as MeetingUpdateInfo)
      if (meetingUpdateInfo.value.timestamp) {
      const [date, time] = meetingUpdateInfo.value.timestamp.split(' ');
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
           Add a New Update of Meeting
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
           <v-form ref="meetingUpdateForm">
 
             <v-row class="my-4">
                 <v-col cols="12" md="6" class="pb-0">
                     <v-autocomplete v-model="meetingUpdateInfo.meeting_id"  variant="solo" flat density="compact"
                      :items="meetingList" item-title="title" item-value="id" label="Select A Meeting"
                 :rules="[rules.required]"></v-autocomplete>
                 </v-col>
 
                 <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="meetingUpdateInfo.department_team" variant="solo" flat density="compact" label="Department/Team" required></v-text-field>
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
                 <v-col cols="12" class="pb-0">
                     <v-textarea v-model="meetingUpdateInfo.update_details" variant="solo" flat density="compact" label="Update Details" rows="4" required></v-textarea>
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