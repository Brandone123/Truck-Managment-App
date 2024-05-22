<template>
  <v-card>
    <v-card-title>
      Employee Attendance Statistics
    </v-card-title>
    <v-card-text>
      <div v-if="loading" class="text-center"> 
          <v-progress-circular style="height: 310px;" indeterminate color="primary"></v-progress-circular>
        </div>
      <div v-else>
        <apexchart
          type="bar"
          height="360px"
          :options="chartOptions"
          :series="chartOptions.series"
        ></apexchart>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const currentDate = ref(new Date());


interface DayOfWeek {
    day: number;
    dayOfWeek: string;
    isToday: boolean;
}

const employeeStore = useEmployeeStore();
const { employeeList, loading: EmployeeLoading } = storeToRefs(employeeStore);

const timeoffRequestStore = useTimeoffRequestStore()
const { timeoffRequestList, loading: TimeOffLoading } = storeToRefs(timeoffRequestStore)

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

const employeeListSorted = computed(() => {
  return employeeList.value.slice(0, 5);
});

const loading = computed(()=>{
      return EmployeeLoading.value || TimeOffLoading.value
  })

// sort date ranges in ascending order
function sortNonOverlappingDateRanges(dateRanges: Array<any>) {
    dateRanges.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime() || new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
    return dateRanges;
}


const chartOptions = computed (() => {

  let daysOfMonth = getDaysInMonth(currentDate.value.getFullYear(),currentDate.value.getMonth()).map((item) => item.day);
  let employee_days_off_in_month = sortNonOverlappingDateRanges(timeoffRequestList.value.filter((employee) => {
      return employeeList.value.some((item) => item.id  === employee.employee_id) 
    })) || [];

    const employeeChartData = employeeListSorted.value.map((employee) => {
      const employeeDaysOff = employee_days_off_in_month.filter((item) => item.employee_id === employee.id);

      const daysOff = employeeDaysOff.reduce((totalDaysOff, item) => {
        const startDate = new Date(item.start_date).getTime();
        const endDate = new Date(item.end_date).getTime();
        const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        return totalDaysOff + durationInDays;
      }, 0);

      const availableDays = daysOfMonth.length - daysOff;
      const presencePercentage = Math.round((availableDays / daysOfMonth.length) * 100); 

      console.log(availableDays)
      console.log(presencePercentage)

      return {
        full_name: employee.full_name || '',
        presencePercentage: presencePercentage,
      };
    });

  return {
    colors: ["#FF6384", "#36A2EB", "#5873fd", "#D48974", "#764549"],
  series: [
    {
      data: employeeChartData.map((item) => item.presencePercentage),
      name: "Attendance Percentage"
    },
  ],
  chart: {
    type: 'bar',
    height: 400,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      colors: ['#fff'],
    },
  },
  xaxis: {
    categories: employeeChartData.map((item) => item.full_name),
    labels: {
      style: {
        cssClass: 'grey--text lighten-2--text fill-color',
      },
    },
  },
  yaxis: {
    show: true,
    min: 0,
    max: 100,
    tickAmount: 6,
    tickPositions: [0, 20, 40, 60, 80, 100],
  },
  tooltip: {
    theme: 'light',
  },
  }
  
});
</script>