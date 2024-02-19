<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { LeaveApproverInfo } from '@/types/attendance/leave_approver'
import type { EmployeeInfo } from '@/types/store/employee'

// const emit = defineEmits(['editItem'])

const leaveApproverStore = useLeaveApproverStore()
const { leaveApproverList } = storeToRefs(leaveApproverStore)

const employeeStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeStore)

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

onMounted(() => {
    employeeStore.fetchEmployeeList();
    departmentStore.fetchDepartmentList();
    leaveApproverStore.fetchLeaveApproverList();
});

const employeeLeaveApproverHeaders = ref([
    { title: 'Name', value: 'full_name' },
    { title: 'Email', value: 'email' },
    { title: 'Department', value: 'department.name' },
    { title: 'Approver', value: 'approver.full_name' },
    { title: 'Approver Email', value: 'approver.email' },
    { title: 'Actions', value: 'actions' },
])


const fixedEmployeeList = computed(() =>{
    return employeeList.value.map((employee: EmployeeInfo) =>{
        let approver = employeeList.value.find((item: EmployeeInfo) => item.id == employee.approver_id)
        return {
            ...employee,
            approver
        }
    })
})

const editedEmployeeLeaveApprover = ref<EmployeeInfo>({})
const updatingEmployeeLeaveApprover = ref(false)
const leaveApproverDialog = ref(false)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editEmployeeLeaveApprover = (employee: EmployeeInfo) => {
    editedEmployeeLeaveApprover.value = Object.assign({}, employee)
    updatingEmployeeLeaveApprover.value = true
    leaveApproverDialog.value = true
}


const updateleaveApproverDialog = (value: boolean) => {
    leaveApproverDialog.value = value
    editedEmployeeLeaveApprover.value = {}
    updatingEmployeeLeaveApprover.value = false
}
</script>
<template>
    <div>
        <AttendanceSettingsEmployeeApproverLeaveApproverDialog :show="leaveApproverDialog" @update:show="updateleaveApproverDialog"
            :updating="updatingEmployeeLeaveApprover" :item="editedEmployeeLeaveApprover" />
    </div>
    <div>
        <SharedUiCustomTable return-object :headers="employeeLeaveApproverHeaders" :items="fixedEmployeeList">

            <!-- Slot to capture bulk actions -->
            <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                    <v-icon>mdi-printer</v-icon> Print
                </v-btn>
            </template>

            <template v-slot:item.actions="{ item }">
                <div>
                    <v-icon color="primary" dense @click="editEmployeeLeaveApprover(item)">mdi-pencil</v-icon>
                    <!-- <v-icon color="red" dense @click="deleteEmployeeLeaveApprover(item.id)">mdi-delete</v-icon> -->
                </div>
            </template>
        </SharedUiCustomTable>
    </div>
</template>

<style scoped ></style>