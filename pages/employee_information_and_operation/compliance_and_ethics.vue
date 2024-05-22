<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { ComplianceAndEthicsInfo } from '~/types/employeeInformationAndOperation/compliance_and_ethics';
import type { filterItem } from '@/types/layout/table'
import type { DepartmentInfo } from '~/types/store/department';

const complianceAndEthicsStore = useComplianceAndEthicsStore()
const { complianceAndEthicsList } = storeToRefs(complianceAndEthicsStore)

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

const layoutStore = useLayoutStore()

onMounted(() => {
    departmentStore.fetchDepartmentList()
    complianceAndEthicsStore.fetchComplianceAndEthicsList();
});

const timeoffHeaders = ref([
    // { title: 'COMPLIANCE ID', key: 'id' },
    { title: 'DEPARTMENT', key: 'department.name', },
    { title: 'TITLE', key: 'title', sortale: false },
    { title: 'DESCRIPTION', key: 'description', sortable: false },
    { title: 'LAST REVIEWED', key: 'last_reviewed' },
    { title: 'ACTIONS', key: 'actions', sortable: false },
])

const editedComplianceAndEthics = ref<ComplianceAndEthicsInfo>({})
const updatingComplianceAndEthics = ref(false)
const complianceAndEthicsDialog = ref(false)

const bulkUpdatingComplianceAndEthics = ref(false)
const bulkUpdateIds = ref<Array<Number>>([])

const ComplianceAndEthicsTable = ref(null)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editComplianceAndEthics = (leave_type: ComplianceAndEthicsInfo) => {
    editedComplianceAndEthics.value = Object.assign({}, leave_type)
    updatingComplianceAndEthics.value = true
    complianceAndEthicsDialog.value = true

    //reset bulk update variables
    bulkUpdatingComplianceAndEthics.value = false
    bulkUpdateIds.value = []
}

const deleteComplianceAndEthics = async (leave_type_id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
        complianceAndEthicsStore.deleteComplianceAndEthics(leave_type_id)
    }
}


const bulkDelete= async (complianceAndEthics: ComplianceAndEthicsInfo[]) => {
    const message = `Proceed to delete ${complianceAndEthics.length > 1 ? 'records' : 'record'}`
    const { confirm, cancel } = await layoutStore.showConfirmDialog(message)

    if (confirm) {
        let complianceAndEthicsIds = complianceAndEthics.map(compensation => compensation.id as number)
        complianceAndEthicsStore.bulkDeleteComplianceAndEthics(complianceAndEthicsIds)
        clearSelectedItems()
    }
}

const bulkUpdate = (complianceAndEthics: ComplianceAndEthicsInfo[]) => {
    editedComplianceAndEthics.value = {}
    updatingComplianceAndEthics.value = false

    // set bulk update 
    bulkUpdatingComplianceAndEthics.value = true
    bulkUpdateIds.value = complianceAndEthics.map(compensation => compensation.id as number)

    complianceAndEthicsDialog.value = true
}


const updateComplianceAndEthicsDialog = (value: boolean) => {
    complianceAndEthicsDialog.value = value
    editedComplianceAndEthics.value = {}
    updatingComplianceAndEthics.value = false

    bulkUpdatingComplianceAndEthics.value = false
    bulkUpdateIds.value = []
}

// filter parameters for the displayed table
const filters = computed(() => {
    return [
        {
            title: 'Department',
            key: 'department_id',
            items: departmentList.value.map((department: DepartmentInfo) => { return { text: department.name as string, value: department.id as any } }),
            width: '400px'
        },
    ] as filterItem[]
})

const clearSelectedItems = () => {
    if (ComplianceAndEthicsTable.value) {
        // clear selectedItems from within element referenced using ref
        // documentation at: https://vuejs.org/guide/essentials/template-refs.html#ref-on-component
        (ComplianceAndEthicsTable.value as any).selectedItems = []
    }
}
</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Compliance And Ethics</span>
            <EmployeeInformationAndOperationComplianceAndEthicsDialog :show="complianceAndEthicsDialog"
                @update:show="updateComplianceAndEthicsDialog" :updating="updatingComplianceAndEthics"
                :item="editedComplianceAndEthics" :bulkUpdating="bulkUpdatingComplianceAndEthics"
                :bulkUpdateIds="bulkUpdateIds" @bulkActionSuccess="clearSelectedItems" />
        </div>
        <div>
            <SharedUiCustomTable ref="ComplianceAndEthicsTable" :filters="filters" show-select return-object
                :headers="timeoffHeaders" :items="complianceAndEthicsList">
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

                <template v-slot:item.actions="{ item }">
                    <div>
                        <v-icon color="primary" dense @click="editComplianceAndEthics(item)">mdi-pencil</v-icon>
                        <v-icon color="red" dense @click="deleteComplianceAndEthics(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
            </SharedUiCustomTable>
        </div>
    </div>
</template>

<style scoped></style>