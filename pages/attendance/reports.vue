<script lang="ts" setup>
import { ref, computed } from 'vue';

const employeeStore = useEmployeeStore()
const attendanceStore = useAttendanceStore();

const { employeeList } = storeToRefs(employeeStore)

const editedAttendanceRecord = ref({});
const attendanceRecordDialog = ref(false)
const updatingAttendanceRecord = ref(false)

const updateAttendanceRecord = (value: any) => {
    attendanceRecordDialog.value = value
    editedAttendanceRecord.value = {}
    updatingAttendanceRecord.value = false
}

const editTimeoffRequest = (value: any) => {
    editedAttendanceRecord.value = value
    updatingAttendanceRecord.value = true
    attendanceRecordDialog.value = true
}

const employees = computed(() =>{
    return employeeList.value.map((item: any) => { return {...item, full_name: `${item.first_name} ${item.last_name}`}})
})

const reportComponentRef = ref(null);

const triggerGenerateReport = () => {
  if (reportComponentRef.value) {
    reportComponentRef.value.generateReport();
  }
};
</script>
<template>
    <div class="d-flex justify-space-between">
        <span class="text-primary text-h5">TimeOff Reports</span>
        <div>
            <v-btn color="primary" density="comfortable" flat class="mr-2 text-none" @click="triggerGenerateReport">Export TimeOffReport</v-btn>
            <AttendanceReportsGenerateReport ref="reportComponentRef" />
            <AttendanceReportsAddTimeoffRequest :show="attendanceRecordDialog" @update:show="updateAttendanceRecord"
                :updating="updatingAttendanceRecord" :item="editedAttendanceRecord" :employeeList="employees"/>
        </div>

    </div>
    <div>
        <AttendanceReportsTimeoffRequests @editTimeoffRequest="editTimeoffRequest" />
    </div>
</template>