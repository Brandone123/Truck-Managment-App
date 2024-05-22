<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import type { TruckInfo } from '~/types/dispatch/locations';
import type { filterItem } from '@/types/layout/table'

const truckStore = useTruckStore()
const { truckList } = storeToRefs(truckStore)


const layoutStore = useLayoutStore()

onMounted(() => {
    truckStore.fetchTruckList();
});

const truckHeaders = ref([
    { title: 'ID', key: 'id' },
    { title: 'NAME', key: 'name', },
    { title: 'LICENSE PLATE', key: 'license_plate', sortable: false },
    { title: 'MAKE', key: 'make', sortale: false },
    { title: 'MODEL', key: 'model', sortable: false },
    { title: 'YEAR', key: 'year' },
    { title: 'VIN', key: 'vin' },
    { title: 'SERIAL', key: 'serial' },
    { title: 'ACTIONS', key: 'actions', sortable: false },
])

const editedTruck = ref<TruckInfo>({})
const updatingTruck = ref(false)
const bulkUpdatingTruck = ref(false)
const truckDialog = ref(false)
const bulkUpdateIds = ref<Array<Number>>([])

const truckTable = ref(null)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const edittruck = (truck: TruckInfo) => {
    editedTruck.value = Object.assign({}, truck)
    updatingTruck.value = true
    truckDialog.value = true

    //reset bulk update variables
    bulkUpdatingTruck.value = false
    bulkUpdateIds.value = []
}

const deletetruck = async (truck_Id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
      //  truckStore.deletetruck(truck_Id)
    }
}

const bulkDeleteTrucks = async (trucks: TruckInfo[]) => {
    const message = `Proceed to delete ${trucks.length > 1 ? 'records' : 'record'}`
    const { confirm, cancel } = await layoutStore.showConfirmDialog(message)

    if (confirm) {
        let truck_Ids = trucks.map(truck => truck.id as number)
        // truckStore.bulkDeleteTruck(truck_Ids)
        // clearSelectedItems()
    }
}

const bulkUpdateTrucks = async (trucks: TruckInfo[]) => {
    editedTruck.value = {}
    updatingTruck.value = false

    // set bulk update 
    bulkUpdatingTruck.value = true
    bulkUpdateIds.value = trucks.map(truck => truck.id as number)

    truckDialog.value = true
}

const updateComplianceAndEthicsDialog = (value: boolean) => {
    truckDialog.value = value
    editedTruck.value = {}
    updatingTruck.value = false
    bulkUpdatingTruck.value = false
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
    if (truckTable.value) {
        // clear selectedItems from within element referenced using ref
        // documentation at: https://vuejs.org/guide/essentials/template-refs.html#ref-on-component
        (truckTable.value as any).selectedItems = []
    }
}

</script>
<template>
    <div>
        <div class="d-flex justify-end">
            <DispatchTruckDialog :show="truckDialog"
                @update:show="updateComplianceAndEthicsDialog" :updating="updatingTruck" :item="editedTruck"
                :bulkUpdating="bulkUpdatingTruck" :bulkUpdateIds="bulkUpdateIds"
                @bulkActionSuccess="clearSelectedItems" />
        </div>
        <div>
            <SharedUiCustomTable ref="truckTable" show-select return-object :headers="truckHeaders" :items="truckList"
                >
                <!-- Slot to capture bulk actions -->
                <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                    <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                        <v-icon>mdi-printer</v-icon> Print
                    </v-btn>
                    <v-btn color="primary" class="text-none mr-2" @click="bulkUpdateTrucks(selectedItems)">
                        <v-icon>mdi-update</v-icon> Update
                    </v-btn>
                    <v-btn color="red" class="text-none mr-2" @click="bulkDeleteTrucks(selectedItems)">
                        <v-icon>mdi-delete</v-icon> Delete
                    </v-btn>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div>
                        <v-icon color="primary" dense @click="edittruck(item)">mdi-pencil</v-icon>
                        <v-icon color="red" dense @click="deletetruck(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
            </SharedUiCustomTable>
        </div>
    </div>
</template>

<style scoped></style>~/types/dispatch/location