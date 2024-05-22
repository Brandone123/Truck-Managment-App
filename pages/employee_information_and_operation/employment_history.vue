<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { EmployeeInfo } from '@/types/store/employee';
import type { EmploymentHistoryInfo } from '~/types/employeeInformationAndOperation/employment_history';
import type { filterItem } from '@/types/layout/table'
import type { DepartmentInfo } from '~/types/store/department';

const employeeStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeStore)

const employmentHistoryStore = useEmploymentHistoryStore()
const { employmentHistoryList, loading: loadingEmploymentHistory } = storeToRefs(employmentHistoryStore)

const positionStore = usePositionStore()

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

const layoutStore = useLayoutStore()

onMounted(() => {
    positionStore.fetchPositionList()
    employeeStore.fetchEmployeeList();
    departmentStore.fetchDepartmentList()
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

const employmentHistoryHeaders = ref([
    { title: 'DEPARTMENT', key: 'position.department.name' },
    { title: 'POSITION', key: 'position.title', class: "no-wrap" },
    { title: 'START DATE', key: 'start_date', class: "no-wrap" },
    { title: 'END DATE', key: 'end_date', class: "no-wrap" },
    { title: 'REASON FOR LEAVING', key: 'reason_for_leaving', class: "no-wrap" },
    { title: 'ACTIONS', key: 'actions', class: "no-wrap" },
])

const currentWindow = ref<string>('employee')
const selectedEmployeeId = ref<number | null>(null)


const editedEmloymentHistory = ref<EmploymentHistoryInfo>({})
const updatingEmploymentHistory = ref(false)
const employmentHistoryDialog = ref(false)
const bulkUpdatingEmploymentHistory = ref(false)
const bulkUpdateIds = ref<Array<Number>>([])

const EmploymentHistoryTable = ref(null)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const selectedEmployee = computed(() => {
    return employeeList.value.find((employee: EmployeeInfo) => employee.id == selectedEmployeeId.value)
})


const editEmploymentHistory = (employmentHistory: EmploymentHistoryInfo) => {
    editedEmloymentHistory.value = Object.assign({}, employmentHistory)
    updatingEmploymentHistory.value = true
    employmentHistoryDialog.value = true

    //reset bulk update variables
    bulkUpdatingEmploymentHistory.value = false
    bulkUpdateIds.value = []
}

const deleteEmploymentHistory = async (employmentHistoryId: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
        employmentHistoryStore.deleteEmploymentHistory(employmentHistoryId)
    }
}

const bulkDeleteEmploymentHistories  = async (histories: EmploymentHistoryInfo[]) => {
    const message = `Proceed to delete ${histories.length > 1 ? 'records' : 'record'}`
    const { confirm, cancel } = await layoutStore.showConfirmDialog(message)

    if (confirm) {
        let historyIds = histories.map(history => history.id as number)
        employmentHistoryStore.bulkDeleteEmploymentHistory(historyIds)
        clearSelectedItems()
    }
}


const bulkUpdateEmploymentHistories = async (histories: EmploymentHistoryInfo[]) => {
    editedEmloymentHistory.value = {}
    updatingEmploymentHistory.value = false

    // set bulk update 
    bulkUpdatingEmploymentHistory.value = true
    bulkUpdateIds.value = histories.map(history => history.id as number)

    employmentHistoryDialog.value = true
}

const updatePositionDialog = (value: boolean) => {
    employmentHistoryDialog.value = value
    editedEmloymentHistory.value = {}
    updatingEmploymentHistory.value = false

    bulkUpdatingEmploymentHistory.value = false
    bulkUpdateIds.value = []
}

const employeeHistory = computed(() => {
    return employmentHistoryList.value //.filter((employmentHistory: EmploymentHistoryInfo) => employmentHistory.employee_id == selectedEmployeeId.value)
})

const showEmploymentHistory = (employeeId: number) => {
    employmentHistoryStore.clearEmploymentHistoryList()
    employmentHistoryStore.fetchEmploymentHistoryList(employeeId)
    selectedEmployeeId.value = employeeId
    currentWindow.value = 'employmentHistory'
}

const showEmployees = () => {
    currentWindow.value = 'employees'
    selectedEmployeeId.value = null
}


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

const employeeHistoryFilters = computed(() => {
    return [
        {
            title: 'Department',
            key: 'position.department.id',
            items: departmentList.value.map((department: DepartmentInfo) => { return { text: department.name as string, value: department.id as any } }),
            width: '400px'
        },
    ] as filterItem[]
})

const clearSelectedItems = () => {
    if (EmploymentHistoryTable.value) {
        // clear selectedItems from within element referenced using ref
        // documentation at: https://vuejs.org/guide/essentials/template-refs.html#ref-on-component
        (EmploymentHistoryTable.value as any).selectedItems = []
    }
}
</script>

<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Employment History {{ selectedEmployee ? ` |
                ${selectedEmployee.full_name}` : '' }}</span>
            <EmployeeInformationAndOperationEmploymentHistoryDialog v-if="currentWindow == 'employmentHistory'"
                :show="employmentHistoryDialog" @update:show="updatePositionDialog"
                :updating="updatingEmploymentHistory" :item="editedEmloymentHistory"
                :selectedEmployeeId="selectedEmployeeId" 
                :bulkUpdating="bulkUpdatingEmploymentHistory" :bulkUpdateIds="bulkUpdateIds"
                @bulkActionSuccess="clearSelectedItems"
                />
        </div>

        <v-window v-model="currentWindow">
            <v-window-item value="employees">
                <div>
                    <SharedUiCustomTable return-object :headers="employeeHeaders" :items="employeeList" :filters="employeeFilters">
                        <!-- Slot to capture bulk actions -->
                        <!-- <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                        <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                            <v-icon>mdi-printer</v-icon> Print
                        </v-btn>
                    </template> -->

                        <template #item.actions="{ item }">
                            <v-btn color="primary" density="compact" class="text-none"
                                @click="showEmploymentHistory(item.id)">
                                History
                                <v-icon dark>mdi-chevron-right</v-icon>
                            </v-btn>

                        </template>
                    </SharedUiCustomTable>
                </div>
            </v-window-item>


            <v-window-item value="employmentHistory">
                <v-row no-gutters class="my-2">
                    <v-btn density="comfortable" class="text-none" color="primary" @click="showEmployees">
                        <v-icon dark>mdi-chevron-left</v-icon>
                        Employees
                    </v-btn>
                </v-row>
                <div>
                    <SharedUiCustomTable ref="EmploymentHistoryTable" :loading="loadingEmploymentHistory"
                        no-data-text="No available employment history" return-object show-select
                        :headers="employmentHistoryHeaders" :items="employeeHistory" :showFooterInHead="true"
                        :filters="employeeHistoryFilters">
                        <!-- Slot to capture bulk actions -->
                        <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                            <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                                <v-icon>mdi-printer</v-icon> Print
                            </v-btn>
                            <v-btn color="primary" class="text-none mr-2" @click="bulkUpdateEmploymentHistories(selectedItems)">
                                <v-icon>mdi-update</v-icon> Update
                            </v-btn>
                            <v-btn color="red" class="text-none mr-2" @click="bulkDeleteEmploymentHistories(selectedItems)">
                                <v-icon>mdi-delete</v-icon> Delete
                            </v-btn>
                        </template>

                        <template #item.actions="{ item }">
                            <v-icon color="primary" dense @click="editEmploymentHistory(item)">mdi-pencil</v-icon>
                            <v-icon color="red" dense @click="deleteEmploymentHistory(item.id)">mdi-delete</v-icon>
                        </template>
                    </SharedUiCustomTable>
                </div>
            </v-window-item>
        </v-window>
    </div>

</template>

<style scoped></style>