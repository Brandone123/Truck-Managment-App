<template>
   <v-card outlined class="pa-4">
      <v-card-title class="text-h5">
        Meeting Quick Actions
      </v-card-title>
      <v-card-text>
        <v-btn color="primary" class="mr-4" @click="createMeeting">
          New Meeting
        </v-btn>
        <v-btn color="secondary" class="mr-4" @click="viewMeetings">
          View Meetings
        </v-btn>
        <v-btn color="accent" @click="meetingActions">
          Meeting Actions
        </v-btn>
      </v-card-text>
    </v-card>
    <v-row class="mt-3">
      <!-- <v-col cols="12" md="3">
        <v-card class="px-5 py-2">
          <v-card-title>Weekly Action Meeting</v-card-title>
          <div v-if="loadingMeeting" class="text-center"> 
              <v-progress-circular  indeterminate color="primary"></v-progress-circular>
            </div>
          <div v-else>
            <apexchart
                type="donut"
                height="240px"
                :options="chartOptions.chartOptions"
                :series="chartOptions.series">
            </apexchart>
          </div>
        </v-card>
      </v-col> -->
      <v-col cols="12" md="3">
        <v-card class="px-5 py-2 text-center">
          <span>7-Day Meetings</span>
          <div class="pt-5 pb-6">
            <span style="font-size: 24px;font-weight: bold;">
              <div v-if="loadingMeeting" class="text-center"> 
                <v-progress-circular  indeterminate color="primary"></v-progress-circular>
              </div> 
              <span v-else>{{ countMeetingWeek }}</span>
            </span>
            <span style="margin-left: 7px;">Meetings</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="px-5 py-2 text-center">
          <span>Weekly Blocker Meeting</span>
          <div class="pt-5 pb-6">
            <span style="font-size: 24px;font-weight: bold;">
              <div v-if="loadingMeeting" class="text-center"> 
                <v-progress-circular  indeterminate color="primary"></v-progress-circular>
              </div> 
              <span v-else>{{ countBlockerMeeting }}</span>
            </span>
            <span style="margin-left: 7px;">Blockers</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="px-5 py-2 text-center">
          <span>Action items requiring attention</span>
          <div class="pt-5 pb-6">
            <span style="font-size: 24px;font-weight: bold;">
              <div v-if="loadingMeeting" class="text-center"> 
                <v-progress-circular  indeterminate color="primary"></v-progress-circular>
              </div> 
              <span v-else>{{ ActionOpen }}</span>
            </span>
            <span style="margin-left: 7px;">Actions</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="px-5 py-2 text-center">
          <span>Resolution Made</span>
          <div class="pt-5 pb-6">
            <span style="font-size: 24px;font-weight: bold;">
              <div v-if="loadingMeeting" class="text-center"> 
                <v-progress-circular  indeterminate color="primary"></v-progress-circular>
              </div> 
              <span v-else>{{ ResolutionMade }}</span>
            </span>
            <span style="margin-left: 7px;">Resolutions</span>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <v-col cols="12">
        <UpcomingMeetingsCard />
      </v-col>
      <v-col cols="12" md="6">
        <MeetingActionsCard />
      </v-col>
      <v-col cols="12" md="6">
        <ResolutionsOverviewCard />
      </v-col>
      <!-- <v-col cols="12">
        <MeetingsCalendarView />
      </v-col> -->
    </v-row>
</template>

<script setup lang="ts">
// Import Vue and Vuetify components
import { useRouter } from 'vue-router';

// Import custom components
import UpcomingMeetingsCard from '@/components/meeting/home/UpcomingMeetingsCard.vue';
import MeetingActionsCard from '@/components/meeting/home/MeetingActionsCard.vue';
import ResolutionsOverviewCard from '@/components/meeting/home/ResolutionsOverviewCard.vue';
import MeetingsCalendarView from '@/components/meeting/home/MeetingsCalendarView.vue';
import MeetingBlockerDialog from '~/components/meeting/MeetingBlockerDialog.vue';

const router = useRouter();

const meetingActionStore = useMeetingActionStore();
const {meetingActionList, loading: loadingAction} = storeToRefs(meetingActionStore)

const meetingBlockerStore = useMeetingBlockerStore();
const {meetingBlockerList, loading: loadingBlocker} = storeToRefs(meetingBlockerStore)

const meetingResolutionStore = useMeetingResolutionStore();
const {meetingResolutionList} = storeToRefs(meetingResolutionStore)

const meetingStore = useMeetingStore();
const {meetingList, loading: loadingMeeting} = storeToRefs(meetingStore)

onMounted(() =>{
  // meetingActionStore.fetchMeetingActionList();
})

const createMeeting = () => {
  router.push('/meeting/meeting_schedule'); 
};

const viewMeetings = () => {
  router.push('/meeting/meeting_details'); 
};

const meetingActions = () => {
  router.push('/meeting/meeting_actions');
};

// Function to obtain the number of the week
function getWeekNumber(date: Date): number {
  const onejan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
}

const countMeetingWeek = computed(() => {
  // Retrieve current date, week, month and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentWeek = getWeekNumber(currentDate);

  // Filustration of meetings of the current week that belong to the current month and year
  const meetings = meetingList.value.filter((meeting) => {
    if (meeting && meeting.date_and_time) {
      const [date, time] = meeting.date_and_time.split(' ');
      const meetingDate = new Date(date);
      const meetingYear = meetingDate.getFullYear();
      const meetingMonth = meetingDate.getMonth() + 1;
      const meetingWeek = getWeekNumber(meetingDate);

      // Check whether the meeting belongs to the current week, month or year
      return (
        meetingYear === currentYear &&
        meetingMonth === currentMonth &&
        meetingWeek === currentWeek
      );
    }
  });

  // Returns the number of meetings in the current week that belong to the current month and year
  return meetings.length;
});

const countBlockerMeeting = computed(() => {
  // Retrieve current date, week, month and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentWeek = getWeekNumber(currentDate);

  // Filtering of blockers whose date corresponds to the current week, month and year
  const blockers = meetingBlockerList.value.filter((blocker) => {
    if (blocker && blocker.timestamp) {
      const [date, time] = blocker.timestamp.split(' ');
      const blockerDate = new Date(date);
      const blockerYear = blockerDate.getFullYear();
      const blockerMonth = blockerDate.getMonth() + 1;
      const blockerWeek = getWeekNumber(blockerDate);

      // Check whether the blocker belongs to the current week, month and year
      return (
        blockerYear === currentYear &&
        blockerMonth === currentMonth &&
        blockerWeek === currentWeek
      );
    }
  });

  // Returns the number of blockers whose date corresponds to the current week, month and year
  return blockers.length;
});


const chartData = ref<number[]>([]);

const ActionOpen = computed(() => {
  return meetingActionList.value.filter((statusAction) => statusAction.status === 'Open').length;
})

const ResolutionMade = computed(() => {
  return meetingResolutionList.value.filter((resolution) => resolution.id).length;
})

function filteredActions() {
  const actionOpen = meetingActionList.value.filter((statusAction) => statusAction.status === 'Open').length;
  const actionProgress = meetingActionList.value.filter((statusAction) => statusAction.status === 'In Progress').length;
  const actionCompleted = meetingActionList.value.filter((statusAction) => statusAction.status === 'Completed').length;

  chartData.value = [actionOpen, actionProgress, actionCompleted];
}

const chartOptions = computed(() => {
    return {
      series: chartData.value,
      chartOptions: {
        colors: ["#3f51b5", "#f44336", "#ff9800"],
        chart: {
          type: "donut",
          height: 200,
          foreColor: "#adb0bb",
          fontFamily: "inherit",
          toolbar: {
            show: false,
          },
        },
        labels: ["Open", "In Progress", "Completed"],
        legend: {
          show: true,
          position: "top",
        },
        tooltip: { theme: "light", fillSeriesColor: true },
      },
    };
  });

  watch(filteredActions, (newValue) => {
    filteredActions();
  });
  
</script>
