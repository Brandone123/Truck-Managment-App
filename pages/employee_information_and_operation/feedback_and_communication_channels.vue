<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { EmployeeFeedbackInfo } from '~/types/employeeInformationAndOperation/employee_feedback';
import type { filterItem } from '@/types/layout/table'
import type { DepartmentInfo } from '~/types/store/department';

const employeeFeedbackStore = useEmployeeFeedbackStore()
const { employeeFeedbackList } = storeToRefs(employeeFeedbackStore)

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

const layoutStore = useLayoutStore()

onMounted(() => {
    departmentStore.fetchDepartmentList()
    employeeFeedbackStore.fetchEmployeeFeedbackList();
});

const timeoffHeaders = ref([
    // { title: 'ID', key: 'id' },
    { title: 'EMPLOYEE', key: 'employee.full_name', },
    { title: 'EMPLOYEE DEPARTMENT', key: 'employee.department.name', },
    { title: 'CONTENT', key: 'content', sortale: false },
    { title: 'RESOLVED', key: 'resolved', align: 'center' },
    { title: 'ACTIONS', key: 'actions', sortable: false },
])

const editedEmployeeFeedback = ref<EmployeeFeedbackInfo>({})
const updatingEmployeeFeedback = ref(false)
const employeeFeedbackDialog = ref(false)

const bulkUpdatingCompensation = ref(false)
const bulkUpdateIds = ref<Array<Number>>([])

const FeedbackTable = ref(null)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editEmployeeFeedback = (leave_type: EmployeeFeedbackInfo) => {
    editedEmployeeFeedback.value = Object.assign({}, leave_type)
    updatingEmployeeFeedback.value = true
    employeeFeedbackDialog.value = true

    //reset bulk update variables
    bulkUpdatingCompensation.value = false
    bulkUpdateIds.value = []
}

const deleteEmployeeFeedback = async (leave_type_id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
        employeeFeedbackStore.deleteEmployeeFeedback(leave_type_id)
    }

}

const bulkDelete = async (feedback: EmployeeFeedbackInfo[]) => {
    const message = `Proceed to delete ${feedback.length > 1 ? 'records' : 'record'}`
    const { confirm, cancel } = await layoutStore.showConfirmDialog(message)

    if (confirm) {
        let compensationIds = feedback.map(compensation => compensation.id as number)
        employeeFeedbackStore.bulkDeleteEmployeeFeedback(compensationIds)
        clearSelectedItems()
    }
}

const bulkUpdate = (feedback: EmployeeFeedbackInfo[]) => {
    editedEmployeeFeedback.value = {}
    updatingEmployeeFeedback.value = false
    employeeFeedbackDialog.value = true

    // set bulk update 
    bulkUpdatingCompensation.value = true
    bulkUpdateIds.value = feedback.map(compensation => compensation.id as number)

}

const updateEmployeeFeedbackDialog = (value: boolean) => {
    employeeFeedbackDialog.value = value
    editedEmployeeFeedback.value = {}
    updatingEmployeeFeedback.value = false

    bulkUpdatingCompensation.value = false
    bulkUpdateIds.value = []
}

const updateResolvedState = async (employeeFeedback: EmployeeFeedbackInfo) => {
    let message = `Are you sure you want mark item as ${employeeFeedback.resolved ? 'unresolved' : 'resolved'} ?`
    const { confirm, cancel } = await layoutStore.showConfirmDialog(message)
    if (confirm) {
        employeeFeedbackStore.updateEmployeeFeedback({
            id: employeeFeedback.id,
            resolved: employeeFeedback.resolved ? false : true
        });
    }
}

// filter parameters for the displayed table
const filters = computed(() => {
    return [
        {
            title: 'Department',
            key: 'employee.department_id',
            items: departmentList.value.map((department: DepartmentInfo) => { return { text: department.name as string, value: department.id as any } }),
            width: '400px'
        },
    ] as filterItem[]
})

const clearSelectedItems = () => {
    if (FeedbackTable.value) {
        // clear selectedItems from within element referenced using ref
        // documentation at: https://vuejs.org/guide/essentials/template-refs.html#ref-on-component
        (FeedbackTable.value as any).selectedItems = []
    }
}
</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Feedback And Communication Channels</span>
            <EmployeeInformationAndOperationEmployeeFeedbackDialog :show="employeeFeedbackDialog"
                @update:show="updateEmployeeFeedbackDialog" :updating="updatingEmployeeFeedback"
                :item="editedEmployeeFeedback" :bulkUpdating="bulkUpdatingCompensation" :bulkUpdateIds="bulkUpdateIds"
                @bulkActionSuccess="clearSelectedItems" />
        </div>
        <div>
            <SharedUiCustomTable ref="FeedbackTable" :filters="filters" show-select return-object
                :headers="timeoffHeaders" :items="employeeFeedbackList">
                <!-- Slot to capture bulk actions -->
                <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                    <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                        <v-icon>mdi-printer</v-icon> Print
                    </v-btn>
                    <v-btn color="primary" class="text-none mr-2" @click="bulkUpdate(selectedItems)">
                        <v-icon>mdi-update</v-icon> Update
                    </v-btn>
                    <v-btn color="red" class="text-none mr-2" @click="bulkDelete(selectedItems)">
                        <v-icon>mdi-delete</v-icon> Delete
                    </v-btn>
                </template>

                <template #item.resolved="{ item }">
                    <v-btn icon density="compact" @click="updateResolvedState(item)">
                        <v-icon :color="item.resolved ? 'green' : 'error'">
                            {{ item.resolved ? 'mdi-check' : 'mdi-close' }}
                        </v-icon>
                    </v-btn>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-icon color="primary" v-if="!item.resolved" dense
                        @click="editEmployeeFeedback(item)">mdi-pencil</v-icon>
                    <v-icon color="red" dense @click="deleteEmployeeFeedback(item.id)">mdi-delete</v-icon>

                </template>
            </SharedUiCustomTable>
        </div>
    </div>
</template>

<style scoped></style>