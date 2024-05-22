<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import type { StandardOperatingProcedureInfo } from '~/types/employeeInformationAndOperation/standard_operating_procedure';
import type { filterItem } from '@/types/layout/table'
import type { DepartmentInfo } from '~/types/store/department';

const standaredOperatingProcedureStore = useSOPStore()
const { SOPList } = storeToRefs(standaredOperatingProcedureStore)

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

const layoutStore = useLayoutStore()

onMounted(() => {
    departmentStore.fetchDepartmentList()
    standaredOperatingProcedureStore.fetchSOPList();
});

const sopHeaders = ref([
    // { title: 'ID', key: 'id' },
    { title: 'DEPARTMENT', key: 'department.name', },
    { title: 'TITLE', key: 'title', sortable: false },
    { title: 'DESCRIPTION', key: 'description', sortale: false },
    { title: 'EMERGENCY PROCEDURES', key: 'emergency_procedures', sortable: false },
    { title: 'DOCUMENT PATH', key: 'document_path' },
    { title: 'ACTIONS', key: 'actions', sortable: false },
])

const editedSOP = ref<StandardOperatingProcedureInfo>({})
const updatingSOP = ref(false)
const bulkUpdatingSOP = ref(false)
const SOPDialog = ref(false)
const bulkUpdateIds = ref<Array<Number>>([])

const SOPTable = ref(null)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editSOP = (SOP: StandardOperatingProcedureInfo) => {
    editedSOP.value = Object.assign({}, SOP)
    updatingSOP.value = true
    SOPDialog.value = true

    //reset bulk update variables
    bulkUpdatingSOP.value = false
    bulkUpdateIds.value = []
}

const deleteSOP = async (SOP_Id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
        standaredOperatingProcedureStore.deleteSOP(SOP_Id)
    }
}

const bulkDeleteSOPs = async (SOPs: StandardOperatingProcedureInfo[]) => {
    const message = `Proceed to delete ${SOPs.length > 1 ? 'records' : 'record'}`
    const { confirm, cancel } = await layoutStore.showConfirmDialog(message)

    if (confirm) {
        let SOP_Ids = SOPs.map(sop => sop.id as number)
        standaredOperatingProcedureStore.bulkDeleteSOP(SOP_Ids)
        clearSelectedItems()
    }
}

const bulkUpdateSOPs = async (SOPs: StandardOperatingProcedureInfo[]) => {
    editedSOP.value = {}
    updatingSOP.value = false

    // set bulk update 
    bulkUpdatingSOP.value = true
    bulkUpdateIds.value = SOPs.map(sop => sop.id as number)

    SOPDialog.value = true
}

const updateComplianceAndEthicsDialog = (value: boolean) => {
    SOPDialog.value = value
    editedSOP.value = {}
    updatingSOP.value = false
    bulkUpdatingSOP.value = false
    bulkUpdateIds.value = []
}

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
    if (SOPTable.value) {
        // clear selectedItems from within element referenced using ref
        // documentation at: https://vuejs.org/guide/essentials/template-refs.html#ref-on-component
        (SOPTable.value as any).selectedItems = []
    }
}

</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Standard Operating Procedures</span>
            <EmployeeInformationAndOperationStandardOperatingProceduresDialog :show="SOPDialog"
                @update:show="updateComplianceAndEthicsDialog" :updating="updatingSOP" :item="editedSOP"
                :bulkUpdating="bulkUpdatingSOP" :bulkUpdateIds="bulkUpdateIds"
                @bulkActionSuccess="clearSelectedItems" />
        </div>
        <div>
            <SharedUiCustomTable ref="SOPTable" show-select return-object :headers="sopHeaders" :items="SOPList"
                :filters="filters">
                <!-- Slot to capture bulk actions -->
                <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                    <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                        <v-icon>mdi-printer</v-icon> Print
                    </v-btn>
                    <v-btn color="primary" class="text-none mr-2" @click="bulkUpdateSOPs(selectedItems)">
                        <v-icon>mdi-update</v-icon> Update
                    </v-btn>
                    <v-btn color="red" class="text-none mr-2" @click="bulkDeleteSOPs(selectedItems)">
                        <v-icon>mdi-delete</v-icon> Delete
                    </v-btn>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div>
                        <v-icon color="primary" dense @click="editSOP(item)">mdi-pencil</v-icon>
                        <v-icon color="red" dense @click="deleteSOP(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
            </SharedUiCustomTable>
        </div>
    </div>
</template>

<style scoped></style>