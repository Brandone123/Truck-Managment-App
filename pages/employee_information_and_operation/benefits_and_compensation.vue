<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { EmployeeInfo } from '@/types/store/employee';
import type { EmployeeCompensationInfo } from '~/types/employeeInformationAndOperation/employee_compensation';
import type { filterItem } from '@/types/layout/table'
import type { DepartmentInfo } from '~/types/store/department';

const employeeStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeStore)

const employeeCompensationStore = useEmployeeCompensationStore()
const { employeeCompensationList, loading: loadingEmployeeCompensations } = storeToRefs(employeeCompensationStore)

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

const layoutStore = useLayoutStore()

onMounted(() => {
    departmentStore.fetchDepartmentList();
    employeeStore.fetchEmployeeList();
});

const employeeHeaders = ref([
    // { title: 'ID ', key: 'id', class: "no-wrap" },
    { title: 'EMPLOYEE NAME', key: 'full_name', class: "no-wrap" },
    // { title: 'ROLE', key: 'role_id', class: "no-wrap" },
    { title: 'EMAIL', key: 'email', class: "no-wrap" },
    { title: 'DEPARTMENT', key: 'department.name', class: "no-wrap" },
    // { title: 'ADDRESS 1 ', key: 'address1', class: "no-wrap" },
    // { title: 'ADDRESS 2', key: 'address2', class: "no-wrap" },
    // { title: 'CITY', key: 'city', class: "no-wrap" },
    // { title: 'STATE ', key: 'state', class: "no-wrap" },
    // { title: 'HIRE DATE', key: 'hire_date', class: "no-wrap" },
    // { title: 'TERMINATION DATE', key: 'termination_date', class: "no-wrap" },
    // { title: 'ZIP ', key: 'zip', class: "no-wrap" },
    // { title: 'CELL PHONE', key: 'cell_phone', class: "no-wrap" },
    // { title: 'OTHER PHONE', key: 'other_phone', class: "no-wrap" },
    { title: 'ACTIONS', key: 'actions', class: "no-wrap" },

])

const compensationHeaders = ref([
    // { title: 'COMPENSATION ID', key: 'id', class: "no-wrap" },
    { title: 'AMOUNT ', key: 'amount', class: "no-wrap" },
    { title: 'TYPE', key: 'type', class: "no-wrap" },
    { title: 'EFFECTIVE DATE', key: 'effective_date', class: "no-wrap" },
    { title: 'END DATE', key: 'end_date', class: "no-wrap" },
    { title: 'ACTIONS', key: 'actions', class: "no-wrap" },
])

const currentWindow = ref<string>('employee')
const selectedEmployeeId = ref<number | null>(null)


const editedCompensation = ref<EmployeeCompensationInfo>({})
const updatingCompensation = ref(false)
const compensationDialog = ref(false)

const bulkUpdatingCompensation = ref(false)
const bulkUpdateIds = ref<Array<Number>>([])

const CompensationTable = ref(null)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const selectedEmployee = computed(() => {
    return employeeList.value.find((employee: EmployeeInfo) => employee.id == selectedEmployeeId.value)
})

const employeeFilters = computed(() => {
    return [
        {
            title: 'Department',
            key: 'department_id',
            items: departmentList.value.map((department: DepartmentInfo) => { return { text: department.name as string, value: department.id as any } }),
            width: '400px'
        },
    ] as filterItem[]
})

const editCompensation = (compensation: EmployeeCompensationInfo) => {
    editedCompensation.value = Object.assign({}, compensation)
    updatingCompensation.value = true
    compensationDialog.value = true

    //reset bulk update variables
    bulkUpdatingCompensation.value = false
    bulkUpdateIds.value = []
}

const deleteCompensation = async (compensation_id: number) => {

    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
        employeeCompensationStore.deleteEmployeeCompensation(compensation_id)
    }
}

const bulkDeleteCompensations = async (compensations: EmployeeCompensationInfo[]) => {
    const message = `Proceed to delete ${compensations.length > 1 ? 'records' : 'record'}`
    const { confirm, cancel } = await layoutStore.showConfirmDialog(message)

    if (confirm) {
        let compensationIds = compensations.map(compensation => compensation.id as number)
        employeeCompensationStore.bulkDeleteEmployeeCompensation(compensationIds)
        clearSelectedItems()
    }
}

const bulkUpdateCompensations = (compensations: EmployeeCompensationInfo[]) => {
    editedCompensation.value = {}
    updatingCompensation.value = false

    // set bulk update 
    bulkUpdatingCompensation.value = true
    bulkUpdateIds.value = compensations.map(compensation => compensation.id as number)

    compensationDialog.value = true
}


const updateCompensationDialog = (value: boolean) => {
    compensationDialog.value = value
    editedCompensation.value = {}
    updatingCompensation.value = false

    bulkUpdatingCompensation.value = false
    bulkUpdateIds.value = []
}

const employeeCompensations = computed(() => {
    return employeeCompensationList.value //.filter((compensation: EmployeeCompensationInfo) => compensation.employee_id == selectedEmployeeId.value)
})

const showEmployeeCompensations = (employeeId: number) => {
    employeeCompensationStore.clearEmployeeCompensationList()
    employeeCompensationStore.fetchEmployeeCompensationList(employeeId)
    selectedEmployeeId.value = employeeId
    currentWindow.value = 'compensation'
}

const showEmployees = () => {
    currentWindow.value = 'employees'
    selectedEmployeeId.value = null
}

const clearSelectedItems = () => {
    if (CompensationTable.value) {
        // clear selectedItems from within element referenced using ref
        // documentation at: https://vuejs.org/guide/essentials/template-refs.html#ref-on-component
        (CompensationTable.value as any).selectedItems = []
    }
}

</script>

<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Employee Compensations {{ selectedEmployee ? ` |
                ${selectedEmployee.full_name}` : '' }}</span>
            <EmployeeInformationAndOperationEmployeeCompensationDialog v-if="currentWindow == 'compensation'"
                :show="compensationDialog" @update:show="updateCompensationDialog" :updating="updatingCompensation"
                :item="editedCompensation" :selectedEmployeeId="selectedEmployeeId"
                :bulkUpdating="bulkUpdatingCompensation" :bulkUpdateIds="bulkUpdateIds"
                @bulkActionSuccess="clearSelectedItems" />
        </div>

        <v-window v-model="currentWindow">
            <v-window-item value="employees">
                <div>
                    <SharedUiCustomTable return-object :headers="employeeHeaders" :items="employeeList"
                        :filters="employeeFilters">
                        <!-- Slot to capture bulk actions -->
                        <!-- <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                        <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                            <v-icon>mdi-printer</v-icon> Print
                        </v-btn>
                    </template> -->

                        <template #item.actions="{ item }">
                            <v-btn color="primary" density="compact" class="text-none"
                                @click="showEmployeeCompensations(item.id)">
                                Compensations
                                <v-icon dark>mdi-chevron-right</v-icon>
                            </v-btn>
                        </template>
                    </SharedUiCustomTable>
                </div>
            </v-window-item>


            <v-window-item value="compensation">
                <v-row no-gutters class="my-2">
                    <v-btn density="comfortable" class="text-none" color="primary" @click="showEmployees">
                        <v-icon dark>mdi-chevron-left</v-icon>
                        Employees
                    </v-btn>
                </v-row>
                <div>
                    <SharedUiCustomTable ref="CompensationTable" show-select :loading="loadingEmployeeCompensations"
                        no-data-text="No available compensations" return-object :headers="compensationHeaders"
                        :items="employeeCompensations" :showFooterInHead="false">
                        <!-- Slot to capture bulk actions -->
                        <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                            <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                                <v-icon>mdi-printer</v-icon> Print
                            </v-btn>
                            <v-btn color="primary" class="text-none mr-2"
                                @click="bulkUpdateCompensations(selectedItems)">
                                <v-icon>mdi-update</v-icon> Update
                            </v-btn>
                            <v-btn color="red" class="text-none mr-2" @click="bulkDeleteCompensations(selectedItems)">
                                <v-icon>mdi-delete</v-icon> Delete
                            </v-btn>
                        </template>

                        <template #item.actions="{ item }">
                            <v-icon color="primary" dense @click="editCompensation(item)">mdi-pencil</v-icon>
                            <v-icon color="red" dense @click="deleteCompensation(item.id)">mdi-delete</v-icon>
                        </template>
                    </SharedUiCustomTable>
                </div>
            </v-window-item>
        </v-window>
    </div>

</template>

<style scoped></style>