<script lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs } from 'vue'
import type { TimeoffRequest } from '~/types/attendance/timeoff_request';

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
  const employeeStore = useEmployeeStore();
  const { employeeList } = storeToRefs(employeeStore);
  const { employee } = toRefs(props);

  const timeoffRequestStore = useTimeoffRequestStore();
  const { timeoffRequestList } = storeToRefs(timeoffRequestStore);

  const leaveTypeStore = useLeaveTypeStore();
  const { leaveTypeList } = storeToRefs(leaveTypeStore);

  const dialog = ref(false);

  const leaveApprover = computed(() => {
    return employeeList.value.find((item) => item.id === employee.value.approver_id);
  });

  const title = computed(() => {
    return 'Employee Summary';
  });

  const totalRequest =  computed(() => {
    return timeoffRequestList.value.filter((item: TimeoffRequest) => item.employee_id == employee.value.id).length
  })

  const availableDays = computed(() => {
    return props.timeoffInfo.filter((item) => typeof item === 'number').length
  })
  

  const chartOptions = computed(() => {
    const pendingData = Array(12).fill(0);
    const rejectedData = Array(12).fill(0);
    const acceptedData = Array(12).fill(0);
    const customColors = ["#8D918D", "#ff0000", "#ffffff"];

    const employeeTimeOff = timeoffRequestList.value.filter((item) => item.employee_id === employee.value.id);
    const leaveType = employeeTimeOff.find((item) => leaveTypeList.value.some((leaveType) => leaveType.id === item.attendance_leave_type_id));
    const leaveTypeColor = leaveTypeList.value.find((item) => item.id === leaveType?.attendance_leave_type_id)?.color;

     // Browse employee requests
    employeeTimeOff.forEach((request) => {
      if (request.end_date) {
        // Extract the month from the query creation date
        const createdAt = new Date(request.end_date.replace(/-/g, '/'));
        const month = createdAt.getMonth();

        // Increment the number of requests according to status
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

    const colors = [
    customColors[0], // color for "Pending"
    customColors[1], // color for "Rejected"
    leaveTypeColor ? leaveTypeColor : customColors[2], // dynamic color for "Accepted"
    ]

    return {
      series: [
        {
          name: 'Pending',
          data: pendingData,
        },
        {
          name: 'Rejected',
          data: rejectedData,
        },
        {
          name: 'Accepted',
          data: acceptedData,
        },
      ],
      chart: {
        type: 'bar',
        fontFamily: 'inherit',
        foreColor: '#a1aab2',
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
          endingShape: 'rounded',
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yaxis: {
        title: {
          text: 'Number of Requests',
        },
        min: 0,
        max: 5,
        tickAmount: 5,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ' requests';
          },
        },
      },
      title: {
        text: 'Year - 2024',
        align: 'right',
        style: {
          fontSize: '18px',
          color: '#333333',
        },
      },
    };
  });

  return {
    employee,
    dialog,
    title,
    chartOptions,
    totalRequest,
    availableDays,
    leaveApprover

  };
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