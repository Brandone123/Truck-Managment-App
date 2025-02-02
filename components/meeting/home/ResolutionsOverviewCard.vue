<template>
    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Overview Resolutions</span>
    </div>
    <v-card>
      <v-card-text>
        <div v-if="loadingMeetingList" class="text-center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <div v-if="meetingResolutionList.length > 0">
          <v-list>
            <v-list-item v-for="(resolution, index) in (expanded ? resolutionMeetings : resolutionMeetings.slice(0, 3))" :key="index">
              <v-list-item-content>
                <div class="notice-list" >
                  <div class="d-flex justify-space-between">
                    <span class="bg-skyblue post-date rounded-xl mt-2" >{{ formatDate(resolution.timestamp) }}</span>
                    <div>
                      <!-- <v-icon dense color="primary" @click="editResolution(resolution)">mdi-pencil</v-icon> -->
                      <!-- <v-icon class="ml-5" dense color="red" @click="resolution.id !== null && deleteResolution(resolution.id)">mdi-delete</v-icon> -->
                    </div>
                  </div>
                  <div class="notice-content">
                    <p class="notice-description mt-5 font-weight-bold">{{ resolution.resolution_details }}</p>
                  </div>
                  <div class="entry-meta">{{ getDepartmentName(resolution.department_id) }} / 
                    <span class="font-weight-bold" :class="getStatusColor(resolution.status) ">{{ resolution.status }}</span></div>
                  <hr class="divider">
                </div>
              </v-list-item-content>
            </v-list-item>
            <div class="ml-4" v-if="resolutionMeetings.length > 3 && !expanded">
              <span style="color: cornflowerblue; cursor: pointer;" @click="expanded = true">View more</span>
            </div>
            <div class="ml-4" v-if="expanded">
              <span style="color: cornflowerblue; cursor: pointer;" @click="expanded = false">View less</span>
            </div>
          </v-list>
          
        </div>
        <div v-else>
          <p>No Meeting Resolution Available</p>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogVisible" max-width="800px" max-heigth="500px">
      <v-card class="grey-background" v-if="selectedResolution !== null">
        <v-toolbar color="primary" density="compact">
          <v-card-title density="comfortable" color="primary" flat class="headline">{{ getDepartmentName(selectedResolution.department_id)  }} Department</v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogVisible = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div>
            <span>
              <p>Resolution Details: {{ selectedResolution.resolution_details}}</p>
            </span>
          </div>
          <v-card-text class="mt-3"> 
            <div class="d-flex">
              <div class="mr-auto">
                <p>Date: <strong>{{ formatDate(selectedResolution.timestamp) }}</strong></p>
              </div>
              <span><p>Status: <strong class="font-weight-bold" :class="getStatusColor(selectedResolution.status) "> {{ selectedResolution.status }}</strong> </p></span>
            </div>
          </v-card-text>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" dense @click="dialogVisible = false">Close</v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import type { MeetingResolutionInfo } from '~/types/meeting/meeting_resolution';

  const meetingListStore = useMeetingStore()
  const { meetingList, loading: loadingMeetingList} = storeToRefs(meetingListStore)
  const meetingResolutionListStore = useMeetingResolutionStore()
  const {loading: loadingResolution } = storeToRefs(meetingResolutionListStore)

  const meetingResolutionList = computed(() =>{
    const store = useMeetingResolutionStore();
    return store.getMeetingResolutionList;
  })

  const selectedResolution = ref<MeetingResolutionInfo | null>(null);

  const dialogVisible = ref(false);
  const selectedDepartment = ref();

  const viewResolutionDetails = (resolution:MeetingResolutionInfo, department_id:any) => {
    selectedResolution.value = resolution
    selectedDepartment.value = getDepartmentName(department_id);

    dialogVisible.value = true;
  };

function filterPastMeetings() {
  const currentDate = new Date();
  return meetingResolutionList.value.filter((resolution) => {
    const meeting = meetingList.value.find((meeting) => meeting.id === resolution.meeting_id);

    if (meeting && meeting.date_and_time) {
      const [date, time] = meeting.date_and_time.split(' ');
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes, seconds] = time.split(':').map(Number);
      const meetingDate = new Date(year, month - 1, day, hours, minutes, seconds);

      if (meetingDate < currentDate) {
        return true;
      }
    }

    return false;
  });
}

const resolutionMeetings = computed(() =>{
    return filterPastMeetings();
})

const expanded = ref(false);

const departmentListStore = useDepartmentStore()
const {departmentList, loading: loadingDepartment} = storeToRefs(departmentListStore)

function getDepartmentName(department_id: any) {
    const departments = departmentList.value;
    const department = departments.find(dept => dept.id === department_id);
    return department ? department.name : '';
  }

  function formatDate(dateString: any) {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const monthIndex = dateObject.getMonth();
    const year = dateObject.getFullYear();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const formattedDate = `${day} ${monthNames[monthIndex]}, ${year}`;
    return formattedDate;
  }

  onMounted(() => {
    // meetingResolutionListStore.fetchMeetingResolutionList();
    departmentListStore.fetchDepartmentList();
    meetingListStore.fetchMeetingList();
  })
  
  // // Helper method to get color based on status
  const getStatusColor = (status:any) => {
    switch (status) {
      case 'Completed':
        return 'text-green';
      case 'In Progress':
        return 'text-orange';
      case 'Pending':
        return 'text-red';
    }
  };
  </script>
  
  <style scoped>
 /* Scrolling card */
 .divider {
  border: none;
  border-top: 2px solid #eee;
  margin: 16px 0;
}

.notice-content {
  margin-bottom: 8px;
}

.notice-description {
  font-size: 14px;
  color: #555;
}

.notice-list {
  /* display: flex; */
  justify-content: space-between;
  align-items: center;
}
.bg-skyblue {
  background-color: #0f5da1;
}
.post-date {
  padding: 4px 8px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
}
  </style>
  