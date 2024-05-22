<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import type { DispatchLocationInfo } from '~/types/dispatch/location';
import type { filterItem } from '@/types/layout/table'

const dispatchLocationStore = useDispatchLocationStore()
const { dispatchLocationList } = storeToRefs(dispatchLocationStore)


const layoutStore = useLayoutStore()

onMounted(() => {
    dispatchLocationStore.fetchDispatchLocationList();
});

const locationHeaders = ref([
    { title: 'ID', key: 'id' },
    { title: 'NAME', key: 'Name', },
    { title: 'LOCATION CODE', key: 'LocationCode', sortable: false },
    { title: 'ADDRESS LINE', key: 'AddressLine', sortale: false },
    { title: 'ADDRESS LINE 2', key: 'AddressLine_2', sortable: false },
    { title: 'CITY', key: 'City' },
    { title: 'STATE', key: 'State' },
    { title: 'CONTACT', key: 'contact' },
    { title: 'PHONE', key: 'phone' },
    { title: 'ACTIONS', key: 'actions', sortable: false },
])

const editedDispatchLocation = ref<DispatchLocationInfo>({})
const updatingDispatchLocation = ref(false)
const bulkUpdatingDispatchLocation = ref(false)
const dispatchLocationDialog = ref(false)
const bulkUpdateIds = ref<Array<Number>>([])

const DispatchLocationTable = ref(null)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editDispatchLocation = (DispatchLocation: DispatchLocationInfo) => {
    editedDispatchLocation.value = Object.assign({}, DispatchLocation)
    updatingDispatchLocation.value = true
    dispatchLocationDialog.value = true

    //reset bulk update variables
    bulkUpdatingDispatchLocation.value = false
    bulkUpdateIds.value = []
}

const deleteDispatchLocation = async (DispatchLocation_Id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
      //  dispatchLocationStore.deleteDispatchLocation(DispatchLocation_Id)
    }
}

const bulkDeleteDispatchLocations = async (DispatchLocations: DispatchLocationInfo[]) => {
    const message = `Proceed to delete ${DispatchLocations.length > 1 ? 'records' : 'record'}`
    const { confirm, cancel } = await layoutStore.showConfirmDialog(message)

    if (confirm) {
        let DispatchLocation_Ids = DispatchLocations.map(dispatchLocation => dispatchLocation.id as number)
        // dispatchLocationStore.bulkDeleteDispatchLocation(DispatchLocation_Ids)
        // clearSelectedItems()
    }
}

const bulkUpdateDispatchLocations = async (DispatchLocations: DispatchLocationInfo[]) => {
    editedDispatchLocation.value = {}
    updatingDispatchLocation.value = false

    // set bulk update 
    bulkUpdatingDispatchLocation.value = true
    bulkUpdateIds.value = DispatchLocations.map(dispatchLocation => dispatchLocation.id as number)

    dispatchLocationDialog.value = true
}

const updateComplianceAndEthicsDialog = (value: boolean) => {
    dispatchLocationDialog.value = value
    editedDispatchLocation.value = {}
    updatingDispatchLocation.value = false
    bulkUpdatingDispatchLocation.value = false
    bulkUpdateIds.value = []
}

// const filters = computed(() => {
//     return [
//         {
//             title: 'Department',
//             key: 'department_id',
//             items: departmentList.value.map((department: DepartmentInfo) => { return { text: department.name as string, value: department.id as any } }),
//             width: '400px'
//         },
//     ] as filterItem[]
// })

const clearSelectedItems = () => {
    if (DispatchLocationTable.value) {
        // clear selectedItems from within element referenced using ref
        // documentation at: https://vuejs.org/guide/essentials/template-refs.html#ref-on-component
        (DispatchLocationTable.value as any).selectedItems = []
    }
}

</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Location Settings</span>
            <DispatchLocationDialog :show="dispatchLocationDialog"
                @update:show="updateComplianceAndEthicsDialog" :updating="updatingDispatchLocation" :item="editedDispatchLocation"
                :bulkUpdating="bulkUpdatingDispatchLocation" :bulkUpdateIds="bulkUpdateIds"
                @bulkActionSuccess="clearSelectedItems" />
        </div>
        <div>
            <SharedUiCustomTable ref="DispatchLocationTable" show-select return-object :headers="locationHeaders" :items="dispatchLocationList"
                >
                <!-- Slot to capture bulk actions -->
                <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                    <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                        <v-icon>mdi-printer</v-icon> Print
                    </v-btn>
                    <v-btn color="primary" class="text-none mr-2" @click="bulkUpdateDispatchLocations(selectedItems)">
                        <v-icon>mdi-update</v-icon> Update
                    </v-btn>
                    <v-btn color="red" class="text-none mr-2" @click="bulkDeleteDispatchLocations(selectedItems)">
                        <v-icon>mdi-delete</v-icon> Delete
                    </v-btn>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div>
                        <v-icon color="primary" dense @click="editDispatchLocation(item)">mdi-pencil</v-icon>
                        <v-icon color="red" dense @click="deleteDispatchLocation(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
            </SharedUiCustomTable>
        </div>
    </div>
</template>

<style scoped></style>~/types/dispatch/location