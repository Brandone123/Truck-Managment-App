<script setup lang="ts">
import { ref } from 'vue'
import type { EmployeeInfo } from '@/types/store/employee'

const employeeStore = useEmployeeStore()

const employeeDialog = ref(false)
const updatingEmployee = ref(false)

const defaultEmployee = ref<EmployeeInfo>({
    id: null,
    first_name: null,
    last_name: null,
    email: null,
    department_id: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    zip: null,
    cell_phone: null,
    other_phone: null,
});

const editedEmployee = ref(defaultEmployee.value)


const editEmployee = (driver: EmployeeInfo) => {
    editedEmployee.value = Object.assign({}, driver)
    updatingEmployee.value = true
    employeeDialog.value = true
}

const deleteEmployee = (template_id: number) => {
    employeeStore.deleteEmployee(template_id)
}

const updateEmployeeDialog = (value: boolean) => {
    employeeDialog.value = value
    editedEmployee.value = defaultEmployee.value as EmployeeInfo
    updatingEmployee.value = false
}
</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Employees</span>
            <div>
                <!-- <v-btn color="primary" class="mr-2 text-none" flat>
                    <v-icon>mdi-upload</v-icon>
                    Bulk Upload
                </v-btn> -->
                <SettingsEmployeeDialog :show="employeeDialog" @update:show="updateEmployeeDialog"
                    :updating="updatingEmployee" :item="editedEmployee" />
            </div>

        </div>
        <SettingsEmployeeTable @editEmployee="editEmployee" @deleteEmployee="deleteEmployee" />
    </div>
</template>

