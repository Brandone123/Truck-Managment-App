<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { storeToRefs } from "pinia";
import moment from "moment";

const emit = defineEmits(["editTimeoffRequest"]);

const leaveTypeStore = useLeaveTypeStore();
const { leaveTypeList, loading: loadingTimeoffOptions } =
  storeToRefs(leaveTypeStore);

const timeoffRequestStore = useTimeoffRequestStore();
const { timeoffRequestList, loading: loadingTimeoffRequests } =
  storeToRefs(timeoffRequestStore);

const employeeStore = useEmployeeStore();
const { employeeList, loading: loadingEmployeeList } =
  storeToRefs(employeeStore);

const departmentStore = useDepartmentStore();
const { departmentList, loading: loadingDepartments } =
  storeToRefs(departmentStore);

onMounted(() => {
  departmentStore.fetchDepartmentList();
  leaveTypeStore.fetchLeaveTypeList();
  employeeStore.fetchEmployeeList();
  timeoffRequestStore.loadTimeoffRequests();
});

const timeoffRequestHeaders = ref([
  { title: "Employee", key: "user_id" },
  { title: "Purpose", key: "attendance_leave_type_id" },
  { title: "Duration", key: "duration" },
  { title: "Description", key: "description" },
  { title: "Status", key: "status" },
  {
    title: "Actions",
    key: "actions",
    align: "center",
    width: "100px",
    sortable: false,
  },
]);

const loading = computed(() => {
  return (
    loadingTimeoffOptions.value ||
    loadingTimeoffRequests.value ||
    loadingEmployeeList.value ||
    loadingDepartments.value
  );
});

const statusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "text-success";
    case "rejected":
      return "text-error";
    case "pending":
      return "text-disabled";
  }
};

const findEmployee = (user_id: number) => {
    return employeeList.value.find((employee: any) => employee.user_id == user_id)
}

const findTimeoffOption = (attendance_leave_type_id: number) => {
  return leaveTypeList.value.find(
    (timeoff_option: any) => timeoff_option.id == attendance_leave_type_id
  );
};

const getDifferenceInDays = (
  dateString1: string,
  dateString2: string
): number => {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  // Set the time of both dates to midnight to compare only the dates
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);

  // Calculate the difference in milliseconds
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());

  // Calculate the difference in days
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const diffInDays = Math.floor(diffInMilliseconds / millisecondsPerDay);

  return diffInDays;
};

//edit timeoff request
const editTimeoffRequest = (timeoffRequest: any) => {
  emit("editTimeoffRequest", timeoffRequest);
};

const print = (selectedItems: any) => {
  console.log(selectedItems);
};

const getEmployeeName = (user_id : number) =>{
    let employee = findEmployee(user_id) 
    
    return employee ? `${employee.first_name} ${employee.last_name}` : ''
}
const getEmployeeDepartment = (user_id : number) => {
    let employee = findEmployee(user_id)
    return employee?.department_id ? departmentList.value.find((department: any) => department.id == employee?.department_id)?.name : ''
}
const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
};
</script>

<template>
  <SharedUiCustomTable
    return-object
    show-select
    :headers="timeoffRequestHeaders"
    :items="timeoffRequestList"
    :loading="loading"
  >
    <template v-slot:item.user_id="{ item }">
      <SharedTableTechnicianItem v-if="item.id" :userId="item.user_id" />
      <span v-else>N/A</span>
      <span class="text-caption text-primary">{{
        getEmployeeDepartment(item.user_id)
      }}</span>
    </template>

    <template v-slot:item.attendance_leave_type_id="{ item }">
      <span class="no-wrap">{{
        findTimeoffOption(item.attendance_leave_type_id)?.name
      }}</span
      ><br />
    </template>

    <template v-slot:item.duration="{ item }">
      <span
        style="cursor: pointer; border-bottom: 1px dotted"
        class="no-wrap font-weight-bold"
        >{{ item.start_date }} - {{ item.end_date }}</span
      ><br />
      <span
        >({{ getDifferenceInDays(item.start_date, item.end_date) }} Days)
        <v-tooltip activator="parent" location="top">
          {{ getRelativeDateTime(item.start_date) }}
        </v-tooltip> </span
      ><br />
    </template>

    <template v-slot:item.status="{ item }">
      <span
        class="text-capitalize font-weight-bold"
        :class="[statusColor(item.status)]"
        >{{ item.status }}</span
      >
    </template>

    <!-- Slot to capture bulk actions -->
    <template v-slot:bulkActions="{ selectedItems }">
      <v-btn
        color="primary"
        class="text-none mr-2"
        @click="print(selectedItems)"
      >
        <v-icon>mdi-printer</v-icon> Print
      </v-btn>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon class="ml-2" color="primary" @click="editTimeoffRequest(item)"
        >mdi-pencil</v-icon
      >
      <v-icon class="ml-2" color="red">mdi-delete</v-icon>
    </template>
  </SharedUiCustomTable>
</template>

<style scoped></style>
