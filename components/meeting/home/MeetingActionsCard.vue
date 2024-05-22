<template>
  <div class="d-flex flex-wrap">
    <span class="v-card-title px-0 font-weight-bold text-primary">Meeting Action Items</span>
  </div>
  <v-card>
    <v-card-text>
      <v-tabs v-model="tab" background-color="deep-purple accent-4" >
        <v-tab :class="{ 'active-tab': activeTabIndex === $index }" v-for="(status, $index) in statuses" :key="status" @click="filterActions(status, $index)">
          {{ status }}
        </v-tab>
      </v-tabs>
      <div>
        <div v-if="loadingMeetingList" class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <div class="text-center" v-else-if="filteredActions.length === 0">
          <p>No Meeting Action Available</p>
        </div>
        <div v-else>
          <v-card-text v-for="(action, index) in (expanded ? filteredActions : filteredActions.slice(0, 3))" :key="index">
            <strong>Meeting Title:</strong>
              {{ getMeetingName(action.resolution_id) }}
            <div class="d-flex">
              <div class="mr-auto">
                <p>{{ action.action_details }}</p>
                <span>Due Date: <span style="color:crimson;"> {{ formatDate(action.due_date) }}</span></span>
                <div>Assigned To: {{ action.assigned_to }}</div>
              </div>

              <div class="ml-auto">
                  <v-icon @click="openCompleteDialog(action)" v-if="tab === 'In Progress'" color="green">mdi-check</v-icon>
                  <v-icon v-else-if="tab === 'Open'" @click="openEditDialog(action)" color="blue">mdi-pencil</v-icon>
              </div>
            </div>
            <hr class="divider">
          </v-card-text>
          <div class="ml-4" v-if="filteredActions.length > 3 && !expanded">
            <span style="color: cornflowerblue; cursor: pointer;" @click="expanded = true">View more</span>
          </div>
          <div class="ml-4" v-if="expanded">
            <span style="color: cornflowerblue; cursor: pointer;" @click="expanded = false">View less</span>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
   <!-- Dialog for editing status -->
   <v-dialog v-model="editDialogVisible" max-width="500px">
    <v-card>
      <v-toolbar color="primary" density="compact">
        <v-card-title density="comfortable" color="primary" flat class="headline">Edit Status</v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="editDialogVisible = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-select flat density="compact" v-model="meetingActionInfo.status" :items="['In Progress','Completed']" label="New Status"></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn dense @click="editDialogVisible = false">Cancel</v-btn>
        <v-btn variant="text" color="primary" @click="updateActionStatus">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog for marking as completed -->
  <v-dialog v-model="completeDialogVisible" max-width="500px">
    <v-card>
      <v-toolbar color="primary" density="compact">
        <v-card-title density="comfortable" color="primary" flat class="headline">Mark as Completed</v-card-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="completeDialogVisible = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>Are you sure you want to mark this action as completed ? </v-card-text>
      <v-card-text >
        <v-select flat density="compact" v-model="meetingActionInfo.status" :items="['Completed']" label="New Status"></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn dense @click="completeDialogVisible = false">Cancel</v-btn>
        <v-btn color="primary" @click="markActionAsCompleted">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useMeetingActionStore } from '@/stores/meeting_action';
import type { MeetingActionInfo } from '@/types/meeting/meeting_action';

const meetingActionStore = useMeetingActionStore();

const meetingStore = useMeetingStore();
const { meetingList, loading: loadingMeetingList } = storeToRefs(meetingStore);
const meetingResolutionStore = useMeetingResolutionStore()
const {meetingResolutionList} = storeToRefs(meetingResolutionStore)

const meetingActionList = computed(() => {
  const store = useMeetingActionStore();
  return store.getMeetingActionList;
});

const tab = ref('Open');
const statuses = ['Open', 'In Progress', 'Completed'];

const activeTabIndex = ref(0);

const filteredActions = ref<MeetingActionInfo[]>([]);

const filterActions = (status: string, index: number) => {
  tab.value = status;
  activeTabIndex.value = index;
  filteredActions.value = meetingActionList.value.filter((action) => action.status === status);
  expanded.value = false;
};

const expanded = ref(false);

function getMeetingName(resolution_id: any) {
    const matchingResolution = meetingResolutionList.value.find(resolution => resolution.id === resolution_id);
    if (matchingResolution) {
      const matchingMeeting = meetingList.value.find(meeting => meeting.id === matchingResolution.meeting_id);
      if (matchingMeeting) {
        return matchingMeeting.title;
      }
    }
    return 'Meeting not found';
  }

// const ActionList = computed(() => {
//   return filterPastMeetings();
// })

// function filterPastMeetings() {
//   const currentDate = new Date();
//   return meetingActionList.value.filter((action) => {
//     const resolution = meetingResolutionList.value.find((resolution) => resolution.id === action.resolution_id);
//     const meeting = meetingList.value.find((meeting) => meeting.id === resolution?.meeting_id);

//     if (meeting && meeting.date_and_time) {
//       const [date, time] = meeting.date_and_time.split(' ');
//       const [year, month, day] = date.split('-').map(Number);
//       const [hours, minutes, seconds] = time.split(':').map(Number);
//       const meetingDate = new Date(year, month - 1, day, hours, minutes, seconds);

//       if (meetingDate < currentDate) {
//         return true;
//       }
//     }

//     return false;
//   });
// }

function formatDate(dateString: any) {
  const dateObject = new Date(dateString);
  const day = dateObject.getDate();
  const monthIndex = dateObject.getMonth();
  const year = dateObject.getFullYear();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const formattedDate = `${day} ${monthNames[monthIndex]}, ${year}`;
  return formattedDate;
}

const editDialogVisible = ref(false);
const completeDialogVisible = ref(false);
const editStatus = ref("");

const openEditDialog = (action: any) => {
  meetingActionInfo.value = action;
  editStatus.value = action.status;
  editDialogVisible.value = true;
};

const openCompleteDialog = (action: any) => {
  meetingActionInfo.value = action;
  editStatus.value = action.status;
  completeDialogVisible.value = true;
};

const defaultMeetingAction = ref<MeetingActionInfo>({
  id: null,
  resolution_id: null,
  action_details: null,
  assigned_to: null,
  due_date: null,
  status: null,
  timestamp: null,
})

const meetingActionInfo = ref(defaultMeetingAction.value);

const updateActionStatus = () => {
  // Update the action status here
  meetingActionStore.updateMeetingAction(meetingActionInfo.value);
  editDialogVisible.value = false;
};

const markActionAsCompleted = () => {
  // Mark the action as completed here
  meetingActionStore.updateMeetingAction(meetingActionInfo.value);
  completeDialogVisible.value = false;
};

onMounted(() => {
  // Call filterActions with "Open" status when assembling the component
  filterActions('Open', 0);
});

watch(
  [tab, meetingActionList],
  ([newTab]) => {
    const tabIndex = statuses.indexOf(newTab);
    filterActions(newTab, tabIndex);
  }
);
</script>

<style scoped>
.divider {
  border: none;
  border-top: 2px solid #eee;
  margin: 16px 0;
}
.active-tab {
  background-color: #eee;
}
</style>