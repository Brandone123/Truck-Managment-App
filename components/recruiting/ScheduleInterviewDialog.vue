<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useInterviewScheduleStore } from '@/stores/recruiting/interview_schedule';
import { ref, computed, watch } from 'vue';
import type { InterviewScheduleInfo } from '@/types/recruiting/interview_schedule';

const emit = defineEmits(['update:show', 'addInterview', 'editInterview']);

const props = defineProps({
    item: {
        type: Object as () => InterviewScheduleInfo,
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

const dialog = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    emit('update:show', newValue);
  },
});

const interviewForm = ref(null);

const interviewListStore = useInterviewScheduleStore();

const JobPostingListStore = useJobPostingStore();
const { jobPostingList } = storeToRefs(JobPostingListStore);

const ApplicantStore = useApplicantStore();
const { applicantList } = storeToRefs(ApplicantStore);

const interviewDate = ref('');
const interviewTime = ref('');

const defaultInterview = ref<InterviewScheduleInfo>({
    id: null,
    applicant_id: null,
    job_posting_id: null,
    interview_date: null,
    interviewers: null,
    interview_notes: null,
    interview_feedback: null,
    interview_status: null,
})

const interviewInfo = ref(defaultInterview.value);

const title = computed(() => {
  return props.updating ? 'Interview Info' : 'Create Interview';
});

watch([interviewDate, interviewTime], ([date, time]) => {
  interviewInfo.value.interview_date = `${date} ${time}`;
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Schedule Interview';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    interviewListStore.updateInterviewSchedule(interviewInfo.value);
  } else {
    interviewListStore.createInterviewSchedule(interviewInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (interviewForm.value) {
    (interviewForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

const allowedTimeStep = (m: any) => m % 15 === 0

watch(dialog, (val) => {
  if (val && props.updating) {
      interviewInfo.value = Object.assign({}, props.item as InterviewScheduleInfo)
      if (interviewInfo.value.interview_date) {
      const [date, time] = interviewInfo.value.interview_date.split(' ');
      interviewDate.value = date;
      interviewTime.value = time;
    } else {
      interviewDate.value = '';
      interviewTime.value = '';
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
          Schedule a New Interview
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
          <v-form ref="interviewForm">

            <v-row class="my-4">
                <v-col cols="12" md="6" class="pb-0">
                    <v-autocomplete v-model="interviewInfo.applicant_id" label="Select Applicant" :items="applicantList"
                    :rules="[rules.required]" item-value="id" item-title="first_name" multiple density="compact">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-autocomplete v-model="interviewInfo.job_posting_id" label="Select Job Posting" :items="jobPostingList"
                    :rules="[rules.required]" item-value="id" item-title="title"   density="compact">
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-text-field v-model="interviewInfo.interviewers" variant="solo" flat label="Interviewers" density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
            
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="date" v-model="interviewDate" label="Select Date" variant="solo" flat density="compact"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="time" format="24hr" variant="solo" flat density="compact" label="Start Time"
                        v-model="interviewTime"
                        :allowed-minutes="allowedTimeStep"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                     <v-textarea v-model="interviewInfo.interview_notes" variant="solo" flat density="compact" row="2" label="Interview Notes" 
                         required></v-textarea>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-textarea v-model="interviewInfo.interview_feedback" variant="solo" flat label="Interview Feedback" density="compact"></v-textarea>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-select v-model="interviewInfo.interview_status" :items="['Scheduled', 'Completed', 'Cancelled']" variant="solo" flat density="compact" label="Agenda" required></v-select>
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
