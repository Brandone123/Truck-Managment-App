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
    {
        id: 3,
        name: 'Sick Leave',
        color: '#12345',
        paid: true,
    },
    {
        id: 4,
        name: 'Vacation',
        color: '#12345',
        paid: true,
    },
])

const employees = ref([
    {
        id: 1,
        first_name: 'John',
        last_name: 'Doe'
    },
    {
        id: 2,
        first_name: 'Mary',
        last_name: 'Jane',
    },
    {
        id: 3,
        first_name: 'Smith',
        last_name: 'James',
    },
])

const employee_leave_balance_data = ref([
    {
        employee_id: 1,
        leave_balance: [
            { attendance_leave_type_id: 1, name: 'Maternity Leave', taken: 3, balance: 1 },
            { attendance_leave_type_id: 2, name: 'Vacation', taken: 5, balance: 5 },
            { attendance_leave_type_id: 3, name: 'Bereavement Leave', taken: 2, balance: 5 },
            { attendance_leave_type_id: 4, name: 'Time off', taken: 1, balance: 5 },
        ]
    },
    {
        employee_id: 2,
        leave_balance: [
            { attendance_leave_type_id: 1, name: 'Maternity Leave', taken: 3, balance: 1 },
            { attendance_leave_type_id: 2, name: 'Vacation', taken: 5, balance: 5 },
            { attendance_leave_type_id: 3, name: 'Bereavement Leave', taken: 2, balance: 5 },
            { attendance_leave_type_id: 4, name: 'Time off', taken: 1, balance: 5 },
        ]
    },
    {
        employee_id: 3,
        leave_balance: [
            { attendance_leave_type_id: 1, name: 'Maternity Leave', taken: 3, balance: 1 },
            { attendance_leave_type_id: 2, name: 'Vacation', taken: 5, balance: 5 },
            { attendance_leave_type_id: 3, name: 'Bereavement Leave', taken: 2, balance: 5 },
            { attendance_leave_type_id: 4, name: 'Time off', taken: 1, balance: 5 },
        ]
    },
])

const selected_employee = ref(null)

const getLeaveBalance = (employee_id: number) => {
    let response = employee_leave_balance_data.value.find((item: any) => item.employee_id == employee_id)?.leave_balance
    if (response) {
        return response
    } else {
        return []
    }
}

const employeeLeaveBalance = computed(() => {
    if (selected_employee.value != null) {
        return getLeaveBalance(selected_employee.value)
    }
    return []
})

const employeeList = computed(() => {
    return employees.value.map((item: any) => {
        return { ...item, full_name: `${item.first_name} ${item.last_name}` }
    })
})

const employeeLeaveBalanceHeaders = computed(() => {
    return [
        { title: 'Leave Type', key: 'attendance_leave_type_id', class: 'no-wrap' },
        { title: 'Current Balance', key: 'balance', class: 'no-wrap' },
    ]
})

function getLeaveType(attendance_leave_type_id: number) {
    return attendance_leave_types.value.find((item: any) => item.id == attendance_leave_type_id)
}

function print(item: any) {
    console.log(item)
}
</script>

<template>
    <SharedUiCustomTable density="compact" :headers="employeeLeaveBalanceHeaders" :items="employeeLeaveBalance"
        :showFooterInHead="false">
        <template v-slot:item.attendance_leave_type_id="{ item }">
            {{ getLeaveType(item.attendance_leave_type_id)?.name }}
        </template>
        <template v-slot:filters>
            <v-autocomplete style="min-width:300px;" density="compact" variant="solo" hide-details label="Employee"
                :items="employeeList" item-value="id" item-title="full_name" v-model="selected_employee"></v-autocomplete>
        </template>
    </SharedUiCustomTable>
</template>