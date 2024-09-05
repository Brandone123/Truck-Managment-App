<template>
  <div style="font-family: Arial, Helvetica, sans-serif" class="mt-n4">
    <v-card
      class="rounded-0 mx-n4"
      style="position: sticky; top: 48px; z-index: 1; margin-top: -16px"
    >
      <v-divider></v-divider>
      <div class="d-flex justify-space-between mt-1 mb-4">
        <span>
          <span
            style="cursor: pointer"
            class="text-primary text-h6"
            @click="router.push('/attendance/attendance_timecard')"
          >
            <v-icon>mdi-chevron-left</v-icon> Attendance List
          </span>
          <span class="text-ht text-grey">/{{ payPeriod }}</span>
        </span>
        <div></div>
      </div>
    </v-card>
    <div
      class="d-flex justify-end mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
      style="position: sticky; top: 48px; z-index: 1"
    >
      <div>
        <v-menu location="start">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="primary" class="mr-3"
              >Export Time Cards</v-btn
            >
          </template>
          <v-list density="compact">
            <v-list-item @click="triggerGenerateReport">
              <template v-slot:append>
                <v-icon>mdi-export</v-icon>
              </template>
              <v-list-item-title> PDF </v-list-item-title>
            </v-list-item>
            <v-list-item @click="exportToCSV">
              <template v-slot:append>
                <v-icon>mdi-export</v-icon>
              </template>
              <v-list-item-title> CSV </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <v-row class="mt-5">
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#CE0053">mdi-account</v-icon>
            <span>Employee Name</span>
          </v-card-title>
          <v-card-text>
            <span class="font-weight-bold text-h6"
              >{{
                selectedEmployeeAttendance?.first_name
                  ? selectedEmployeeAttendance.first_name
                  : ""
              }}
              {{
                selectedEmployeeAttendance?.last_name
                  ? selectedEmployeeAttendance.last_name
                  : ""
              }}</span
            >
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#1867C0">mdi-briefcase</v-icon>
            <span>Position/Role</span>
          </v-card-title>
          <v-card-text>
            <span class="font-weight-bold text-h6">{{
              selectedEmployeeAttendance?.user_id
                ? getEmployeePosition(selectedEmployeeAttendance?.user_id)
                : "No Position"
            }}</span>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#424656">mdi-clock-outline</v-icon>
            <span>Total Hours Worked</span>
          </v-card-title>
          <v-card-text>
            <span class="font-weight-bold text-h6">{{
              totalHoursWork.toFixed(3)
            }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <UserAttendanceReport
          :selectedUser="selectedEmployeeAttendance"
          ref="reportComponentRef"
        />
        <DailyClockInOutTable
          :records="dailyRecords"
          :loading="loading"
          @view="viewRecordDetails"
          @edit="editRecord"
          @delete="deleteRecord"
        />
      </v-col>
    </v-row>
    <ClockInOutDetailDialog
      v-model:model-value="detailDialog"
      :record="selectedRecord"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import DailyClockInOutTable from "@/components/attendance/timeCard/DailyClockInOutTable.vue";
import ClockInOutDetailDialog from "@/components/attendance/timeCard/ClockInOutDetailDialog.vue";
import { useAttendanceStore } from "@/stores/attendance/attendance";
import { storeToRefs } from "pinia";
import UserAttendanceReport from "~/components/attendance/reports/UserAttendanceReport.vue";
import moment from "moment";
import { useRouter } from "vue-router";
import { convertToCSV, downloadCSVFile } from "~/composables/exportCSV";

const reportComponentRef = ref(null);
const dailyHoursWork = ref(0);
const totalHoursWork = ref(0);

const triggerGenerateReport = () => {
  if (reportComponentRef.value) {
    reportComponentRef.value.generateReport();
  }
};

const dailyRecord = ref();
const router = useRouter();
const attendanceStore = useAttendanceStore();
const {
  timeCards,
  loading,
  employeeWorkHours,
  payPeriodAttendanceList,
  employeeDailyRecord,
  attendanceHistory,
  selectedEmployeeAttendance,
  selectedDailyRecord,
} = storeToRefs(attendanceStore);

const dailyRecords = computed(() => {
  totalHoursWork.value = 0;
  const attendancesByDay: { [key: string]: any[] } = {};
  employeeWorkHours.value.work_hours.forEach((record: any) => {
    const date = moment(
      record.clock_out ? record.clock_out : record.clock_out_time
    ).format("YYYY-MM-DD");

    if (!attendancesByDay[date]) {
      attendancesByDay[date] = [];
    }
    attendancesByDay[date].push(record);
  });

  attendanceStore.setEmployeeDailyRecord(attendancesByDay);

  return Object.keys(attendancesByDay).map((date) => {
    dailyHoursWork.value = 0;
    const currentAttendances = attendancesByDay[date];
    const minCreatedAt = moment.min(
      currentAttendances.map((record) =>
        moment(record.clock_in ? record.clock_in : record.clock_in_time)
      )
    );
    const maxCreatedAt = moment.max(
      currentAttendances.map((record) =>
        moment(record.clock_out ? record.clock_out : record.clock_out_time)
      )
    );

    const clock_in_time = minCreatedAt.format("HH:mm:ss A").toString();
    const clock_out_time = maxCreatedAt.format("HH:mm:ss A").toString();
    const currentTotalHours = attendancesByDay[date].reduce(
      (total, workHours) => {
        return (
          total +
          parseFloat(
            workHours.total_hours
              ? workHours.total_hours
              : workHours.hours_worked
          )
        );
      },
      0
    );
    dailyHoursWork.value += currentTotalHours;
    totalHoursWork.value += dailyHoursWork.value;
    return {
      id: attendancesByDay[date][0].id,
      date: moment(date).format("DD/MM/YY"),
      clockInTime: clock_in_time,
      clockOutTime: clock_out_time,
      clockInLocation: "None",
      clockOutLocation: "None",
      regularHours: 8,
      overtimeHours: 0,
      totalHours: dailyHoursWork.value.toFixed(2),
      details: attendancesByDay[date],
    };
  });
});

const getEmployeePosition = (user_id: number) => {
  let employee = timeCards.value.find(
    (timecard: any) => timecard.id == user_id
  );
  return employee?.role_id
    ? roleList.value.find((role: any) => role.id == employee?.role_id)?.name
    : "No role";
};
const detailDialog = ref(false);
const selectedRecord = ref(null);
const currentPayPeriod = ref();

const payPeriod = ref(
  `${moment(payPeriodAttendanceList.value.pay_period.start_date).format(
    "MMM D YYYY"
  )} - ${moment(payPeriodAttendanceList.value.pay_period.end_date).format(
    "MMM D YYYY"
  )}`
);

watch(
  () => payPeriodAttendanceList.value.pay_period,
  (newVal: any) => {
    currentPayPeriod.value = `${moment(newVal.start_date).format(
      "MMM D YYYY"
    )} - ${moment(newVal.end_date).format("MMM D YYYY")}`;
  }
);

watch([selectedRecord], () => {
  attendanceStore.setSelectedDailyRecord(selectedRecord);
});
const viewRecordDetails = (record: any) => {
  selectedRecord.value = record.details;
  detailDialog.value = true;
  dailyRecord.value = record.details;
};

const editRecord = (record: any) => {
  // Logic to edit record
};

const deleteRecord = (recordId: number) => {
  // Logic to delete record
};

const uniqueKeys = ref();
const titleHeader = ref();
watch(
  () => employeeWorkHours.value.work_hours,
  () => {
    uniqueKeys.value = [
      ...new Set(employeeWorkHours.value.work_hours.flatMap(Object.keys)),
    ];
    titleHeader.value = uniqueKeys.value.map((key: any) => {
      return key
        .split("_")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(""); // Join the words back together without underscores
    });
  }
);

function exportToCSV() {
  const headers = [titleHeader.value, uniqueKeys.value];
  const csvData = convertToCSV(
    employeeWorkHours.value.work_hours,
    headers,
    true
  );
  let timestamp = new Date().toISOString();
  downloadCSVFile(
    csvData,
    `${selectedEmployeeAttendance.value?.first_name}_${selectedEmployeeAttendance.value?.last_name}_time_card_${timestamp}` +
      ".csv"
  );
}
</script>

<style scoped>
.card-1 {
  border-left: 8px solid #ce0053;
}

.card-2 {
  border-left: 8px solid #1867c0;
}

.card-3 {
  border-left: 8px solid #424656;
}
</style>
