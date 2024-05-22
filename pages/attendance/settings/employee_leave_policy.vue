<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { LeaveApproverInfo } from '@/types/attendance/leave_approver'
import type { EmployeeInfo } from '@/types/store/employee'

// const emit = defineEmits(['editItem'])

const leavePolicyStore = useLeavePolicyStore()
const { leavePolicyList } = storeToRefs(leavePolicyStore)

const employeeStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeStore)

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

onMounted(() => {
    employeeStore.fetchEmployeeList();
    departmentStore.fetchDepartmentList();
    leavePolicyStore.fetchLeavePolicyList();
});

const employeeLeavePolicyHeaders = ref([
    { title: 'Name', value: 'full_name' },
    { title: 'Email', value: 'email' },
    { title: 'Department', value: 'department.name' },
    { title: 'Policy', value: 'leave_policy.name' },
    { title: 'Actions', value: 'actions' },
])


const fixedEmployeeList = computed(() =>{
    return employeeList.value.map((employee: EmployeeInfo) =>{
        let policy = employeeList.value.find((item: EmployeeInfo) => item.id == employee.leave_policy_id)
        return {
            ...employee,
            policy
        }
    })
})

const editedEmployeeLeavePolicy = ref<EmployeeInfo>({})
const updatingEmployeeLeavePolicy = ref(false)
const leavePolicyDialog = ref(false)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editEmployeeLeavePolicy = (employee: EmployeeInfo) => {
    editedEmployeeLeavePolicy.value = Object.assign({}, employee)
    updatingEmployeeLeavePolicy.value = true
    leavePolicyDialog.value = true
}


const updateleavePolicyDialog = (value: boolean) => {
    leavePolicyDialog.value = value
    editedEmployeeLeavePolicy.value = {}
    updatingEmployeeLeavePolicy.value = false
}
</script>
<template>
    <div>
        <AttendanceSettingsEmployeePolicyLeavePolicyDialog :show="leavePolicyDialog" @update:show="updateleavePolicyDialog"
            :updating="updatingEmployeeLeavePolicy" :item="editedEmployeeLeavePolicy" />
    </div>
    <div>
        <SharedUiCustomTable return-object :headers="employeeLeavePolicyHeaders" :items="fixedEmployeeList">

            <!-- Slot to capture bulk actions -->
            <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                    <v-icon>mdi-printer</v-icon> Print
                </v-btn>
            </template>

            <template v-slot:item.actions="{ item }">
                <div>
                    <v-icon color="primary" dense @click="editEmployeeLeavePolicy(item)">mdi-pencil</v-icon>
                    <!-- <v-icon color="red" dense @click="deleteEmployeeLeaveApprover(item.id)">mdi-delete</v-icon> -->
                </div>
            </template>
        </SharedUiCustomTable>
    </div>
</template>

<style scoped ></style>