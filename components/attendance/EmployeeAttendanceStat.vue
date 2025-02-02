<template>
  <v-card>
    <v-card-title>Employee Attendance Statistics</v-card-title>
    <v-card-text>
      <div v-if="loading" class="text-center">
        <v-progress-circular
          style="height: 350px"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <div v-else>
        <client-only>
          <apexchart
          type="bar"
          height="360"
          :options="chartOptions"
          :series="chartOptions.series"
        />
        </client-only>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTimeoffRequestStore } from "@/stores/settings/attendance/timeoff_requests";
import { useEmployeeStore } from "@/stores/employee";
import { storeToRefs } from "pinia";

const currentDate = ref(new Date());

interface DayOfWeek {
  day: number;
  dayOfWeek: string;
  isToday: boolean;
}

const employeeStore = useEmployeeStore();
const { employeeList, loading: EmployeeLoading } = storeToRefs(employeeStore);

const timeoffRequestStore = useTimeoffRequestStore();
const { timeoffRequestList, loading: TimeOffLoading } = storeToRefs(timeoffRequestStore);

function getDaysInMonth(year: number, month: number): DayOfWeek[] {
  const daysInMonth: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today: Date = new Date();
  const numberOfDays: number = new Date(year, month + 1, 0).getDate();
  const days: DayOfWeek[] = [];

  for (let day = 1; day <= numberOfDays; day++) {
    const date: Date = new Date(year, month, day);
    const dayOfWeek: string = daysInMonth[date.getDay()];
    const isToday: boolean = date.toDateString() === today.toDateString();
    days.push({ day, dayOfWeek, isToday });
  }
  return days;
}

const employeeListSorted = computed(() => {
  return employeeList.value.slice(0, 5);
});

const loading = computed(() => {
  return EmployeeLoading.value || TimeOffLoading.value;
});

function sortNonOverlappingDateRanges(dateRanges: Array<any>) {
  dateRanges.sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime() ||
      new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
  );
  return dateRanges;
}

const chartOptions = computed(() => {
  const daysOfMonth = getDaysInMonth(currentDate.value.getFullYear(), currentDate.value.getMonth()).map((item) => item.day);
  const employeeDaysOffInMonth = sortNonOverlappingDateRanges(timeoffRequestList.value.filter((employee) => {
    return employeeList.value.some((item) => item.user_id === employee.user_id);
  })) || [];

  const employeeChartData = employeeListSorted.value.map((employee) => {
    const employeeDaysOff = employeeDaysOffInMonth.filter((item) => item.user_id === employee.user_id);

    const daysOff = employeeDaysOff.reduce((totalDaysOff, item) => {
      const startDate = new Date(item.start_date).getTime();
      const endDate = new Date(item.end_date).getTime();
      const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      return totalDaysOff + durationInDays;
    }, 0);

    const availableDays = daysOfMonth.length - daysOff;
    const presencePercentage = Math.round((availableDays / daysOfMonth.length) * 100);

    return {
      full_name: employee.full_name || "Unknown",
      presencePercentage: presencePercentage,
    };
  });

  return {
    colors: ["#FF6384", "#36A2EB", "#5873fd", "#D48974", "#764549"],
    series: [
      {
        data: employeeChartData.map((item) => item.presencePercentage),
        name: "Attendance Percentage",
      },
    ],
    chart: {
      type: "bar",
      height: 300,
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
        colors: ["#fff"],
      },
    },
    xaxis: {
      categories: employeeChartData.map((item) => item.full_name),
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max: 100,
      tickAmount: 6,
    },
    tooltip: {
      theme: "light",
    },
  };
});
</script>