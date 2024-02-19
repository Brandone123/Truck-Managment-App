<script setup lang="ts">
import { ref } from 'vue'
import type { DepartmentInfo } from '@/types/store/department'

const departmentStore = useDepartmentStore()

const departmentDialog = ref(false)
const updatingDepartment = ref(false)

const defaultDepartment = ref<DepartmentInfo>({
    id: null,
    name: null,
    description: null,
});

const editedDepartment = ref(defaultDepartment.value)


const editDepartment = (driver: DepartmentInfo) => {
    editedDepartment.value = Object.assign({}, driver)
    updatingDepartment.value = true
    departmentDialog.value = true
}

const deleteDepartment = (department_id: number) => {
    departmentStore.deleteDepartment(department_id)
}

const updatedepartmentDialog = (value: boolean) => {
    departmentDialog.value = value
    editedDepartment.value = defaultDepartment.value as DepartmentInfo
    updatingDepartment.value = false
}
</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Departments</span>
            <div>
                <!-- <v-btn color="primary" class="mr-2 text-none" flat>
                    <v-icon>mdi-upload</v-icon>
                    Bulk Upload
                </v-btn> -->
                <SettingsDepartmentDialog :show="departmentDialog" @update:show="updatedepartmentDialog"
                    :updating="updatingDepartment" :item="editedDepartment" />
            </div>

        </div>
        <SettingsDepartmentTable @editDepartment="editDepartment" @deleteDepartment="deleteDepartment" />
    </div>
</template>

