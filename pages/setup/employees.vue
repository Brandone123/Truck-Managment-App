<script setup lang="ts">
import { ref } from 'vue'
import type { EmployeeInfo } from '@/types/store/employee'

const employeeStore = useEmployeeStore()

onMounted(() => {
    employeeStore.fetchEmployeeList()
})

const employeeDialog = ref(false)

const layoutStore = useLayoutStore()

const selectedEmployee = ref<Partial<EmployeeInfo>>({ certifications: [], skills: [], locations: [] } as Partial<EmployeeInfo>);


const editEmployee = (employee: EmployeeInfo) => {
    selectedEmployee.value = JSON.parse(JSON.stringify(employee))
    employeeDialog.value = true
}

const deleteEmployee = async (template_id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
        employeeStore.deleteEmployee(template_id)
    }
}

const addEmployee = () => {
    selectedEmployee.value = { certifications: [], skills: [], locations: [] } as Partial<EmployeeInfo>;
    employeeDialog.value = true;
};

const saveEmployee = (employee: EmployeeInfo) => {
    if (employee.id) {
        employeeStore.updateEmployee(employee);
    } else {
        employeeStore.createEmployee(employee);
    }
    employeeDialog.value = false;
};

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
                <v-btn color="primary" @click="addEmployee">Add Employee</v-btn>
                <SettingsEmployeeDialog :modelValue="employeeDialog" :employee="selectedEmployee"
                    @update:modelValue="employeeDialog = $event" @save="saveEmployee" />
            </div>

        </div>
        <SettingsEmployeeTable @editEmployee="editEmployee" @deleteEmployee="deleteEmployee" />
    </div>
</template>
