<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import type { DriverInfo } from '~/types/store/driver';
import type { filterItem } from '@/types/layout/table'

const driverStore = useDriverStore()
const { driverList, loading: loadingDriverList } = storeToRefs(driverStore)

const layoutStore = useLayoutStore()

onMounted(() => {
    driverStore.fetchDriverList();
});

const locationHeaders = ref([
    { title: 'ID', key: 'id' },
    { title: 'NAME', key: 'name', },
    { title: 'PHONE', key: 'phone', sortable: false },
    { title: 'LICENSE NUMBER', key: 'license_number', sortale: false },
    { title: 'LICENSE STATE', key: 'license_state', sortable: false },
    { title: 'SAMSERA STATUS', key: 'samsara_status' },
    { title: 'CATEGORY', key: 'category' },
    { title: 'ACTIONS', key: 'actions', sortable: false },
])

const editedDriver = ref<DriverInfo>({
    id: null,
    user_id: null,
    name: null,
    phone: null,
    license_number: null,
    license_state: null,
    samsara_status: null,
    category: null,
    cdl_expiration: null,
    mvr_due: null,
    hazmat_expiration: null,
    physical_due: null,
})

const updatingDriver = ref(false)
const bulkUpdatingDriver = ref(false)
const driverDialog = ref(false)
const bulkUpdateIds = ref<Array<number>>([])

const driverTable = ref(null)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editDriver = (driver: DriverInfo) => {
    editedDriver.value = Object.assign({}, driver)
    updatingDriver.value = true
    driverDialog.value = true

    //reset bulk update variables
    bulkUpdatingDriver.value = false
    bulkUpdateIds.value = []
}

const deleteDriver = async (driver_Id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
       driverStore.deleteDriver(driver_Id)
    }
}

const bulkDeleteDrivers = async (drivers: DriverInfo[]) => {
    const message = `Proceed to delete ${drivers.length > 1 ? 'records' : 'record'}`
    const { confirm, cancel } = await layoutStore.showConfirmDialog(message)

    if (confirm) {
        let driver_Ids = drivers.map(driver => driver.id as number)
        driverStore.bulkDeleteDriver(driver_Ids)
        clearSelectedItems()
    }
}

const bulkUpdateDrivers = async (drivers: DriverInfo[]) => {
    editedDriver.value = editedDriver.value as DriverInfo
    updatingDriver.value = false

    // set bulk update 
    bulkUpdatingDriver.value = true
    bulkUpdateIds.value = drivers.map(driver => driver.id as number)

    driverDialog.value = true
}

const updateDriversDialog = (value: boolean) => {
    driverDialog.value = value
    editedDriver.value = editedDriver.value as DriverInfo
    updatingDriver.value = false
    bulkUpdatingDriver.value = false
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
    if (driverTable.value) {
        // clear selectedItems from within element referenced using ref
        // documentation at: https://vuejs.org/guide/essentials/template-refs.html#ref-on-component
        (driverTable.value as any).selectedItems = []
    }
}

</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
            <span class="text-primary text-h5">Driver Setup</span>
            <SettingsDriverDialog :show="driverDialog"
                @update:show="updateDriversDialog" :updating="updatingDriver" :item="editedDriver"
                :bulkUpdating="bulkUpdatingDriver" :bulkUpdateIds="bulkUpdateIds"
                @bulkActionSuccess="clearSelectedItems" />
        </div>
        <div>
            <SharedUiCustomTable ref="driverTable" :loading="loadingDriverList" show-select return-object :headers="locationHeaders" :items="driverList"
                >
                <!-- Slot to capture bulk actions -->
                <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                    <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                        <v-icon>mdi-printer</v-icon> Print
                    </v-btn>
                    <v-btn color="primary" class="text-none mr-2" @click="bulkUpdateDrivers(selectedItems)">
                        <v-icon>mdi-update</v-icon> Update
                    </v-btn>
                    <v-btn color="red" class="text-none mr-2" @click="bulkDeleteDrivers(selectedItems)">
                        <v-icon>mdi-delete</v-icon> Delete
                    </v-btn>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div>
                        <v-icon color="primary" dense @click="editDriver(item)">mdi-pencil</v-icon>
                        <v-icon color="red" dense @click="deleteDriver(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
            </SharedUiCustomTable>
        </div>
    </div>
</template>

<style scoped></style>~/types/dispatch/location