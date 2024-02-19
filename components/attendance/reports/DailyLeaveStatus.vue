<script setup lang="ts">
import { ref, computed } from 'vue'

const attendance_leave_types = ref([
    {
        id: 1,
        name: 'Casual Leave',
        color: '#12345',
        paid: false,
    },
    {
        id: 2,
        name: 'Maternity Leave',
        color: '#12345',
        paid: true,
    },
])

const daily_leave_status_data = ref([
    {
        employee: {
            id: 1,
            first_name: 'john',
            last_name: 'Doe',
        },
        employee_id: 1,
        attendance_leave_type_id: 1,
        reason: 'Wife\'s birthday',
        status: 'Pending'
    },
    {
        employee: {
            id: 2,
            first_name: 'Mary',
            last_name: 'Jane',
        },
        employee_id: 2,
        attendance_leave_type_id: 1,
        reason: 'Wife\'s birthday',
        status: 'Pending'
    },
    {
        employee: {
            id: 3,
            first_name: 'Smith',
            last_name: 'James',
        },
        employee_id: 3,
        attendance_leave_type_id: 2,
        reason: 'Vacation',
        status: 'Pending'
    },
])

const dailyLeaveStatusHeaders = computed(() => {
    return [
        { title: 'Employee', key: 'employee_id', class: 'no-wrap' },
        { title: 'Leave Type', key: 'attendance_leave_type_id', class: 'no-wrap' },
        { title: 'type', key: 'leave_type', class: 'no-wrap' },
        { title: 'Reason', key: 'reason', class: 'no-wrap' },
        { title: 'Approval Status', key: 'status', class: 'no-wrap' },
    ]
})

function getLeaveType(attendance_leave_type_id: number) {
    console.log(attendance_leave_type_id)
    return attendance_leave_types.value.find((item: any) => item.id == attendance_leave_type_id)
}

function print(item: any) {
    console.log(item)
}
</script>

<template>
    <SharedUiCustomTable density="compact" return-object show-select :headers="dailyLeaveStatusHeaders"
        :items="daily_leave_status_data">
        <template v-slot:item.type="{ item }">
            {{ getLeaveType(item.attendance_leave_type_id)?.paid ? 'Paid' : 'Unpaid' }}
        </template>
        <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
            <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                <v-icon>mdi-printer</v-icon> Print
            </v-btn>
        </template>
    </SharedUiCustomTable>
</template>