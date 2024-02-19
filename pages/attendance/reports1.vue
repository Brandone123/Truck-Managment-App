<script setup lang="ts">
import { ref, computed } from 'vue'

const report_types = ref([
    { id: 1, text: 'Daily Leave Status' },
    // { id: 2, text: 'Resource Availability' },
    { id: 3, text: 'Employee Leave Balance' },
    // { id: 4, text: 'Leave booked and balance' },
    // { id: 5, text: 'leave type wise summary' },
    // { id: 6, text: 'Bradford Score' },
    // { id: 7, text: 'Leave encashment details' },
    // { id: 8, text: 'Loss of pay details (LOP)' },
    { id: 9, text: 'Leave data for payroll' }
])

const selected_report_type = ref(9)


</script>

<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">TimeOff Reports</span>
            <div>

            </div>
        </div>
        <div class="d-flex justify-space-between mt-2">
            <v-select style="max-width: 300px;" density="compact" variant="solo" label="report type" item-title="text"
                item-value="id" :items="report_types" v-model="selected_report_type" hide-details flat></v-select>
        </div>
        <v-window v-model="selected_report_type">
            <!-- daily leave status report -->
            <v-window-item :value="1">
                <AttendanceReportsDailyLeaveStatus />
            </v-window-item>

            <!-- resource availability report -->
            <v-window-item :value="2"></v-window-item>

            <!-- employee leave balance report -->
            <v-window-item :value="3">
                <AttendanceReportsEmployeeLeaveBalance />
            </v-window-item>

            <!-- leave booked and balance report -->
            <v-window-item :value="4"></v-window-item>

            <!-- leave type wise summary report -->
            <v-window-item :value="5"></v-window-item>

            <!--Bradford score report -->
            <v-window-item :value="6"></v-window-item>

            <!-- leave encashment details report -->
            <v-window-item :value="7"></v-window-item>

            <!-- loss of pay details report -->
            <v-window-item :value="8"></v-window-item>

            <!-- leave data for payroll report -->
            <v-window-item :value="9">
                <AttendanceReportsLeaveDataForPayroll />
            </v-window-item>
        </v-window>
    </div>
</template>