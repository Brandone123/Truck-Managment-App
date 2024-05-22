<script setup lang="ts">
import { ref } from 'vue';
import {useCarrierStore} from '@/stores/settings/dispatch/carrier'
import type { CarrierInfo } from '~/types/dispatch/carrier';

const carrierListStore = useCarrierStore()
const {carrierList, loading: carrierLoading} = storeToRefs(carrierListStore)

onMounted(() => {
    carrierListStore.fetchCarrierList()
})

const updatingCarrier = ref(false)
const carrierDialog = ref(false)

const layoutStore = useLayoutStore()

const carrierHeaders = ref([
    { title: 'CARRIER ID', key: 'id', class: "no-wrap" },
    { title: 'CARRIER NAME', key: 'name', class: "no-wrap"},
    { title: 'CARRIER EMAIL', key: 'contact_email', class: "no-wrap" },
    { title: 'ACTIONS', key: 'actions', class: "no-wrap" },
])

const defaultCarrier = ref<CarrierInfo>({
    id: null,
    name: null,
    contact_email: null,
});

const editedCarrier = ref(defaultCarrier.value)

const editCarrier = (carrier: CarrierInfo) => {
    editedCarrier.value = Object.assign({}, carrier)
    updatingCarrier.value = true
    carrierDialog.value = true
}

const updateCarriersDialog = (value: boolean) => {
    carrierDialog.value = value
    editedCarrier.value = defaultCarrier.value as CarrierInfo
    updatingCarrier.value = false
}

const deleteCarrier = async (carrier_Id: number) => {
    const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

    if (confirm) {
      carrierListStore.deleteCarrier(carrier_Id)
    }
}

const print = (selectedItems: Array<any>) => {
    // add print  logic
    console.log(selectedItems[0])
}

</script>

<template>
    <div>
        <div class="d-flex justify-space-between">
            <div></div>
            <SettingsDispatchCarrierDialog :show="carrierDialog"
                @update:show="updateCarriersDialog" :updating="updatingCarrier" :item="editedCarrier" />
        </div>
        <div>
            <SharedUiCustomTable ref="carrierTable" :loading="carrierLoading" show-select return-object :headers="carrierHeaders" :items="carrierList"
                >
                <!-- Slot to capture bulk actions -->
                <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                    <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                        <v-icon>mdi-printer</v-icon> Print
                    </v-btn>
                </template>

                <template v-slot:item.actions="{ item }">
                    <div>
                        <v-icon color="primary" dense @click="editCarrier(item)">mdi-pencil</v-icon>
                        <v-icon color="red" dense @click="deleteCarrier(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
            </SharedUiCustomTable>
        </div>
    </div>
</template>