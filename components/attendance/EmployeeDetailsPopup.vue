<script lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs } from 'vue'
import type { EmployeeInfo } from '~/types/store/employee'
import type { TimeoffRequest } from '~/types/attendance/timeoff_request';
import type { TimeoffGroup } from '~/components/attendance/TimeoffRequestCalendar.vue';

export default {
  props: {
    employee: {
      type: Object,
      required: true,
    },
    timeoffInfo: {
      type: Array<number | number[] | { id: number, values: number[] }>,
      required: true,
    },
    daysInMonthCount: {
      type: Number,
      required: true,
    }
  },

  setup(props) {

    const employeeStore = useEmployeeStore()
    const { employeeList } = storeToRefs(employeeStore)
    const { employee } = toRefs(props)

    const timeoffRequestStore = useTimeoffRequestStore()
    const { timeoffRequestList } = storeToRefs(timeoffRequestStore)

    const leaveTypeStore = useLeaveTypeStore()
    const { leaveTypeList } = storeToRefs(leaveTypeStore)

    const availableDays = computed(() => {
      return props.timeoffInfo.filter((item) => typeof item === 'number').length
    })

    const dialog = ref(false)

    const leaveApprover = computed(() => {
      return employeeList.value.find((item: EmployeeInfo) => item.id === employee.value.approver_id)
    })

    const timeOffRequest = computed(() => {
       let list = timeoffRequestList.value.filter((item: TimeoffRequest) => item.employee_id == employee.value.id).length
       let approved = timeoffRequestList.value.filter((item: TimeoffRequest) => item.status == "accepted" && item.employee_id == employee.value.id).length
       let rejected = timeoffRequestList.value.filter((item: TimeoffRequest) => item.status == "rejected" && item.employee_id == employee.value.id).length
       let pending = timeoffRequestList.value.filter((item: TimeoffRequest) => item.status == "pending" && item.employee_id == employee.value.id).length
       console.log(list)

       const Chart = [list,approved,rejected,pending];
       return Chart
    })

    function getTimeofOption(option_id: number) {
        return leaveTypeList.value.find((item: any) => item.id == option_id)
    }

    const title = computed(() => {
      return 'Employee Summary'
    })

    const totalRequest = timeoffRequestList.value.filter((item: TimeoffRequest) => item.employee_id == employee.value.id).length

    const employeeTimeOff = timeoffRequestList.value.filter((item: TimeoffRequest) => item.employee_id === employee.value.id);
    const attendanceLeaveTypeId = employeeTimeOff[0].attendance_leave_type_id;
    const leaveType = leaveTypeList.value.find(item => item.id === attendanceLeaveTypeId);

    const pendingData = Array(12).fill(0);
    const rejectedData = Array(12).fill(0);
    const acceptedData = Array(12).fill(0);

    
    // Parcourir les requêtes des employés
    timeoffRequestList.value.forEach(request => {
      if (request.end_date) {
      // Extraire le mois de la date de création de la requête
      const createdAt = new Date(request.end_date.replace(/-/g, '/'));
      const month = createdAt.getMonth();

      // Incrémenter le nombre de requêtes en fonction du statut
      switch (request.status) {
        case "pending":
          pendingData[month]++;
          break;
        case "rejected":
          rejectedData[month]++;
          break;
        case "accepted":
          acceptedData[month]++;
          break;
      }
    }
    });


    const customColors = ["grey","#ff0000","white"];
    const chartOptions = computed(() => {
       const colors = [
          customColors[0], // color for "Pending"
          customColors[1], // color for "Rejected"
          leaveType ? leaveType.color : customColors[2], // dynamic color for "Accepted"
      ];

       return {
        series: [{
            name: "Pending",
            data: pendingData,
          },
          {
            name: "Rejected",
            data: rejectedData,
          },
          {
            name: "Accepted",
            data: acceptedData,
          }],
        chart: {
          type: "bar",
          fontFamily: `inherit`,
          foreColor: "#a1aab2",
          height: 350,
          toolbar: {
            show: false,
          },
        },

        colors: colors,
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        },
        yaxis: {
          title: {
            text: "Number of Requests",
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " requests";
            },
          },
        },
      };
    });

   

    return {
      employee,
      availableDays,
      leaveApprover,
      dialog,
      title,
      chartOptions,
      timeOffRequest,
      totalRequest
    }
  }
}
</script>

<template>
    <v-dialog v-model="dialog" scrollable width="700px">
      <template v-slot:activator="{ props }">
        <v-btn variant="text" class="text-none px-1" v-bind="props">
          <v-badge color="primary" :content="availableDays" inline>
            <span class="mr-2">
              {{ employee.first_name }} {{ employee.last_name }}
            </span>
          </v-badge>
        </v-btn>
      </template>
  
      <v-card class="grey-background">
        <v-toolbar color="primary" :title="title" density="compact">
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
                <v-icon>mdi-window-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card class="rounded-lg">
        <div>
            <v-card-text style="font-size: 17px;">
              <div style="display: flex;" class="mb-5">
                <div style="flex: 1">
                  <div class="mb-4"> <span class="font-bold">Name: </span> {{ employee.first_name }} {{ employee.last_name }}</div>
                  <div class="mb-4"> <span class="font-bold">Department:</span> {{ employee.department.name }}</div>
                  <span class="font-bold">Total Request:</span> {{ totalRequest }}
                </div>
                <div style="flex: 1" class="mr-2">
                  <div class="mb-4"><span class="font-bold">Available Days: </span> {{ availableDays }} days out of {{ daysInMonthCount }}</div>
                  <span class="font-bold">Approver: </span>{{ leaveApprover ? leaveApprover.full_name : 'No Approver Assigned' }}<br>
                </div>
              </div>
            </v-card-text>
          <div class="mr-2">
              <v-card class="rounded-lg">
              <client-only>
                <div id="chart">
                  <apexchart type="bar" height="350" :options="chartOptions" :series="chartOptions.series"></apexchart>
                </div>
              </client-only>
              </v-card>
          </div>
        </div>
        </v-card>
      </v-card>
    </v-dialog>
  </template>