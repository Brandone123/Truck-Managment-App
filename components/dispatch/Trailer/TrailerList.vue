<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import type { TrailerInfo } from '~/types/dispatch/locations';
import type { filterItem } from '@/types/layout/table'

const trailerStore = useTrailerStore()
const { trailerList } = storeToRefs(trailerStore)


const layoutStore = useLayoutStore()

onMounted(() => {
    trailerStore.fetchTrailerList();
});

const trailerHeaders = ref([
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

const editedTrailer = ref<TrailerInfo>({})
const updatingTrailer = ref(false)
const bulkUpdatingTrailer = ref(false)
const trailerDialog = ref(false)
const bulkUpdateIds = ref<Array<Number>>([])

const trailerTable = ref(null)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const edittrailer = (trailer: TrailerInfo) => {
    editedTrailer.value = Object.assign({}, trailer)
    updatingTrailer.value = true
    trailerDialog.value = true

    //reset bulk update variables
    bulkUpdatingTrailer.value = false
    bulkUpdateIds.value = []
}

const deletetrailer = async (trailer_Id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
      //  trailerStore.deletetrailer(trailer_Id)
    }
}

const bulkDeleteTrailers = async (trailers: TrailerInfo[]) => {
    const message = `Proceed to delete ${trailers.length > 1 ? 'records' : 'record'}`
    const { confirm, cancel } = await layoutStore.showConfirmDialog(message)

    if (confirm) {
        let trailer_Ids = trailers.map(trailer => trailer.id as number)
        // trailerStore.bulkDeleteTrailer(trailer_Ids)
        // clearSelectedItems()
    }
}

const bulkUpdateTrailers = async (trailers: TrailerInfo[]) => {
    editedTrailer.value = {}
    updatingTrailer.value = false

    // set bulk update 
    bulkUpdatingTrailer.value = true
    bulkUpdateIds.value = trailers.map(trailer => trailer.id as number)

    trailerDialog.value = true
}

const updateComplianceAndEthicsDialog = (value: boolean) => {
    trailerDialog.value = value
    editedTrailer.value = {}
    updatingTrailer.value = false
    bulkUpdatingTrailer.value = false
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
    if (trailerTable.value) {
        // clear selectedItems from within element referenced using ref
        // documentation at: https://vuejs.org/guide/essentials/template-refs.html#ref-on-component
        (trailerTable.value as any).selectedItems = []
    }
}

</script>
<template>
    <div>
        <div class="d-flex justify-end">
            <DispatchTrailerDialog :show="trailerDialog"
                @update:show="updateComplianceAndEthicsDialog" :updating="updatingTrailer" :item="editedTrailer"
                :bulkUpdating="bulkUpdatingTrailer" :bulkUpdateIds="bulkUpdateIds"
                @bulkActionSuccess="clearSelectedItems" />
        </div>
        <div>
            <SharedUiCustomTable ref="trailerTable" show-select return-object :headers="trailerHeaders" :items="trailerList"
                >
                <!-- Slot to capture bulk actions -->
                <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                    <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                        <v-icon>mdi-printer</v-icon> Print
                    </v-btn>
                    <v-btn color="primary" class="text-none mr-2" @click="bulkUpdateTrailers(selectedItems)">
                        <v-icon>mdi-update</v-icon> Update
                    </v-btn>
                    <v-btn color="red" class="text-none mr-2" @click="bulkDeleteTrailers(selectedItems)">
                        <v-icon>mdi-delete</v-icon> Delete
                    </v-btn>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div>
                        <v-icon color="primary" dense @click="edittrailer(item)">mdi-pencil</v-icon>
                        <v-icon color="red" dense @click="deletetrailer(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
            </SharedUiCustomTable>
        </div>
    </div>
</template>

<style scoped></style>~/types/dispatch/location