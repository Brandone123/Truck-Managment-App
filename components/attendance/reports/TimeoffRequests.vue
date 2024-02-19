<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'

const emit = defineEmits(['editTimeoffRequest'])

const leaveTypeStore = useLeaveTypeStore()
const { leaveTypeList, loading : loadingTimeoffOptions } = storeToRefs(leaveTypeStore)

const timeoffRequestStore = useTimeoffRequestStore()
const { timeoffRequestList, loading : loadingTimeoffRequests } = storeToRefs(timeoffRequestStore)

const employeeStore = useEmployeeStore()
const { employeeList, loading : loadingEmployeeList } = storeToRefs(employeeStore)

const departmentStore = useDepartmentStore()
const { departmentList,loading : loadingDepartments } = storeToRefs(departmentStore)

onMounted(() => {
    departmentStore.fetchDepartmentList()
    leaveTypeStore.fetchLeaveTypeList()
    employeeStore.fetchEmployeeList()
    timeoffRequestStore.loadTimeoffRequests()
})


const timeoffRequestHeaders = ref([
    { title: 'Employee', key: 'employee_id' },
    { title: 'Purpose', key: 'attendance_leave_type_id' },
    { title: 'Duration', key: 'duration' },
    { title: 'Description', key: 'description' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', align: 'center', width: '100px', sortable: false },
])


const loading = computed(()=>{
    return loadingTimeoffOptions.value || loadingTimeoffRequests.value || loadingEmployeeList.value || loadingDepartments.value
})


const statusColor = (status: string) => {
    switch (status) {
        case 'accepted':
            return 'text-success'
        case 'rejected':
            return 'text-error'
        case 'pending':
            return 'text-disabled'
    }
}

const findEmployee = (employee_id: number) => {
    return employeeList.value.find((employee: any) => employee.id == employee_id)
}

const findTimeoffOption = (attendance_leave_type_id: number) => {
    return leaveTypeList.value.find((timeoff_option: any) => timeoff_option.id == attendance_leave_type_id)
}

const getDifferenceInDays = (dateString1: string, dateString2: string): number => {

    console.log(dateString1)
    console.log(dateString2)
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    // Set the time of both dates to midnight to compare only the dates
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds
    const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());

    // Calculate the difference in days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    console.log(millisecondsPerDay.toString());

    const diffInDays = Math.floor(diffInMilliseconds / millisecondsPerDay);

    return diffInDays;
};

//edit timeoff request
const editTimeoffRequest = (timeoffRequest: any) => {
    emit('editTimeoffRequest', timeoffRequest);
}

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const getEmployeeName = (employee_id : number) =>{
    let employee = findEmployee(employee_id) 
    return employee ? `${employee.first_name} ${employee.last_name}` : ''
}
const getEmployeeDepartment = (employee_id : number) => {
    let employee = findEmployee(employee_id)
    return employee?.department_id ? departmentList.value.find((department: any) => department.id == employee?.department_id)?.name : ''
}

</script>

<template>
    <SharedUiCustomTable return-object :headers="timeoffRequestHeaders" :items="timeoffRequestList" :loading="loading">
        <template v-slot:item.employee_id="{ item }">
            <span class="font-weight-bold no-wrap">{{ getEmployeeName(item.employee_id)}}</span><br>
            <span class="text-caption text-primary">{{ getEmployeeDepartment(item.employee_id) }}</span>
        </template>

        <template v-slot:item.attendance_leave_type_id="{ item }">
            <span class="no-wrap">{{ findTimeoffOption(item.attendance_leave_type_id)?.name }}</span><br>
        </template>

        <template v-slot:item.duration="{ item }">
            <span class="no-wrap font-weight-bold">{{ item.start_date }} - {{ item.end_date }}</span><br>
            <span>({{ getDifferenceInDays(item.start_date, item.end_date) }} Days)</span><br>
        </template>

        <template v-slot:item.status="{ item }">
            <span class="text-capitalize font-weight-bold" :class="[statusColor(item.status)]">{{ item.status }}</span>
        </template>

        <!-- Slot to capture bulk actions -->
        <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
            <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                <v-icon>mdi-printer</v-icon> Print
            </v-btn>
        </template>

        <template v-slot:item.actions="{ item }">
            <v-btn density="compact" flat icon="mdi-pencil" @click="editTimeoffRequest(item)"></v-btn>
            <v-btn density="compact" flat icon="mdi-delete"></v-btn>
        </template>
    </SharedUiCustomTable>
</template>

<style scoped >
</style>