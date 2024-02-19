<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
  { title: "Employee Name", key: "name", sortable: true },
  { title: "Date", key: "date", sortable: true },
  { title: "Department", key: "department", sortable: false },
  { title: "Working Location", key: "location", sortable: false },
  { title: "Status", key: "status", sortable: false, align: 'center' },
  { title: "Worked Hours", key: "worked_h", sortable: false },
  { title: "Scheduled Hours", key: "schedule_h", sortable: false },
  { title: "Idle Time", key: "idle_time", sortable: false },
])

const employeeStatuses = ref([
  {
    id: 1,
    name: 'John Doe',
    status: 'On Leave',
    department: 'Marketting',
    date: '02/02/2024',
    location: 'Working from office',
    worked_h: '2h 19min',
    schedule_h: '5h',
    idle_time: '7min(s)'
  },
  {
    id: 2,
    name: 'Jane Smith',
    status: 'Active',
    department: 'Marketting',
    date: '17/11/2024',
    location: 'Working from office',
    worked_h: '28h 09min',
    schedule_h: '9h',
    idle_time: '6min(s)'
  },
  {
    id: 3,
    name: 'Wasim Jaffer',
    status: 'On Leave',
    department: 'Transport',
    location: 'Working from home',
    date: '23/03/2024',
    worked_h: '64h 11min',
    schedule_h: '7h',
    idle_time: '6min(s)'
  },
  {
    id: 4,
    name: 'Pan Hibsen',
    status: 'Active',
    department: 'Logistique',
    location: 'Working from home',
    date: '19/05/2024',
    worked_h: '12h 03min',
    schedule_h: '3h',
    idle_time: '11min(s)'
  },
  {
    id: 5,
    name: 'Yoshi Nagase',
    status: 'On Leave',
    department: 'Driver',
    location: 'Working from home',
    date: '3/12/2024',
    worked_h: '23h',
    schedule_h: '5h',
    idle_time: '6min(s)'
  },
])

const worked_hours = ref(""); // Remplacez par la valeur initiale de votre compteur

worked_hours.value = "35";

const employeeListStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeListStore)

onMounted(() => {
  employeeListStore.fetchEmployeeList();
});

const formattedEmployeeList = computed(() => {
  return employeeList.value.map((item: EmployeeInfo) => {
    return { ...item, full_name: `${item.first_name} ${item.last_name}` }
  })
});

const dateOptions = ['Last 1 month', 'Last 3 months', 'Last 6 months', 'Custom']

const customColors = ["#FF6384", "#36A2EB"];
const chartOptions = computed(() => {
  return {
    labels: ["Home", "Office"],
    chart: {
      type: "donut",
      fontFamily: `inherit`,
      foreColor: "#a1aab2",
      toolbar: {
        show: false,
      },
    },
    colors: customColors,
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "50%",
          background: "transparent",
        },
      },
    },
    stroke: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "top",
    },
    tooltip: { theme: "light", fillSeriesColor: true },
  };
});
const Chart = [60, 40];
</script>

<template>
  <v-row>
    <v-col cols="12" md="3">
      <v-card class="px-5 py-8">
          <div class="d-flex align-center">
              <v-card color="blue-lighten-5" class="mr-3" elevation="0">
                  <v-icon size="50" color="primary">mdi-calendar-remove</v-icon>
              </v-card>
              <span>
                <h4>Total Request</h4>
                <span>3</span>
              </span>
          </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-card class="px-5 py-8">
          <div class="d-flex align-center">
              <v-card color="red-lighten-5" class="mr-3" elevation="0">
                  <v-icon size="50" color="red-darken-2">mdi-umbrella-beach</v-icon>
              </v-card>
              <span>
                <h4>Request Status of TimeOff</h4>
                <span>Pending</span>
              </span>
          </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-card class="px-5 py-8">
          <div class="d-flex align-center">
              <v-card color="blue-lighten-5" class="mr-3" elevation="0">
                  <v-icon size="50" color="primary">mdi-calendar-remove</v-icon>
              </v-card>
              <span>
                <h4>Total Absences</h4>
                <span>10</span>
              </span>
          </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-card class="px-5 py-8">
          <div class="d-flex align-center">
              <v-card color="green-lighten-5" class="mr-3">
                  <v-icon size="50" color="green">mdi-calendar</v-icon>
              </v-card>
              <span>
                <h4>Pre-appouved Absences</h4>
                <span>2</span>
              </span>
          </div>
      </v-card>
    </v-col>
   
    
    <v-col cols="12" md="5">
        <v-card class="px-5 py-5">
          <div class="d-flex align-center">
            <span>
              <h4 >Avg. Hours Worked Per Week</h4>
              <div class="d-flex align-center justify-center">
                <vue-speedometer 
                    :width="500"
                    :needleHeightRatio="0.7"
                    :value="`${worked_hours}`"
                    :customSegmentLabels='[
                        {
                        text: "Very Bad",
                        position: "INSIDE",
                        color: "#555",
                        },
                        {
                        text: "Bad",
                        position: "INSIDE",
                        color: "#555",
                        },
                        {
                        text: "Ok",
                        position: "INSIDE",
                        color: "#555",
                        fontSize: "19px",
                        },
                        {
                        text: "Good",
                        position: "INSIDE",
                        color: "#555",
                        },
                        {
                        text: "Very Good",
                        position: "INSIDE",
                        color: "#555",
                        },
                    ]'
                    :ringWidth="47"
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
    <v-col cols="12" md="7">
      <v-card height="372" class="px-5 py-3">
        <div class="d-flex align-center">
          <span>
            <h4>Attendance Statistique</h4>
            <AttendanceStat />
          </span>
        </div>
      </v-card>
    </v-col>
    <!-- <v-col cols="12" md="6">
        <EmployeeBar />
    </v-col> -->
    <v-col cols="12" md="6">
       <LeaveTypeDistrStat />
    </v-col>
  </v-row>
</template>