<template>
   <div class="d-flex align-center">
    <span class="mr-auto text-primary text-h5">Weekly Operations Meeting</span>
    <v-spacer></v-spacer>
    <MeetingSheduleMeetingDialog :show="meetingDialog"
        @update:editInfo="editMeeting" @update:show="updateMeetingDialog"
        :updating="updatingMeeting" :item="(editedMeeting as any)" />
   </div>
  <v-card class="mt-16">
    <v-card-text>
      <div class="d-flex align-center mb-4">
        <v-btn color="primary" variant="tonal" density="compact"
          @click="updateToCurrentWeek" class="mr-1">This Week</v-btn>
        <v-btn color="primary" density="compact" icon="mdi-chevron-left" variant="plain"
          @click="previousWeek"></v-btn>
        <h3> {{ currentWeekRange  }}</h3>
        <v-btn color="primary" icon="mdi-chevron-right" variant="plain" @click="nextWeek"></v-btn>
      </div>
      <v-row class="mt-5">
        <v-col v-if="loadingMeetingList" cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-col>

        <v-col v-else-if="filteredMeetingList.length === 0" cols="12" class="text-center">
          <h3>No Meeting Schedule</h3>
        </v-col>
        <v-col v-else cols="12" md="4" v-for="meeting in PaginatefilteredMeetingList">
          <v-card class="px-5 py-5">
            <div class="d-flex align-center">
              <span class="mr-auto mt-5" style="position: absolute;">
                <v-card class="px-2 py-2 bg-blue text-white">
                  <div class="meeting-date">
                    <div class="date">
                      <p class="month">{{ getMonth(meeting.date_and_time) }}</p>
                      <p class="day">{{ getDay(meeting.date_and_time) }}</p>
                    </div>
                  </div>
                  <div class="text-center text-white"> {{ getTime(meeting.date_and_time) }}</div>
                </v-card>
              </span>
              <span class="ml-auto" style="position: relative;">Duration: <strong>{{ meeting.duration }}h</strong> </span>
            </div>
            <v-card-title class="text-center mt-10">
              <h3><strong>{{ meeting.title }}</strong></h3>
            </v-card-title>

            <v-card-subtitle class="text-center">
              <span>organizer:<strong>{{ meeting.organizer }}</strong></span>
            </v-card-subtitle>

            <div style="margin-top: 20px; text-align: center;">
              <div style="display: flex; justify-content: center;">
                <div style="position: relative;">
                  <span style="position: absolute; border-radius: 50%; background-color: lightblue; width: 60px; height: 60px; margin: -10px;"></span>
                  <v-icon style="width: 40px; height: 40px; color: white;">mdi-account</v-icon>
                </div>
                <div style="position: relative;">
                  <span style="position: absolute; border-radius: 50%; background-color: lightgreen; width: 60px; height: 60px; margin: -10px;"></span>
                  <v-icon style="width: 40px; height: 40px; color: white;">mdi-account</v-icon>
                </div>
                <div style="position: relative;">
                  <span style="position: absolute; border-radius: 50%; background-color: lightcoral; width: 60px; height: 60px; margin: -10px;"></span>
                  <v-icon style="width: 40px; height: 40px; color: white;">mdi-account</v-icon>
                </div>
              </div>
            </div>

            <!-- <div style="margin-top: 20px; text-align: center;">
              <div style="display: flex; justify-content: center;">
                <div v-for="attendee in meeting.attendees" :key="attendee" style="position: relative;">
                  <span style="position: absolute; border-radius: 50%; background-color: lightblue; width: 60px; height: 60px; margin: -10px;"></span>
                  <v-icon style="width: 40px; height: 40px; color: white;">mdi-account</v-icon>
                </div>
              </div>
            </div> -->

            <div class="mt-10 text-center justify-center">
              <span class="border-2 border-black rounded-lg px-4 py-1 font-bold"
                :class="{
                  'bg-blue text-white': getMeetingStatus(meeting.date_and_time, meeting.id) === 'Soon',
                  'bg-red text-white': getMeetingStatus(meeting.date_and_time, meeting.id) === 'Passed' || getMeetingStatus(meeting.date_and_time, meeting.id) === 'Finished',
                  'bg-green text-white': getMeetingStatus(meeting.date_and_time, meeting.id) === 'Ongoing',
                  'bg-orange text-white': getMeetingStatus(meeting.date_and_time, meeting.id) === 'Canceled'
                }"
              >
                {{ getMeetingStatus(meeting.date_and_time, meeting.id) }}
              </span>
            </div>
            <hr class="mt-4 divider">

            <div class="mt-2">
              <p>Agenda: {{ meeting.agenda }}</p>
            </div>

            <div class="d-flex align-center mt-3">
              <span class="mr-auto">
                <v-icon dense color="primary" @click="editMeeting(meeting)">mdi-pencil</v-icon>
              </span>
              <div class="ml-auto">
                <v-icon color="red" dense @click="meeting.id !== null && showCancelConfirmationDialog(meeting.id)">mdi-cancel</v-icon>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-pagination class="mt-6" v-model="currentPage" :length="totalPages" @input="paginate"></v-pagination>
    </v-card-text>
  </v-card>
  <!-- Cancellation confirmation dialog -->
  <v-dialog v-model="cancelConfirmationDialog" max-width="400">
    <v-card>
      <v-card-title class="headline">Confirmation</v-card-title>
      <v-card-text>
        Are you sure you want to cancel this meeting?
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" dense @click="cancelConfirmationDialog = false">Cancel</v-btn>
        <v-btn color="primary" dense @click="handleConfirmationOk">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { MeetingInfo } from '~/types/meeting/meeting';

const meetingListStore = useMeetingStore();
const { meetingList, loading: loadingMeetingList } = storeToRefs(meetingListStore);

const meetingDialog = ref(false)
const updatingMeeting = ref(false)

const defaultMeeting: Ref<MeetingInfo> = ref({
  id: null,
  title: null,
  date_and_time: null,
  duration: null,
  organizer: null,
  agenda: null,
});

const editedMeeting = ref(defaultMeeting.value)

const editMeeting = (meeting: MeetingInfo) => {
    editedMeeting.value = Object.assign({}, meeting)
    updatingMeeting.value = true
    meetingDialog.value = true
}

const cancelConfirmationDialog = ref(false);
const meetingToCancel = ref(null);
const canceledMeetings = ref<number[]>([]);

function showCancelConfirmationDialog(id:any) {
  meetingToCancel.value = id;
  cancelConfirmationDialog.value = true;
}

function cancelMeeting(id:any) {
  if (id !== null) {
    canceledMeetings.value.push(id);
  }
  // Close the confirmation dialog
  cancelConfirmationDialog.value = false;

  return 'Cancel';
}

function handleConfirmationOk() {
  const meetingId = meetingToCancel.value;
  cancelMeeting(meetingId);
}

const updateMeetingDialog = (value: boolean) => {
    meetingDialog.value = value
    editedMeeting.value = defaultMeeting.value as MeetingInfo
    updatingMeeting.value = false
}

onMounted(() => {
  meetingListStore.fetchMeetingList()
});

const currentPage = ref(1);
const itemsPerPage = 8;

const totalPages = computed(() => Math.ceil(filteredMeetingList.value.length / itemsPerPage)); 

function paginate(page: number): void {
  if (page < 1 || page > totalPages.value) {
    return; // Check validity of specified page
  }
  currentPage.value = page;
}

const getMonth = (date:any) => {
  const fullMonth = new Date(date).toLocaleString("en-US", { month: "long" });
  return fullMonth.slice(0, 3);
};

const getDay = (dateTimeString:any) => {
  const meetingDateTime = new Date(dateTimeString);
  return meetingDateTime.getDate();
};

const getTime = (dateTimeString:any) => {
  const meetingDateTime = new Date(dateTimeString);
  return meetingDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const parseDateTime = (dateTimeString: any) => {
  const [datePart, timePart] = dateTimeString.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes, seconds] = timePart.split(':');

  return new Date(year, month - 1, day, hours, minutes, seconds);
};

function getMeetingStatus(dateTimeString:any, id:any) {
  const meetingDateTime = new Date(dateTimeString);

  if (id !== null && canceledMeetings.value.includes(id)) {
    return 'Canceled';
  } else if (meetingDateTime < new Date()) {
    return 'Passed';
  } else if (meetingDateTime.getTime() === new Date().getTime()) {
    return 'Finished';
  } else if (meetingDateTime > new Date()) {
    return 'Soon';
  } else {
    return 'Ongoing';
  }
}

// Calculation of the current week's range
const currentWeekStart = new Date();
currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1);
currentWeekStart.setHours(0, 0, 0, 0);

const currentWeekEnd = new Date(currentWeekStart);
currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
currentWeekEnd.setHours(23, 59, 59, 999);

const currentWeekRange = ref('');
const cachedMeetingList = ref([]);

// Previous week function
const previousWeek = () => {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  currentWeekEnd.setDate(currentWeekEnd.getDate() - 7);
  currentWeekRange.value = getWeekRange(currentWeekStart, currentWeekEnd);
  meetingListStore.fetchMeetingList(); 
};

// Function to skip to the next week
const nextWeek = () => {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 7);
  currentWeekRange.value = getWeekRange(currentWeekStart, currentWeekEnd);
  meetingListStore.fetchMeetingList();
};

// Function to update the list of meetings for the current week
const updateToCurrentWeek = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();
  
  currentWeekStart.setDate(currentDate - today.getDay() + 1);
  currentWeekStart.setMonth(currentMonth);
  currentWeekStart.setFullYear(currentYear);

  currentWeekEnd.setDate(currentDate - today.getDay() + 7);
  currentWeekEnd.setMonth(currentMonth);
  currentWeekEnd.setFullYear(currentYear);
  
  currentWeekRange.value = getWeekRange(currentWeekStart, currentWeekEnd);
  meetingListStore.fetchMeetingList(); 
};


const filteredMeetingList = computed(() => {
  return meetingList.value.filter((meeting) => {
    const meetingDateTime = parseDateTime(meeting.date_and_time);
    return meetingDateTime >= currentWeekStart && meetingDateTime <= currentWeekEnd;
  });
});

const PaginatefilteredMeetingList = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return filteredMeetingList.value?.slice(startIndex, endIndex);
});


// Function to obtain the week range in the format "dd-mm-yyyy - dd-mm-yyyy".
const getWeekRange = (start: any, end: any) => {
  const startFormatted = new Date(start).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const endFormatted = new Date(end).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  return `${startFormatted}  to  ${endFormatted}`;
};

onMounted(() => {
  currentWeekRange.value = getWeekRange(currentWeekStart, currentWeekEnd);
});
</script>

<style scoped>

.meeting-date {
  align-items: center;
}

.mdi {
  font-size: 24px;
  margin-right: 10px;
}

.date {
  text-align: center!important;
}

.month {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center !important;
}

.day {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.time {
  font-size: 14px;
  color: gray;
}

.divider {
  border: none;
  border-top: 2px solid #eee;
  margin: 16px 0;
}
</style>