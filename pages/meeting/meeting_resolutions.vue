<script setup lang="ts">
import { ref, computed } from 'vue';
import type { MeetingResolutionInfo } from '@/types/meeting/meeting_resolution'
import { useMeetingResolutionStore } from '~/stores/meeting_resolution';


const meetingListStore = useMeetingStore()
const meetingResolutionListStore = useMeetingResolutionStore()

const meetingResolutionList = computed(() =>{
    const store = useMeetingResolutionStore();
    return store.getMeetingResolutionList;
  })


const departmentListStore = useDepartmentStore()
const {departmentList} = storeToRefs(departmentListStore)

function getDepartmentName(department_id: any) {
    const departments = departmentList.value;
    const department = departments.find(dept => dept.id === department_id);
    return department ? department.name : '';
  }


onMounted(() => {
    meetingListStore.fetchMeetingList();
    departmentListStore.fetchDepartmentList();
    // meetingResolutionListStore.fetchMeetingResolutionList();
});

const selectedDepartment = ref();
const selectedMeeting = ref();

const currentPage = ref(1); // Page actuelle
const itemsPerPage = 5; // Nombre d'éléments par page

const totalPages = computed(() => Math.ceil(meetingResolutionList.value.length / itemsPerPage)); // Nombre total de pages

// Filter Resolution by department and meeting selection
const FilteredResolutionMeeting = computed(() => {
  return meetingResolutionList.value?.filter((resolution) => {
    let response = true;
    if (selectedDepartment.value > -1) {
      response = response && resolution.department_id === selectedDepartment.value;
    }
    return response;
  });
});

// Display Resolution By Pagination
const displayedResolutions = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return FilteredResolutionMeeting.value?.slice(startIndex, endIndex);
});

function displayAllResolutions() {
    return displayedResolutions
}

function paginate(page: number): void {
  if (page < 1 || page > totalPages.value) {
    return; // Check validity of specified page
  }
  currentPage.value = page;
}

interface Meeting {
  title: string;
  description: string;
  date: string;
  participants: string[];
}

const currentMeeting = ref<Meeting>({
  title: generateRandomString(),
  description: generateRandomString(),
  date: generateRandomDate(),
  participants: generateRandomParticipants(5),
});

function generateRandomString(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateRandomDate(): string {
  const startDate = new Date();
  const endDate = new Date('2024-12-31');
  const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  const randomDate = new Date(randomTimestamp);
  return randomDate.toISOString();
}

function generateRandomParticipants(count: number): string[] {
  const participants = [];
  for (let i = 0; i < count; i++) {
    participants.push(`Participant ${i + 1}`);
  }
  return participants;
}

const meetingResolutionDialog = ref(false)
const updatingMeetingResolution = ref(false)
const meetingResolutionDate = ref()


const defaultMeetingResolution: Ref<MeetingResolutionInfo> = ref({
  id: null,
  meeting_id: null,
  department_id: null,
  status: null,
  resolution_details: null,
  timestamp: null,
});

const editedMeetingResolution = ref(defaultMeetingResolution.value)

const editResolution = (meeting_resolution: MeetingResolutionInfo) => {
    editedMeetingResolution.value = Object.assign({}, meeting_resolution)
    updatingMeetingResolution.value = true
    meetingResolutionDialog.value = true
}

const deleteResolution = (id: number) => {
  meetingResolutionListStore.deleteMeetingResolution(id)
}

const updateMeetingResolutionDialog = (value: boolean) => {
    meetingResolutionDialog.value = value
    editedMeetingResolution.value = defaultMeetingResolution.value as MeetingResolutionInfo
    updatingMeetingResolution.value = false
}

  watch(selectedDepartment, (val) => {
    selectedMeeting.value = -1;
  });

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

  watch(meetingResolutionList, (val) => {
  const resolutions = meetingResolutionList.value.map((resolt) => resolt.timestamp);

  if (resolutions) {
    const [date, time] = resolutions[0]?.split(' ') ?? [];
    meetingResolutionDate.value = date || '';
  } else {
    meetingResolutionDate.value = '';
  }
});

</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Meeting Resolution</span>
      <div>
          <MeetingResolutionDialog :show="meetingResolutionDialog" @update:show="updateMeetingResolutionDialog"
                    :updating="updatingMeetingResolution" :item="editedMeetingResolution" />
      </div>
    </div>
  
    <div class="mt-16">
      <v-row>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>
              <v-card-title class="headline font-weight-bold">Current Meeting</v-card-title>
              <div class="meeting-details mt-3">
                <p><strong>Title:</strong> {{ currentMeeting.title }}</p>
                <p class="mt-2"><strong>Description:</strong> {{ currentMeeting.description }}</p>
                <p class="mt-2"><strong>Date:</strong> {{ currentMeeting.date }}</p>
                <p class="mt-2"><strong>Participants:</strong>
                  <span v-for="participant in currentMeeting.participants" :key="participant">{{ participant }}, </span>
                </p>
              </div>
              <div>
                <v-btn color="primary" variant="plain" class="mt-3">
                  Joint And Record A Resolution
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="8">
          <v-card>
            <v-card-text>
                <v-row class="mb-2">
                  <!-- <v-col cols="5">
                    <v-autocomplete v-model="selectedMeeting" :selectedMeeting.sync="selectedMeeting" variant="solo"  label="Filter Resolution by Meeting"
                                :items='meetingList' item-title="title" item-value="id" density="compact">
                    </v-autocomplete>
                  </v-col> -->
                  <v-col cols="5" class="mt-2">
                    <v-btn :disabled="!selectedDepartment" color="primary" variant="tonal" density="compact"
                          @click="displayAllResolutions()" class="mr-1">View ALL the Resolutions</v-btn>
                  </v-col>
                  <v-col cols="5">
                    <v-autocomplete v-model="selectedDepartment" :selectedDepartment.sync="selectedDepartment" variant="solo"  label="Filter Resolution by Department"
                                :items='departmentList' item-title="name" item-value="id" density="compact">
                    </v-autocomplete>
                  </v-col>
                  <!-- <v-col cols="2">
                    <v-btn color="yellow" dark>SEARCH</v-btn>
                  </v-col> -->
                </v-row>

                <div scrollable class="notice-board-wrap ml-5 mr-5" v-if="displayedResolutions.length > 0">
                  <div class="notice-list" v-for="resolution in displayedResolutions">
                    <div class="d-flex justify-space-between">
                      <span class="post-date bg-skyblue rounded-xl mt-2">{{ formatDate(resolution.timestamp) }}</span>
                      <div>
                        <v-icon dense color="primary" @click="editResolution(resolution)">mdi-pencil</v-icon>
                        <v-icon class="ml-5" dense color="red" @click="resolution.id !== null && deleteResolution(resolution.id)">mdi-delete</v-icon>
                      </div>
                    </div>
                    <div class="notice-content">
                      <p class="notice-description mt-5 font-weight-bold">{{ resolution.resolution_details }}</p>
                    </div>
                    <div class="entry-meta">{{ getDepartmentName(resolution.department_id) }} / 
                      <span :class="getStatusColor(resolution.status) ">{{ resolution.status }}</span></div>
                    <hr class="divider">
                  </div>
                </div>
                <div v-else>
                  <p>No Meeting Resolution Available</p>
                </div>
                <v-pagination class="mt-6" v-model="currentPage" :length="totalPages" @input="paginate"></v-pagination>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped>
.post-date {
  padding: 4px 8px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
}

.bg-skyblue {
  background-color: #0f5da1;
}

.bg-dark-pastel-green {
  background-color: #388E3C;
}

.bg-orange-peel {
  background-color: #FF9800;
}

.bg-tomato {
  background-color: #F44336;
}

.notice-title a {
  color: #000;
  font-size: 16px;
  font-weight: bold;
}

.entry-meta span {
  font-size: 12px;
  color: #777;
}

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
</style>