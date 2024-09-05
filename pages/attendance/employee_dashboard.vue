<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import EmployeeLeaveTypeDistrStat from '@/components/attendance/EmployeeLeaveTypeStat.vue';
// @ts-ignore
import VueSpeedometer from "vue-speedometer"

const currentDate = ref(new Date());

interface DayOfWeek {
    day: number;
    dayOfWeek: string;
    isToday: boolean;
}

const worked_hours = ref(""); // Remplacez par la valeur initiale de votre compteur

worked_hours.value = "35";

const employeeListStore = useEmployeeStore()
const { employeeList, loading: EmployeeLoading } = storeToRefs(employeeListStore)

const timeoffRequestStore = useTimeoffRequestStore();
const { timeoffRequestList, loading: TimeOffLoading } = storeToRefs(timeoffRequestStore);

const employeeTimeoffRequestStore = useEmployeeTimeoffRequestStore();
const {employeeTimeoffRequestList, loading: EmployeeTimeOffLoading} = storeToRefs(employeeTimeoffRequestStore)

const userTypeStore = useAuthStore();
const {user} = storeToRefs(userTypeStore)

onMounted(() => {
  employeeListStore.fetchEmployeeList();
  timeoffRequestStore.loadTimeoffRequests();
});

const loading = computed(()=>{
    return EmployeeLoading.value || TimeOffLoading.value || EmployeeTimeOffLoading.value
})

const employeeTimeOffPending = employeeTimeoffRequestList.value.filter((item) => item.status === "pending" && item.user_id === user.value?.id).length;
const employeeTimeOffRejected = employeeTimeoffRequestList.value.filter((item) => item.status === "rejected" && item.user_id === user.value?.id).length;
const employeeTimeOffRequest = employeeTimeoffRequestList.value.filter((item) => item.user_id === user.value?.id).length;

function getDaysInMonth(year: number, month: number): DayOfWeek[] {
    const daysInMonth: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today: Date = new Date();
    const firstDayOfMonth: Date = new Date(year, month, 1);
    const startingDayOfWeek: number = firstDayOfMonth.getDay();
    const numberOfDays: number = new Date(year, month + 1, 0).getDate();
    const days: { day: number; dayOfWeek: string; isToday: boolean }[] = [];

    for (let day = 1; day <= numberOfDays; day++) {
        const date: Date = new Date(year, month, day);
        const dayOfWeek: string = daysInMonth[(startingDayOfWeek + (day - 1)) % 7];
        const isToday: boolean = date.toDateString() === today.toDateString();
        days.push({ day, dayOfWeek, isToday });
    }
    return days;
}

// sort date ranges in ascending order
function sortNonOverlappingDateRanges(dateRanges: Array<any>) {
    dateRanges.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime() || new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
    return dateRanges;
}

const numberOfAbsences = computed(() => {
  let daysOfMonth = getDaysInMonth(currentDate.value.getFullYear(),currentDate.value.getMonth()).map((item) => item.day);
  let employee_days_off_in_month = sortNonOverlappingDateRanges(timeoffRequestList.value.filter((employee) => {
      return employeeList.value.some((item) => item.id  === employee.user_id) 
    })) || [];

    const loggedInEmployee = employeeList.value.find((employee) => {
      return employee.id ===  user.value?.id;
    });

    if (!loggedInEmployee) {
      return 0;
    }

    const employeeDaysOff = employee_days_off_in_month.filter((item) => item.user_id === loggedInEmployee.id);

    console.log(employeeDaysOff)

    const daysOff = employeeDaysOff.reduce((totalDaysOff, item) => {
      const startDate = new Date(item.start_date).getTime();
      const endDate = new Date(item.end_date).getTime();
      const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      return totalDaysOff + durationInDays;
    }, 0);

  const availableDays = daysOfMonth.length - daysOff;

  const absenceDays = daysOfMonth.length - availableDays;

  console.log(daysOff);
  console.log(absenceDays);

  return absenceDays;
});

</script>

<template>
  <v-row>
    <v-col cols="12" md="6" lg="3" class="col">
      <v-card class="px-5 py-8">
          <div class="d-flex align-center">
              <v-card color="blue-lighten-5" class="mr-3" elevation="0">
                  <v-icon size="50" color="primary">mdi-calendar-remove</v-icon>
              </v-card>
              <span>
                <h4>Total Request</h4>
                <span v-if="loading && !employeeTimeoffRequestList">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </span>
                <span>{{ employeeTimeOffRequest }}</span>
              </span>
          </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" lg="3" class="col">
      <v-card class="px-5 py-8">
          <div class="d-flex align-center">
              <v-card color="red-lighten-5" class="mr-3" elevation="0">
                  <v-icon size="50" color="red-darken-2">mdi-umbrella-beach</v-icon>
              </v-card>
              <span>
                <h4>Rejected TimeOff</h4>
                <span v-if="loading && !employeeTimeoffRequestList">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </span>
                <span>{{ employeeTimeOffRejected }}</span>
              </span>
          </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" lg="3" class="col">
      <v-card class="px-5 py-8">
          <div class="d-flex align-center">
              <v-card color="blue-lighten-5" class="mr-3" elevation="0">
                  <v-icon size="50" color="primary">mdi-calendar-remove</v-icon>
              </v-card>
              <span>
                <h4>Total Absences</h4>
                <span v-if="loading && !employeeTimeoffRequestList">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </span>
                <span>{{ numberOfAbsences }}</span>
              </span>
          </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" lg="3" class="col">
      <v-card class="px-5 py-8">
          <div class="d-flex align-center">
              <v-card color="green-lighten-5" class="mr-3">
                  <v-icon size="50" color="green">mdi-calendar</v-icon>
              </v-card>
              <span>
                <h4>Pre-Approved Absences</h4>
                <span v-if="loading && !employeeTimeoffRequestList">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </span>
                <span>{{employeeTimeOffPending}}</span>
              </span>
          </div>
      </v-card>
    </v-col>
    
    <v-col cols="12" md="6" lg="3" class="col">
      <v-card class="px-5 py-5">
        <div class="d-flex align-center">
          <span>
            <h4>Avg. Hours Worked Per Week</h4>
            <div>
              <vue-speedometer
                class="speedometer"
                :value="`${worked_hours}`"
                :customSegmentLabels="[
                  {
                    text: 'Very Bad',
                    position: 'INSIDE',
                    color: '#555',
                  },
                  {
                    text: 'Bad',
                    position: 'INSIDE',
                    color: '#555',
                  },
                  {
                    text: 'Ok',
                    position: 'INSIDE',
                    color: '#555',
                    fontSize: '19px',
                  },
                  {
                    text: 'Good',
                    position: 'INSIDE',
                    color: '#555',
                  },
                  {
                    text: 'Very Good',
                    position: 'INSIDE',
                    color: '#555',
                  },
                ]"
                :ringWidth="36"
                :needleTransitionDuration="4000"
                :minValue="0"
                :maxValue="50"
                needleTransition="easeElastic"
                needleColor="#a7ff83"
                textColor="#d8dee9"
              />
            </div>
          </span>
        </div>
      </v-card>
    </v-col>
    <!-- <v-col cols="12" md="6" lg="6" class="col">
      <v-card height="372" class="px-5 py-3">
        <div class="d-flex align-center">
          <span>
            <h4>Attendance Statistique</h4>
            <AttendanceStat />
          </span>
        </div>
      </v-card>
    </v-col> -->
    <v-col cols="12" md="6" lg="6">
       <EmployeeLeaveTypeDistrStat />
    </v-col>
  </v-row>
</template>

<style>
.speedometer {
  width: 100%;
}

@media (min-width: 600px) {
  .speedometer {
    width: 300px;
    margin-left: -15px;
  }
}

@media (min-width: 960px) {
  .speedometer {
    width: 500px;
  }
}

@media (min-width: 1200px) {
  .speedometer {
    width: 600px;
    margin-left: -15px;
  }
}
</style>