<template>
  <v-row>
    <div
      style="
        position: absolute;
        top: 265px;
        z-index: 10;
        height: 50px;
        left: 265px;
      "
      cols="12"
    >
      <v-autocomplete
        clearable
        flat
        class="mr-5"
        :label="filterPayPeriod.title"
        :items="filterPayPeriod.items"
        style="width: 300px"
        variant="solo"
        density="compact"
        hide-details
        item-value="value"
        item-title="title"
        v-model="selectedValue"
      ></v-autocomplete>
    </div>
    <v-col cols="12">
      <SharedUiCustomTable
        class="customTable"
        items-per-page="50"
        :sticky-top="true"
        :sticky-top-offset="95"
        :show-footer-in-head="false"
        show-select
        :headers="tableHeaders"
        :items="filteredPayPeriodTimeCards"
        :loading="loading"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon class="ml-2" color="primary" @click="handleIconClick(item)"
            >mdi-eye</v-icon
          >
        </template>

        <template v-slot:item.employeeName="{ item }">
          <SharedTableTechnicianItem
            v-if="item.last_name"
            :userId="item.user_id"
          />
          <!-- <span v-else>N/A</span> -->
          <span v-else>{{ item.first_name }} {{ item.last_name }}</span>
        </template>

        <template v-slot:item.position="{ item }">
          <span> {{ getEmployeePosition(item.user_id as number) }} </span>
        </template>

        <template v-slot:item.hoursWorked="{ item }">
          <span>{{ item.total_hours }}</span>
        </template>

        <template v-slot:item.overtimeHours="{ item }">
          <span>{{
            item.total_hours - 40 > 0 ? item.total_hours - 40 : 0
          }}</span>
        </template>

        <template v-slot:item.totalHours="{ item }">
          <span>{{ item.total_hours }}</span>
        </template>

        <template v-slot:item.salary="{ item }">
          <span>{{ item.employment_type ? "Yes" : "No" }}</span>
        </template>
      </SharedUiCustomTable>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  defineExpose,
  watch,
  onMounted,
  defineProps,
} from "vue";
import { storeToRefs } from "pinia";
import { useAttendanceStore } from "@/stores/attendance/attendance";
import { useRouter } from "vue-router";
import moment from "moment";
import type { EmployeeInfo } from "~/types/store/employee";
import type { PayPeriodAttendanceEntity } from "~/types/attendance/attendanceTypes";

const props = defineProps({
  payPeriods: {
    type: Object as PropType<PayPeriodAttendanceEntity>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const attendanceStore = useAttendanceStore();
const { payPeriodList } = storeToRefs(attendanceStore);
const roleStore = useRoleStore();
const { roleList } = storeToRefs(roleStore);
const router = useRouter();
const selectedValue = ref<number | null>(null);

const handleIconClick = (item: any) => {
  if (selectedValue.value) {
    localStorage.setItem("userId", item.user_id);
    localStorage.setItem("payPeriodId", selectedValue.value.toString());
    attendanceStore.fetchEmployeeWorkHours(
      item.user_id,
      selectedValue.value as number
    );
  } else {
    attendanceStore.fetchEmployeeWorkHours(item.user_id);
    localStorage.setItem("userId", item.user_id);
  }
  attendanceStore.setSelectedEmployeeAttendance(item);
  router.push("/attendance/employee_time_card");
};

watch(
  () => selectedValue.value,
  async (newVal: any) => {
    await attendanceStore.fetchPayPeriodAttendanceList(newVal);
  }
);

const filteredPayPeriodTimeCards = computed(() => {
  if (selectedValue.value != null) {
    return props.payPeriods.employees as EmployeeInfo[];
  } else {
    return props.payPeriods.employees as EmployeeInfo[];
  }
});

const filterPayPeriod = computed(() => {
  const payperiods = payPeriodList.value.map((payperiod) => {
    return {
      value: payperiod.id,
      title: `${moment(payperiod.start_date).format("MMM D YYYY")} - ${moment(
        payperiod.end_date
      ).format("MMM D YYYY")}`,
    };
  });
  return {
    title: props.payPeriods.pay_period.start_date
      ? selectedValue.value
        ? " "
        : `${moment(props.payPeriods.pay_period.start_date).format(
            "MMM D YYYY"
          )} - ${moment(props.payPeriods.pay_period.end_date).format(
            "MMM D YYYY"
          )}`
      : "",
    key: "pay_period",
    items: [...payperiods],
    width: "300px",
  };
});

const getEmployeePosition = (employee_id: number) => {
  let employee = props.payPeriods.employees.find(
    (payperiod: any) => payperiod.id == employee_id
  );
  return employee?.role_id
    ? roleList.value.find((role: any) => role.id == employee?.role_id)?.name
    : "No role";
};
const tableHeaders = [
  { title: "Employee Name", key: "employeeName" },
  { title: "Position/Role", key: "position" },
  { title: "Hours Worked", key: "hoursWorked" },
  { title: "Overtime Hours", key: "overtimeHours" },
  { title: "Total Hours", key: "totalHours" },
  { title: "Salary Employee", key: "salary" },
  { title: "Actions", key: "actions", sortable: false },
];
</script>

<style scoped>
.custom-toolbar {
  top: 50px; /* Adjust this value to move the toolbar down */
  left: 0;
  right: 0;
  z-index: 1000; /* Adjust the z-index if necessary */
}
</style>
