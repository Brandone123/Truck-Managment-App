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

const totalKilometers = ref(0); // Remplacez par la valeur initiale de votre compteur

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
              <v-card color="green-lighten-5" class="mr-3">
                  <v-icon size="50" color="green">mdi-calendar</v-icon>
              </v-card>
              <span>
                <h4>Dates</h4>
                <v-autocomplete style="width: 250px; height: 20px;" label="Select Date" variant="outlined" :items='dateOptions'
              density="compact"></v-autocomplete>
              </span>
          </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="3">
      <v-card class="px-5 py-8">
        <div class="d-flex align-center">
            <v-card color="deep-purple-lighten-5" class="mr-3">
                <v-icon size="50" color="deep-purple">mdi-account-group-outline</v-icon>
            </v-card>
          <div>
            <h4>Employees</h4>
            <v-autocomplete style="width: 250px; height: 20px;" label="All" variant="outlined" :items='formattedEmployeeList' item-title="full_name"
              density="compact"></v-autocomplete>
          </div>
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
                <h4>Unapproved Leave</h4>
                <span>126</span>
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
                <h4>Absences</h4>
                <span>329</span>
              </span>
          </div>
      </v-card>
    </v-col>


      <!-- <v-col cols="12" md="2">
        <v-card class="px-5 py-1">
          <div class="d-flex align-center">
            <span>
              <h4 >Avg. Hours Worked</h4>
              <div class="d-flex align-center justify-center">
                <vue-speedometer
                  :maxSegmentLabels="12"
                  :segments="2"
                  value="5"
                  :segmentColors='["tomato","gray"]'
                  needleColor="black"
                  width="200"
                  height="21"
                  :minValue="0" 
                  :maxValue="6"
                  :needleTransitionDuration="4000"
                  needleTransition="easeElastic"
                />
              </div>
            </span>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="px-4 py-1">
            <span>
              <h2>Working Location</h2>
              <span>Drill down for shift details</span>
              <div class="d-flex align-center justify-center">
                <client-only>
                  <div class="chart-container text-center">
                    <apexchart
                      type="donut"
                      height="180"
                      :options="chartOptions"
                      :series="Chart"
                    ></apexchart>
                  </div>
                </client-only>
              </div>
            </span>
        </v-card>
      </v-col> -->

      <v-col cols="12" md="6">
        <LineDiagram />
    </v-col>

    <!-- <v-col cols="12" md="2">
      <v-card class="px-5 py-3">
        <div class="d-flex align-center">
          <span>
            <h4>Attendance Rate</h4>
            <div class="d-flex align-center justify-center">
                <vue-speedometer
                  :maxSegmentLabels="12"
                  :segments="2"
                  value="5"
                  :segmentColors='["firebrick","gray"]'
                  needleColor="black"
                  width="200"
                  height="20"
                  :minValue="0" 
                  :maxValue="6"
                  :needleTransitionDuration="4000"
                  needleTransition="easeElastic"
                />
            </div>
          </span>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
        <DonutChart />
    </v-col> -->
    <v-col cols="12" md="6">
        <EmployeeBar />
    </v-col>
    <!-- <v-col cols="12" lg="2">
      <v-card class="px-7 py-16">
        <div class="d-flex align-center">
          <span>
            <h4>Permited Hours</h4>
            <v-row class="d-flex align-center mt-5">
              <div class="mr-3 ml-3">
                <span  class="mr-3">22.50 hrs</span> | 
                <div>Available</div>
              </div> 
              <div>
                <span> 12.37 hrs</span>
                <div>Used</div>
              </div>
            </v-row>
          </span>
        </div>
      </v-card>

      <v-card justify="center" class="px-6 py-16 align-center mt-5">
        <div class="d-flex align-center">
          <span>
            <h4>Leave Taken</h4>
            <v-row justify="center" class="d-flex align-center mt-5">
              <div class="mr-3 ml-3">
                <span class="mr-3">31</span> | 
                <div>Sick </div>
              </div> 
              <div>
                <span> 18</span>
                <div>Casual</div>
              </div>
            </v-row>
          </span>
        </div>
      </v-card>
    </v-col> -->
    <v-col cols="12" md="6">
       <LeaveTypeDistrStat />
    </v-col>
    <v-col cols="12" md="6">
      <v-card height="372" class="px-5 py-3">
        <div class="d-flex align-center">
          <span>
            <h4>Attendance Statistique</h4>
            <!-- <span>Last Months</span> -->
            <AttendanceStat />
          </span>
        </div>
      </v-card>
    </v-col>
    <!-- <v-col cols="12" lg="2">
      <v-card class="px-7 py-12">
        <div class="d-flex align-center">
          <span>
            <h4>Arrival Pattern</h4>
            <v-row class="d-flex align-center mt-5">
              <div class="mr-3 ml-3">
                <span  class="mr-3">18</span> | 
                <div>Early</div>
              </div> 
              <div>
                <span>05</span>
                <div>Late</div>
              </div>
            </v-row>
          </span>
        </div>
      </v-card>

      <v-card justify="center" class="px-6 py-11 align-center mt-5">
        <div class="d-flex align-center">
          <span>
            <h4>Leave Taken</h4>
            <v-row justify="center" class="d-flex align-center mt-5">
              <div class="mr-3 ml-3">
                <span class="mr-3">31</span> | 
                <div>Sick </div>
              </div> 
              <div>
                <span> 18</span>
                <div>Casual</div>
              </div>
            </v-row>
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
          <v-data-table density="compact" :headers="(headers as any)" :items="employeeStatuses">
            <template v-slot:item.status="{ value }">
              <v-chip :color="value === 'On Leave' ? 'red' : 'primary'">{{ value }}</v-chip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>