<script setup lang="ts">
import type { InterviewScheduleInfo } from '~/types/recruiting/interview_schedule';

import { useDisplay } from 'vuetify'
import { useInterviewScheduleStore } from '~/stores/recruiting/interview_schedule';
const { mobile } = useDisplay()

/********************
 *PINIA STORE DATA
********************/

const interviewScheduleListStore = useInterviewScheduleStore();
const { interviewScheduleList, loading: loadingScheduleList } = storeToRefs(interviewScheduleListStore)

const ApplicantStore = useApplicantStore();
const { applicantList } = storeToRefs(ApplicantStore);

const JobPostingListStore = useJobPostingStore();
const { jobPostingList } = storeToRefs(JobPostingListStore);

/********************
 *MOUNTED HOOKS
********************/

// onMounted(() => {
//   interviewScheduleListStore.fetchInterviewList()
// })

/********************
 *RESPONSIVE DATA 
********************/

const layoutType = ref('month')  // ['month','week']

const months = ref([
  { id: 0, text: 'January' },
  { id: 1, text: 'February' },
  { id: 2, text: 'March' },
  { id: 3, text: 'April' },
  { id: 4, text: 'May' },
  { id: 5, text: 'June' },
  { id: 6, text: 'July' },
  { id: 7, text: 'August' },
  { id: 8, text: 'September' },
  { id: 9, text: 'October' },
  { id: 10, text: 'November' },
  { id: 11, text: 'December' }
])

const daysOfWeek = ref(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])

const editedSheduleInterviewRecord = ref({});

const scheduleInterviewDialog = ref(false)

const updatingSheduleInterviewRecord = ref(false)

const selectedDate = ref<string | null>(null)

/********************
 *COMPUTED PROPERTIES
********************/

const firstLoad = computed(() => {
  return interviewScheduleList.value.length == 0 && loadingScheduleList.value
    && (layoutType.value == 'month' ? !calendarGrid.value?.length : '')
})

const loading = computed(() => {
  return loadingScheduleList.value
})

const calendarGrid = computed(() => {
  switch (layoutType.value) {
    case 'month':
      return annualCalendarGridLayout();
    case 'week':
      return weeklyCalendarGridLayout();
    default:
      return []
  }
})

let interviews: any[] = [];
const currentDate = ref(new Date());
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)

const firstDayOfWeek = ref(1)
const currentWeek = ref(getWeekNumber(currentYear.value, currentMonth.value, currentDate.value.getDate(), firstDayOfWeek.value))

const nextMonth = () => {
  currentMonth.value += 1;
  if (currentMonth.value > 12) {
    currentMonth.value = 1;
    currentYear.value += 1;
  }
  currentWeek.value = getWeekNumber(currentYear.value, currentMonth.value, 1, firstDayOfWeek.value)
}

const previousMonth = () => {
  currentMonth.value -= 1;
  if (currentMonth.value < 1) {
    currentMonth.value = 12;
    currentYear.value -= 1;
  }
  currentWeek.value = getWeekNumber(currentYear.value, currentMonth.value, 1, firstDayOfWeek.value)
}

const nextWeek = () => {
  currentWeek.value += 1;
  if (currentWeek.value > 51) {
    currentWeek.value = 1;
    currentYear.value += 1;
    currentMonth.value = 1  // january //getMonthForWeek(currentYear.value, currentWeek.value)
  } else {
    currentMonth.value = getMonthForWeek(currentYear.value, currentWeek.value) + 1
  }
}

const previousWeek = () => {
  currentWeek.value -= 1;
  if (currentWeek.value < 0) {
    currentWeek.value = 52;
    currentYear.value -= 1
    currentMonth.value = 12 //december //getMonthForWeek(currentYear.value, currentWeek.value)
  }
  else {
    currentMonth.value = getMonthForWeek(currentYear.value, currentWeek.value) + 1
  }
}

const inCurrentWeek = () => {
  let currentDate = new Date()
  let thisWeek = getWeekNumber(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), firstDayOfWeek.value)
  if (currentYear.value == currentDate.getFullYear() && currentMonth.value - 1 == currentDate.getMonth() && thisWeek == currentWeek.value) {
    return true
  }
  return false
}

const goToCurrentWeek = () => {
  let currentDate  = new Date()
  currentYear.value = currentDate.getFullYear()
  currentMonth.value = currentDate.getMonth()
  currentWeek.value = getWeekNumber(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), firstDayOfWeek.value)
}

const inCurrentMonthAndYear = () => {

  if (currentYear.value == currentDate.value.getFullYear() && currentMonth.value - 1 == currentDate.value.getMonth()) {
    return true
  }
  return false
}

const isMobile = computed(() => {
  return mobile.value
})


/*********
 *METHODS
*********/


function getFirstLetter(str: string): string {
  if (str.length === 0) {
    return ''; // Return an empty string if the input string is empty
  }
  return str.charAt(0).toUpperCase() + str.charAt(1) + str.charAt(2); // Retrieve the first two characters of the string
}

const updateSheduleInterviewRecord = (value: boolean) => {
  scheduleInterviewDialog.value = value
  editedSheduleInterviewRecord.value = {}
  updatingSheduleInterviewRecord.value = false
}



function annualCalendarGridLayout() {
  let calendar = [];
  let month = 1;

  const firstDayOfWeek = 1; // Sunday:0 , Monday:1, ... , Saturday:6. Thus 1 represents Monday
  while (month <= 12) {
    let data = getMonthGridCalendar(currentYear.value, month, firstDayOfWeek);
    calendar.push({ headers: formatHeaders(data.headers), calendar: data.calendar, month: months.value[month - 1].text });
    month += 1;
  }

  let responses: any[] = [];

  calendar.forEach((monthData, monthIndex) => {
    const currentDate = new Date(currentYear.value, monthIndex + 1, 0);
    const numberOfDays: number = currentDate.getDate();
    let daysOfMonth = []
    for (let day = 1; day <= numberOfDays; day++) {
      daysOfMonth.push(day);
    }

    let response: any[] = [];

    monthData.calendar.forEach((group, groupIndex) => {
      let data: (number | { id: number; values: number[] } | null)[] = [];
      let interviewsForDay = interviews.filter((interview) => {
        return (
          interview.interview_date.getFullYear() === currentYear.value &&
          interview.interview_date.getMonth() === monthIndex &&
          interview.interview_date.getDate() === group[groupIndex]
        );
      });

      if (interviewsForDay.length > 0) {
        data = interviewsForDay.map((interview) => {
          return {
            id: interview.id,
            values: interview.values,
          };
        });
      } else {
        data = group;
      }
      response.push(data);
    });
    responses.push({ headers: monthData.headers, calendar: response, month: monthData.month });
  });
  return responses;
}

function getMonthGridCalendar(year: number, month: number, firstDayOfWeek: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const headers = [];

  // Sort the days of the week based on the first day of the week
  for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i++) {
    const index = i % 7;
    headers.push(daysOfWeek.value[index]);
  }
  const calendar = [];
  let week = [];

  // Fill in empty days before the start of the month
  const startDayOfWeek = (startDate.getDay() - firstDayOfWeek + 7) % 7;
  for (let i = 0; i < startDayOfWeek; i++) {
    week.push(null);
  }

  // Loop through each day of the month
  for (let day = 1; day <= endDate.getDate(); day++) {
    week.push(day);

    // If it's the last day of the week, start a new row
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }
  // Add the last week to the calendar
  calendar.push(week);
  return { headers, calendar };
}


function weeklyCalendarGridLayout() {

  let calendar = getWeekGridCalendar(currentYear.value, currentWeek.value, firstDayOfWeek.value);

  let response: any[] = []
  calendar.forEach((group, groupIndex) => {
    let data: (number | { id: number; values: number[] } | null)[] = [];
    let interviewsForDay = interviews.filter((interview) => {
      return (
        interview.interview_date.getFullYear() === group.year &&
        interview.interview_date.getMonth() === group.month &&
        interview.interview_date.getDate() === group.date
      );
    });

    if (interviewsForDay.length > 0) {
      data = interviewsForDay.map((interview) => {
        return {
          id: interview.id,
          values: interview.values,
        };
      });
    }
    response.push({
      ...group,
      interviewData: data
    })
  });

  return response;
}

function getWeekGridCalendar(year: number, weekNumber: number, firstDayOfWeek: number) {
  const calendar = [];
  const weekStart = new Date(year, 0, 1);

  // Find the first day of the week for the given week number
  const daysOffset = (weekStart.getDay() - firstDayOfWeek + 7) % 7;
  const firstWeekStart = new Date(year, 0, (7 - daysOffset) + 1);
  weekStart.setDate(firstWeekStart.getDate() + (weekNumber - 1) * 7);

  // Fill in days for the week
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(weekStart);
    currentDay.setDate(currentDay.getDate() + i);

    const year = currentDay.getFullYear();
    const month = currentDay.getMonth();
    const date = currentDay.getDate();
    const dayOfWeek = daysOfWeek.value[(currentDay.getDay() + firstDayOfWeek) % 7];
    const dayNumber = currentDay.getDay();

    calendar.push({ year, month: month + 1, date, dayOfWeek });
  }

  return calendar;
}



function formatHeaders(headers: Array<string>) {
  return headers.map(item => {
    return { key: item, title: getFirstLetter(item), sortable: false, align: 'center' };
  })
}

function showEditSheduleInterview(interview_id: any) {
  let interview = interviewScheduleList.value.find((item: InterviewScheduleInfo) => item.id == interview_id)
  if (interview) {
    editedSheduleInterviewRecord.value = interview
    updatingSheduleInterviewRecord.value = true
    scheduleInterviewDialog.value = true
  }
}

/**
 * Get the week number (starting from 0) in which a given date falls within a particular year.
 * @param {number} year - The year.
 * @param {number} month - The month (0-based, where 0 represents January and 11 represents December).
 * @param {number} date - The date.
 * @param {number} firstDayOfWeek - The first day of the week (0 for Sunday, 1 for Monday, and so on).
 * @returns {number} - The week number (starting from 0).
 */
function getWeekNumber(year: number, month: number, date: number, firstDayOfWeek: number): number {
  // Create a new date object for the given year, month, and date
  const targetDate = new Date(year, month, date);

  // Find the first day of the year
  const startOfYear = new Date(year, 0, 1);

  // Calculate the number of days between the target date and the start of the year
  const diffTime = targetDate.getTime() - startOfYear.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Calculate the week number by dividing the number of days by 7 and accounting for the first day of the week
  const weekNumber = Math.floor((diffDays + startOfYear.getDay() - firstDayOfWeek) / 7);

  return weekNumber;
}


/**
 * Get the month (the first month) for a given year and week number.
 * @param {number} year - The year.
 * @param {number} weekNumber - The week number (starting from 0).
 * @param {number} firstDayOfWeek - The first day of the week (0 for Sunday, 1 for Monday, and so on).
 * @returns {number} - The month (0-based, where 0 represents January and 11 represents December).
 */
function getMonthForWeek(year: number, weekNumber: number): number {
  // Find the first day of the year
  const startOfYear = new Date(year, 0, 1);

  // Calculate the start of the week for the given week number
  const weekStart = new Date(startOfYear);
  weekStart.setDate(weekStart.getDate() + weekNumber * 7);

  // Return the month (0-based) of the week start date
  return weekStart.getMonth();
}

function addSheduleInterview(event: InterviewScheduleInfo) {
  interviewScheduleListStore.createInterviewSchedule(event)
}

function editSheduleInterview(event: InterviewScheduleInfo) {
  interviewScheduleListStore.updateInterviewSchedule(event)
}

function updateCurrentYear(event: number) {
  currentYear.value = event
}

function addInterview(monthDay: number, monthNumber: number) {
  const currentDate = new Date();
  const date = new Date(currentYear.value, monthNumber, monthDay, 0, 0, 0);
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Check if the month has already passed
  if (monthNumber < currentMonth + 1) {
    useLayoutStore().setStatusMessage('Cannot add a interview in a past month', 'error');
    return;
  }

  // Check if the month is the current month
  if (monthNumber === currentMonth + 1) {
    // Check if the day has already passed
    if (monthDay < currentDay) {
      useLayoutStore().setStatusMessage('Cannot add a interview on a past day', 'error');
      return;
    }
  }

  // Month and day are valid, proceed with adding the interview
  selectedDate.value = date.toISOString().substring(0, 10);
  scheduleInterviewDialog.value = true;
}


function getTimeFromDateTime(dateTime: any) {
  if (dateTime) {
    const [date, time] = dateTime.split(' ');
    const dateObj = new Date(`${date}T${time}`);
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = (hour % 12) || 12; // Converts time to 12-hour format
    const formattedMinute = String(minute).padStart(2, '0'); // Add a zero in front of the minutes if necessary
    return `${formattedHour}:${formattedMinute} ${period}`;
  }
  return '';
}

function interviewsOnDay(day: any, month: any, year: any) {
  // Filter interviews taking place on the specified day
  const interviews = interviewScheduleList.value.filter(interview => {
    // Compare interview date with specified day
    const [date, time] = (interview.interview_date || '').split(' ');

    const interviewDate = new Date(date);
    const interviewYear = interviewDate.getFullYear();
    const interviewMonth = interviewDate.getMonth() + 1;
    const interviewDay = interviewDate.getDate();

    return interviewMonth === month && interviewDay === day && interviewYear === year;
  });
  return interviews;
}

const getApplicantName = ( applicantId: any) => {
    const applicant = applicantList.value.find(applicant => applicant.id === applicantId);
    return applicant ? (`${applicant.first_name} ${applicant.last_name}`): '';
  };

  const getJobName = ( jobId: any) => {
    const job = jobPostingList.value.find(job => job.id === jobId);
    return job ? job.title : '';
  };

  const getStatusColor = (status:any) => {
    if (status === 'Cancelled') {
      return 'bg-red';
    } else if (status === 'Scheduled') {
      return 'bg-blue'; 
    } else if (status === 'Completed') {
      return 'bg-green'; 
    }
  }

</script>

<template>
  <div>
    <div class="d-flex justify-space-between mt-3 mb-15">
      <span class="text-primary text-h5">Schedule Interviews</span>
      <div>
        <RecruitingScheduleInterviewDialog :show="scheduleInterviewDialog" @update:addInfo="addSheduleInterview"
          @update:editInfo="editSheduleInterview" @update:show="updateSheduleInterviewRecord"
          :updating="updatingSheduleInterviewRecord" :item="(editedSheduleInterviewRecord as any)"
          :selectedDate="(selectedDate as any)" />
      </div>
    </div>
    <!-- Month Layout -->
    <v-row v-if="layoutType == 'month'">
      <v-col v-if="firstLoad" cols="12" md="3">
        <v-card>
          <v-card-title density="compact" color="primary">
            <div class="text-center">
              {{ months[currentMonth - 1].text }} {{ currentYear }}
            </div>
          </v-card-title>
          <v-card-text>
            <v-skeleton-loader elevation="0" type="image"></v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-else cols="12">
        <v-card>
          <v-card-title density="compact" color="primary">
            <div class="d-flex justify-space-between">
              <div>
                <v-btn :disabled="inCurrentMonthAndYear()" color="primary" variant="tonal" density="compact"
                  @click="currentMonth = new Date().getMonth() + 1; currentYear = new Date().getFullYear()"
                  class="mr-1 ">Today</v-btn>
                <v-btn color="primary" density="compact" icon="mdi-chevron-left" variant="plain"
                  @click="previousMonth()"></v-btn>
                <v-btn color="primary" icon="mdi-chevron-right" variant="plain" @click="nextMonth()"></v-btn>
                {{ months[currentMonth - 1].text }} {{ currentYear }}
              </div>

              <div style="width: 150px">
                <v-select label="Layout" v-model="layoutType" :items="['month', 'week']" hide-details density="compact"
                  style="width: 150px;" variant="outlined"></v-select>
              </div>

            </div>
          </v-card-title>
          <v-card-text>
            <v-data-table :loading="loading" class="shedule shedule-display"
              :items="calendarGrid[currentMonth - 1].calendar" :headers="calendarGrid[currentMonth - 1].headers">
              <template v-slot:body="{ items }">
                <tr v-for="(item, k) in items" :key="'row-' + k">
                  <td class="px-0  date-cell" v-for="(day, l) in item" :key="'row-' + l">
                    <div class="d-flex text-center justify-space-between">
                      <span style="cursor: pointer;" @click="day != null ? addInterview(day, currentMonth) : ''"
                        class="pa-16 pb-10 flex-grow-1 fix">{{ day }}</span>
                    </div>
                    <div class="text-center mb-2" v-for="interview in interviewsOnDay(day, currentMonth, currentYear)"
                      @click="showEditSheduleInterview(interview.id)">

                      <v-chip :class="[getStatusColor(interview.interview_status)]" class="pt-6 pb-6 rounded-xl" style=" cursor: pointer;" color="accent">
                        <div style="display: flex; flex-direction: column;">
                          <span>Position: {{ getJobName(interview.job_posting_id) }}</span>
                          <span>{{ getTimeFromDateTime(interview.interview_date) }}, {{ interview.interview_status }}</span>
                        </div>
                      </v-chip>

                    </div>
                  </td>
                </tr>
              </template>
              <template v-slot:headers="{ columns }">
                <tr>
                  <th v-for="(header, i) in columns" :key="i" class="px-0 text-center header-cell">
                    <span class="font-weight-bold">{{ header.title }}</span>
                  </th>
                </tr>
              </template>
              <!-- hide footer -->
              <template #bottom></template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Week Layout -->
    <v-row v-if="layoutType == 'week'">
      <v-col v-if="firstLoad" cols="12" md="3">
        <v-card>
          <v-card-title density="compact" color="primary">
            <div class="text-center">
              {{ months[currentMonth - 1].text }} {{ currentYear }}
            </div>
          </v-card-title>
          <v-card-text>
            <v-skeleton-loader elevation="0" type="image"></v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-else cols="12">
        <v-card>
          <v-card-title density="compact" color="primary">
            <div class="d-flex justify-space-between">
              <div>
                <v-btn :disabled="inCurrentWeek()" color="primary" variant="tonal" density="compact"
                  @click="goToCurrentWeek()"
                  class="mr-1 ">This Week</v-btn>
                <v-btn color="primary" density="compact" icon="mdi-chevron-left" variant="plain"
                  @click="previousWeek()"></v-btn>
                <v-btn color="primary" icon="mdi-chevron-right" variant="plain" @click="nextWeek()"></v-btn>
                {{ calendarGrid[0].year }} {{ months[calendarGrid[0].month - 1].text }} {{ calendarGrid[0].date }} -
                {{ calendarGrid[calendarGrid.length - 1].year }} {{ months[calendarGrid[calendarGrid.length - 1].month -
          1].text }}
                {{ calendarGrid[calendarGrid.length - 1].date }}
              </div>
              <div style="width: 150px">
                <v-select label="Layout" v-model="layoutType" :items="['month', 'week']" hide-details density="compact"
                  style="width: 150px;" variant="outlined"></v-select>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <v-col>
              <div v-for="(item, index) in calendarGrid" :key="index">
                <p class="font-weight-bold text-" cols="12">{{ item.year }} {{ months[item.month - 1].text }} {{item.date}}
                  <v-btn class="text-none" color="primary" variant="text" style="cursor: pointer;" @click="addInterview(item.date, item.month)">Add</v-btn>
                </p>

                <div class="text-center mb-2" v-for="(interview, interviewIndex) in item.interviews" :key="interviewIndex"
                  @click="showEditSheduleInterview(interview.id)">

                  <v-chip class="bg-blue pa-1 rounded-xl" style="color:cornflowerblue; cursor: pointer;" color="accent">
                    {{ getTimeFromDateTime(interview.interview_date) }}, {{ interview.interview_status }}
                  </v-chip>
                </div>
                <v-divider class="my-3"></v-divider>
              </div>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<style scoped>
.fix {
  position: sticky;
  background: white;
  left: 0;
  z-index: 4;
}

.shedule.v-data-table :deep() table td.date-cell {
  border: 0.2px solid gainsboro !important;
  padding: 0 !important;
  height: 120px;
  /* Fixed height for date cells */
}

.header-cell {
  font-weight: bold;
  border: 0.2px solid gainsboro !important;
  padding: 0 !important;
}

.shedule.v-data-table :deep() table th {
  border-bottom: 0.2px solid gainsboro !important;
  padding: 0 !important;
}

.shedule-display.v-data-table :deep() table th {
  font-size: 12px !important;
}
</style>