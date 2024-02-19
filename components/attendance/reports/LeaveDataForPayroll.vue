<script setup lang="ts">
import { ref, computed } from 'vue'

const leave_data_for_payroll = ref([
    {
        employee: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            full_name: 'John Doe'
        },
        employee_id: 1,
        total_days: 31,
        weekend: 10,
        holidays: 0,
        payable_days: 21,
        loss_of_pay: 3,
        encashed_days: 10,
        paid_days: 18
    },
    {
        employee_id: 2,
        employee: {
            id: 2,
            first_name: 'Mary',
            last_name: 'Jane',
            full_name: 'Mary Jane'
        },
        total_days: 31,
        weekend: 10,
        holidays: 0,
        payable_days: 21,
        loss_of_pay: 0,
        encashed_days: 6,
        paid_days: 21
    },
    {
        employee_id: 3,
        employee: {
            id: 3,
            first_name: 'Smith',
            last_name: 'James',
            full_name: 'Smith James'
        },
        total_days: 31,
        weekend: 5,
        holidays: 0,
        payable_days: 26,
        loss_of_pay: 0,
        encashed_days: 3,
        paid_days: 26
    },
])

const leaveDataForPayrollHeaders = computed(() => {
    return [
        { title: 'Employee', key: 'employee.full_name', class: 'no-wrap' },
        { title: 'Total days', key: 'total_days', class: 'no-wrap' },
        { title: 'Weekend', key: 'weekend', class: 'no-wrap' },
        { title: 'Holidays', key: 'holidays', class: 'no-wrap' },
        { title: 'Payable days', key: 'payable_days', class: 'no-wrap' },
        { title: 'Loss of pay', key: 'loss_of_pay', class: 'no-wrap' },
        { title: 'Encashed days', key: 'encashed_days', class: 'no-wrap' },
        { title: 'Paid days', key: 'paid_days', class: 'no-wrap' },
    ]
})


</script>

<template>
    <SharedUiCustomTable density="compact" :headers="leaveDataForPayrollHeaders" :items="leave_data_for_payroll"
        :showFooterInHead="false">
    </SharedUiCustomTable>
</template>