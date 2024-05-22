<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { defineProps, defineEmits } from 'vue'
import type { EmployeeInfo } from '@/types/store/employee';


const employeeStore = useEmployeeStore()
const { employeeList, loading : loadingEmployeeList } = storeToRefs(employeeStore)

const departmentStore = useDepartmentStore()
const { departmentList, loading : loadingDepartmentList } = storeToRefs(departmentStore)

const roleStore = useRoleStore()
const { roleList, loading : loadingRoletList } = storeToRefs(roleStore)

onMounted(() => {
    roleStore.fetchRoleList();
    departmentStore.fetchDepartmentList();
    employeeStore.fetchEmployeeList();
});

const emit = defineEmits(['editEmployee', 'deleteEmployee'])
const employeeHeaders = ref([
    { title: 'ID ', key: 'id', class: "no-wrap" },
    { title: 'FIRST NAME ', key: 'first_name', class: "no-wrap" },
    { title: 'LAST NAME', key: 'last_name', class: "no-wrap" },
    { title: 'ROLE', key: 'role_id', class: "no-wrap" },
    { title: 'EMAIL', key: 'user.email', class: "no-wrap" },
    { title: 'DEPARTMENT', key: 'department_id', class: "no-wrap" },
    { title: 'ADDRESS 1 ', key: 'address1', class: "no-wrap" },
    { title: 'ADDRESS 2', key: 'address2', class: "no-wrap" },
    { title: 'CITY', key: 'city', class: "no-wrap" },
    { title: 'STATE ', key: 'state', class: "no-wrap" },
    { title: 'HIRE DATE', key: 'hire_date', class: "no-wrap" },
    { title: 'TERMINATION DATE', key: 'termination_date', class: "no-wrap" },
    { title: 'ZIP ', key: 'zip', class: "no-wrap" },
    { title: 'CELL PHONE', key: 'cell_phone', class: "no-wrap" },
    { title: 'OTHER PHONE', key: 'other_phone', class: "no-wrap" },
    { title: 'ACTIONS', key: 'actions', class: "no-wrap" },
    
])


const editTemplate = (item: EmployeeInfo) => {
    emit('editEmployee', item)
}

const deleteTemplate = (employee_id: number) => {
    emit('deleteEmployee', employee_id)
}

const getDepartment = (department_id: number) => {
    return departmentList.value.find((item: any) => item.id == department_id)
}

const getRole = (role_id: number) => {
    return roleList.value.find((item: any) => item.id == role_id)
}
</script>

<template>
    <SharedUiCustomTable return-object show-select :headers="employeeHeaders" :items="employeeList" :loading="loadingEmployeeList">
        <template v-slot:item.department_id="{ item }">
            {{getDepartment(item.department_id)?.name}}
        </template>

        <template v-slot:item.role_id="{ item }">
            {{getRole(item.role_id)?.name || 'No role specified'}}
        </template>

        <template v-slot:item.actions="{ item }">
            <div>
                <v-icon color="primary" dense @click="editTemplate(item)">mdi-pencil</v-icon>
                <v-icon color="red" dense @click="deleteTemplate(item.id)">mdi-delete</v-icon>
            </div>
        </template>
    </SharedUiCustomTable>
</template>


<style scoped >
</style>