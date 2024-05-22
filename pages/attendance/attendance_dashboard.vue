<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { DriverInfo } from '@/types/store/driver'
import type { EmployeeInfo } from '@/types/store/employee'
import { Doughnut } from 'vue-chartjs';
import LineDiagram from '@/components/attendance/LineDiagram.vue';
import AttendanceStat from '@/components/attendance/AttendanceStat.vue';
import EmployeeBar from '@/components/attendance/EmployeeAttendanceStat.vue';
import LeaveTypeDistrStat from '@/components/attendance/LeaveTypeDistrStat.vue';
// @ts-ignore
import VueSpeedometer from "vue-speedometer"

const headers = ref([
  { title: "Employee ID", key: "id", sortable: true },
  { title: "Employee Name", key: "full_name", sortable: true },
  { title: "Email", key: "email", sortable: true },
  { title: "Department", key: "department.name", sortable: false },
  { title: "Cell Phone", key: "cell_phone", sortable: false },
  { title: "Address 1", key: "address1", sortable: false },
  { title: "Status", key: "status", sortable: false, align: 'center' },
  { title: "City", key: "city", sortable: false },
  { title: "Approver Id", key: "leave_approver.first_name", sortable: false },
  { title: "Policy Id", key: "policy_id", sortable: false },
  { title: "Role ID", key: "role_id", sortable: false },
  { title: "Hire Date", key: "hire_date", sortable: true },
  { title: "Termination Date", key: "termination_date", sortable: true },
 
])

const currentDate = ref(new Date());

interface DayOfWeek {
    day: number;
    dayOfWeek: string;
    isToday: boolean;
}


const employeeListStore = useEmployeeStore()
const { employeeList, loading: loadingEmployee } = storeToRefs(employeeListStore)

const timeoffRequestStore = useTimeoffRequestStore();
const { timeoffRequestList, loading: loadingTimeOff } = storeToRefs(timeoffRequestStore);

const loading = computed(()=>{
    return loadingEmployee.value || loadingTimeOff.value
})

onMounted(() => {
  employeeListStore.fetchEmployeeList();
  timeoffRequestStore.loadTimeoffRequests();
});

const employeeTimeOffRejected = computed(() => {
  return timeoffRequestList.value.filter((item) => item.status === "rejected").length;
})

const employeeTimeOffPending = computed(() => {
  return timeoffRequestList.value.filter((item) => item.status === "pending").length;
})

const totalEmployee = computed(() => {
   return employeeList.value.filter((item) => item.id).length;
})

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
      return employeeList.value.some((item) => item.id  === employee.employee_id) 
    })) || [];

    const employeeChartData = employeeList.value.map((employee) => {
      const employeeDaysOff = employee_days_off_in_month.filter((item) => item.employee_id === employee.id);

      const daysOff = employeeDaysOff.reduce((totalDaysOff, item) => {
        const startDate = new Date(item.start_date).getTime();
        const endDate = new Date(item.end_date).getTime();
        const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        return totalDaysOff + durationInDays;
      }, 0);

      const availableDays = daysOfMonth.length - daysOff;

      const absenceDays = daysOfMonth.length - availableDays

      return absenceDays;
    });
    const totalAbsences = employeeChartData.reduce((acc, curr) => acc + curr, 0);
  return totalAbsences
});

</script>

<template>
  <v-row>
    <v-col cols="12" md="6" lg="3" class="col">
      <v-card class="px-5 py-5 pb-14">
          <div class="d-flex align-center">
              <v-card color="blue-lighten-5" class="mr-3" elevation="0">
                  <v-icon size="50" color="primary">mdi-account</v-icon>
              </v-card>
              <div>
                <h4>Total Employee</h4>
                <span v-if="loading && !totalEmployee">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </span>
                <span v-else>
                  {{ totalEmployee }}
                </span>
              </div>
          </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" lg="3" class="col">
      <v-card class="px-5 py-5 pb-14">
          <div class="d-flex align-center">
              <v-card color="blue-lighten-5" class="mr-3" elevation="0">
                  <v-icon size="50" color="primary">mdi-clock-outline</v-icon>
              </v-card>
              <div>
                <h4>Total Request Pending</h4>
                <span v-if="loading && !employeeTimeOffPending">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </span>
                <span v-else>{{ employeeTimeOffPending }}</span>
              </div>
          </div>
      </v-card>
    </v-col>
    
    <v-col cols="12" md="6" lg="3" class="col">
      <v-card class="px-5 py-5 pb-14">
          <div class="d-flex align-center align-items">
              <v-card color="red-lighten-5" class="mr-3" elevation="0">
                  <v-icon size="50" color="red-darken-2">mdi-umbrella-beach</v-icon>
              </v-card>
              <div>
                <h4>Unapproved Leave</h4>
                <span v-if="loading && !timeoffRequestList">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </span>
                <span v-else>{{employeeTimeOffRejected}}</span>
              </div>
          </div>
      </v-card>
    </v-col>

   
    <v-col cols="12" md="6" lg="3" class="col">
      <v-card class="px-5 py-5 pb-14">
          <div class="d-flex align-center">
              <v-card color="blue-lighten-5" class="mr-3" elevation="0">
                  <v-icon size="50" color="primary">mdi-calendar-remove</v-icon>
              </v-card>
              <div>
                <h4>Absences</h4>
                <span>{{ numberOfAbsences }}</span>
              </div>
          </div>
      </v-card>
    </v-col>

    <!-- <v-col cols="12" md="6">
        <LineDiagram />
    </v-col> -->

    <v-col cols="12" md="6">
        <EmployeeBar />
    </v-col>

    <v-col cols="12" md="6">
       <LeaveTypeDistrStat />
    </v-col>

    <!-- <v-col cols="12" md="6">
      <v-card height="372" class="px-5 py-3">
        <div class="d-flex align-center">
          <span>
            <h4>Attendance Statistique</h4>
            <AttendanceStat />
          </span>
        </div>
      </v-card>
    </v-col> -->

    <v-col cols="12">
      <v-card>
        <v-card-title>
          Employee Attendance Detail 
        </v-card-title>
        <v-card-text>
          <v-data-table :loading="loading && !totalEmployee" density="compact" :headers="(headers as any)" :items="employeeList.slice(0, 5)">
            <template v-slot:item.status="{ value }">
              <v-chip :color="value === 'On Leave' ? 'red' : 'primary'">{{ value }}</v-chip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>