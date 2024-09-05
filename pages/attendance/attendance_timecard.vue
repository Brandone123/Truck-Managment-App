<template>
  <div class="mt-n4">
    <div
      class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
      style="position: sticky; top: 48px; z-index: 1"
    >
      <span class="text-primary text-h6">Attendance Time Card </span>
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
      <v-col cols="12" md="3">
        <v-card class="card-1 text-center">
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#CE0053">mdi-calendar-clock</v-icon>
            <span>Total Employees</span>
          </v-card-title>
          <v-card-text>
            <span class="font-weight-bold text-h6">{{
              attendanceSummary.totalEmployees
            }}</span>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-2 text-center">
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#1867C0">mdi-timer-sand</v-icon>
            <span>Total Hours Worked</span>
          </v-card-title>
          <v-card-text>
            <span class="font-weight-bold text-h6">{{
              attendanceSummary.totalHours
            }}</span>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-3 text-center">
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#424656">mdi-clock-outline</v-icon>
            <span>Overtime Hours</span>
          </v-card-title>
          <v-card-text>
            <span class="font-weight-bold text-h6">{{
              attendanceSummary.overtimeHours
            }}</span>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-4 text-center">
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#a4d0ee">mdi-account-clock</v-icon>
            <span>Average Hours/Employee</span>
          </v-card-title>
          <v-card-text>
            <span class="font-weight-bold text-h6">{{
              attendanceSummary.avgHoursPerEmployee
            }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <AttendanceReport
          ref="reportComponentRef"
          :attendances="payPeriodAttendanceList"
        />
        <TimeCardDialog
          :modelValue="timeCardDetailsDialog"
          @close="closeTimeCardDetailsDialog"
          :attendanceTimeCard="selectedTimeCard"
        />
        <TimeCardTable
          :payPeriods="payPeriodAttendanceList"
          :loading="loading"
          @view="viewTimeCardDetails"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import TimeCardTable from "@/components/attendance/timeCard/TimeCardTable.vue";
import { useAttendanceStore } from "@/stores/attendance/attendance";
import { storeToRefs } from "pinia";
import TimeCardDialog from "~/components/accounting/payroll/PayView/PayCalculation/TimeCards/TimeCardDialog.vue";
import AttendanceReport from "~/components/attendance/reports/AttendanceReport.vue";
import type { EmployeeInfo } from "~/types/store/employee";
import moment from "moment";
import { convertToCSV, downloadCSVFile } from "~/composables/exportCSV";
import { useRoute } from "vue-router";

const attendanceStore = useAttendanceStore();
const employeeStore = useEmployeeStore();
const roleStore = useRoleStore();
const { roleList } = storeToRefs(roleStore);
const {
  payPeriodAttendanceList,
  payPeriodList,
  attendanceSummary,
  selectedEmployeeAttendance,
} = storeToRefs(attendanceStore);

const timeCardDetailsDialog = ref(false);
const selectedTimeCard = ref<Partial<EmployeeInfo>>({});
const currentPayPeriod = ref();
const reportComponentRef = ref(null);

const loading = computed(() => {
    return  attendanceStore.loading || employeeStore.loading
})

const triggerGenerateReport = () => {
  if (reportComponentRef.value) {
    reportComponentRef.value.generateReport();
  }
};
onMounted(() => {
  attendanceStore.fetchPayPeriodList();
  attendanceStore.fetchPayPeriodAttendanceList();
  employeeStore.fetchEmployeeList();
});

watch(
  () => payPeriodAttendanceList.value.pay_period,
  (newVal: any) => {
    currentPayPeriod.value = `${moment(newVal.start_date).format(
      "MMM D YYYY"
    )} - ${moment(newVal.end_date).format("MMM D YYYY")}`;
  }
);
const closeTimeCardDetailsDialog = () => {
  timeCardDetailsDialog.value = false;
};
const viewTimeCardDetails = (timeCard: any) => {
  selectedTimeCard.value = timeCard;
  timeCardDetailsDialog.value = true;
  // Logic to view detailed time card
};

const uniqueKeys = [
  "employeeName",
  "position",
  "hoursWorked",
  "overtimeHours",
  "totalHours",
  "salary",
];
const titleHeader = [
  "Employee Name",
  "Role",
  "Hours Worked",
  "OverTime",
  " Total Hours",
  "Salary Employee",
];

const userAttendances = ref();

watch(
  () => payPeriodAttendanceList.value.employees,
  (newValue: any) => {
    userAttendances.value = newValue.flatMap((user:EmployeeInfo) => {
      return {
        employeeName: `${user.first_name} ${user.last_name}`,
        position: getEmployeePosition(user.user_id as number),
        hoursWorked: user.total_hours,
        overtimeHours: user?.total_hours - 40 > 0 ? user?.total_hours - 40 : 0,
        totalHours: user.total_hours,
        salary: user.employment_type ? "Yes" : "No",
      };
    });
  }
);

const route = useRoute();
function exportToCSV() {
  const headers = [titleHeader, uniqueKeys];
  const csvData = convertToCSV(userAttendances.value, headers, true);
  let timestamp = new Date().toISOString();
  downloadCSVFile(csvData, `attendance_time_card_${timestamp}` + ".csv");
}

const getEmployeePosition = (user_id: number) => {
  let employee = payPeriodAttendanceList.value.employees.find(
    (payperiod: any) => payperiod.id == user_id
  );
  return employee?.role_id
    ? roleList.value.find((role: any) => role.id == employee?.role_id)?.name
    : "No role";
};
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

.card-4 {
  border-left: 8px solid #a4d0ee;
}
</style>
