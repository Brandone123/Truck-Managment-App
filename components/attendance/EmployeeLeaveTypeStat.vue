<template>
    <v-card>
      <v-card-title >Leave Type Distribution</v-card-title>
      <v-card-text>
        <div class="text-center"> 
            <div v-if="loading"> 
                <v-progress-circular style="height: 310px;" indeterminate color="primary"></v-progress-circular>
              </div>
            <div v-else>
              <apexchart
                type="donut"
                height="300px"
                :options="chartOptions.chartOptions"
                :series="chartData"
              >
            </apexchart>
            </div>
        </div>
      </v-card-text>
    </v-card>
  </template>
    
    <script setup lang="ts">
    import { ref, onMounted } from "vue";
    import { computed } from "vue";
    import { useTheme } from "vuetify";
    
    const leaveTypeStore = useLeaveTypeStore();
    const { leaveTypeList, loading: LeaveTypeLoading } = storeToRefs(leaveTypeStore);
    
    const timeoffRequestStore = useTimeoffRequestStore();
    const { timeoffRequestList, loading: TimeOffLoading } = storeToRefs(timeoffRequestStore);
  
    const loading = computed(()=>{
        return LeaveTypeLoading.value || TimeOffLoading.value
    })
  
    onMounted(() => {
      leaveTypeStore.fetchLeaveTypeList();
    })
    
    const Chart = ref<number[]>([]);
  
    const chartData = computed(() => {
  
      // Initialise an object to store the number of timeoffRequests for each leave_type
    const timeoffRequestCount: { [key: number]: number } = {};
  
    // Browse the list of timeoff requests
    timeoffRequestList.value.forEach((request) => {
      const attendanceLeaveTypeId = request.attendance_leave_type_id;
  
      // Search for the corresponding leave_type in the leaveTypeList
      const leaveType = leaveTypeList.value.find((type) => type.id === attendanceLeaveTypeId);
  
      if (leaveType && leaveType.id !== undefined && leaveType.id !== null) {
        //If the leave_type is found, increase the timeoffRequest counter for this leave_type
        if (timeoffRequestCount[leaveType.id]) {
          timeoffRequestCount[leaveType.id]++;
        } else {
          timeoffRequestCount[leaveType.id] = 1;
        }
      }
    });
  
    // Calculate the total number of holiday requests
    const totalRequests = Object.values(timeoffRequestCount).reduce((acc, count) => acc + count, 0);
  
    // Calculate the percentages for each type of holiday
    const percentages = Object.keys(timeoffRequestCount).map((key) => {
      const leaveTypeId = parseInt(key, 10);
      const count = timeoffRequestCount[leaveTypeId];
      const percentage = (count / totalRequests) * 100;
      return Number(percentage.toFixed(2)); // Convert string to number
    });
  
    Chart.value = percentages;
  
    return percentages;
  });
  
    const chartOptions = computed(() => {
      const theme = useTheme();
      const primary = theme.current.value.colors.primary;
    
      return {
        chartOptions: {
          colors: ["#3f51b5", "#f44336", "#ff9800", "#8bc34a", "#9e9e9e"],
          chart: {
            type: "donut",
            height: 300,
            foreColor: "#adb0bb",
            fontFamily: "inherit",
            toolbar: {
              show: false,
            },
          },
          labels: leaveTypeList.value.map((item) => item.name),
          legend: {
            show: true,
            position: "top",
          },
          tooltip: { theme: "light", fillSeriesColor: true },
        },
      };
    });
    
    </script>
    
    <style scoped>
    .legend {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      margin-right: 20px;
    }
    
    .color-box {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    </style>