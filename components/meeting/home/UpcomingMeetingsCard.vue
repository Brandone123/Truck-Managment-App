<template>
   <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Upcoming Meetings</span>
    </div>
    <v-card>
      <v-card-text>
        <v-col v-if="loadingMeetingList" cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-col>
        <v-col v-else-if="filteredMeetings.length === 0" cols="12" class="text-center">
          <p>No Upcoming Meeting</p>
        </v-col>
        <v-row v-else>
          <v-col cols="12" md="4"  v-for="meeting in filteredMeetings">
            <v-card class="px-1 py-1">
              <div class="d-flex ">
                <v-col cols="3">
                  <v-card class="px-2 py-2 bg-blue text-white">
                  <div class="meeting-date">
                    <div class="date">
                      <p class="month">{{ getMonth(meeting.date_and_time) }}</p>
                      <p class="day">{{ getDay(meeting.date_and_time) }}</p>
                    </div>
                  </div>
                  <div class="text-center text-white"> {{ getTime(meeting.date_and_time) }}</div>
                </v-card>
                </v-col>
                <p>
                  <v-card-title>{{ meeting.title }}</v-card-title>
                  <v-card-text>
                    <div style="overflow-wrap: break-word;">{{ meeting.agenda }}</div>
                      <div>Duration: <strong>{{ meeting.duration }} hours</strong> </div>
                    <span>Organizer: {{ meeting.organizer }}</span>
                  </v-card-text> 
                </p>
              </div>
              <!-- <div class="d-flex">
                  <div class="ml-auto">
                  <v-btn icon @click="editMeeting(meeting)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn class="ml-2" icon @click.stop="cancelMeeting(meeting.id)">
                    <v-icon color="red">mdi-cancel</v-icon>
                  </v-btn>
                </div>
              </div> -->
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </template>
  
<script setup lang="ts">
  import { useMeetingStore } from '@/stores/meeting';
  import { ref, computed, watch } from 'vue';
  import type {MeetingInfo} from '~/types/meeting/meeting'

  const meetingListStore = useMeetingStore();
  const {meetingList, loading: loadingMeetingList} = storeToRefs(meetingListStore)

  onMounted(() =>{
    meetingListStore.fetchMeetingList();
  })
    
  const filteredMeetings = computed(() => {
    const currentDate = new Date();
    return meetingList.value
      .slice()
      .sort((a, b) => {
        const [dateA, timeA] = (a.date_and_time || '').split(' ');
        const [dateB, timeB] = (b.date_and_time || '').split(' ');

        const dateTimeA = new Date(`${dateA}T${timeA}`);
        const dateTimeB = new Date(`${dateB}T${timeB}`);

        return dateTimeA.getTime() - dateTimeB.getTime();
      })
      .filter((meeting) => {
        const [date, time] = (meeting.date_and_time || '').split(' ');
        const dateTime = new Date(`${date}T${time}`);
        return dateTime > currentDate;
      })
      .slice(0, 3);
  });

    const meetingDialog = ref(false)
    const updatingMeeting = ref(false)

    const updateSheduleMeetingRecord = (value: boolean) => {
      meetingDialog.value = value
      editedMeeting.value = defaultMeeting.value as MeetingInfo
      updatingMeeting.value = false
  }

  function addSheduleMeeting(event: MeetingInfo) {
      meetingListStore.createMeeting(event)
  }

  function editSheduleMeeting(event: MeetingInfo) {
      meetingListStore.updateMeeting(event)
  }
    
    // Method to navigate to the meeting details page
    // const goToMeetingDetails = (meetingId) => {
    //   router.push({ name: 'meeting-details', params: { id: meetingId } });
    // };


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

    
    const cancelMeeting = (meetingId:any) => {
      console.log('Cancelling meeting', meetingId);
      // Implement the cancel logic
    };

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
  </script>
  
<style scoped>
  .meeting-date {
      align-items: center;
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
    font-size: 8px;
    /* color: gray; */
  }
</style>
  