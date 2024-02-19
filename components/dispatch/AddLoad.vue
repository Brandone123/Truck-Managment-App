<template>
    <v-dialog v-model="dialog" fullscreen scrollable>
        <template v-slot:activator="{ props }">
            <v-list-item color="primary" flat v-bind="props" class="text-none">
                <!-- <v-icon>mdi-plus</v-icon> -->
                New Load
            </v-list-item>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" :title="title" density="compact">
                <v-spacer></v-spacer>
                <!-- <DispatchSelectTemplate @useTemplate="useTemplate" /> -->
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>

                <v-row>
                    <v-col cols="12" md="6" class="pb-0">
                        <v-select v-model="loadInfo.customer_id" variant="solo" flat label="Customer"
                            :items='[{ id: 1, name: "Customer 1" }, { id: 2, name: "Customer 2" }]' density="compact"
                            item-title="name" item-value="id"></v-select>
                    </v-col>
                    <v-col cols="12" md="6" class="pb-0">
                        <v-select v-model="loadInfo.route_id" variant="solo" flat label="Route"
                            :items='[{ id: 1, name: "1111" }, { id: 2, name: "1112" }]' density="compact" item-title="id"
                            item-value="id"></v-select>
                    </v-col>
                </v-row>

                <div class="d-flex justify-space-between mb-2">
                    <span class="text-h6 text-primary">Stops</span>
                    <DispatchAddStop :show="stopDialog" @update:show="updateStopDialog" :updating="updatingStop"
                        :item="editedStop" />
                </div>

                <SharedUiCustomTableVariant :headers="stopHeaders" :items="loadInfo.stops || []" class="mb-2">
                    <template v-slot:item.stop="{ item }">
                        <v-btn color="primary" variant="text" density="compact" class="text-none" @click="editStop(item)">{{
                            item.stop }}</v-btn>
                    </template>
                </SharedUiCustomTableVariant>

                <v-form ref="loadForm">
                    <v-row class="my-4" no-gutters>
                        <v-col cols="12" md="6" class="pa-4">
                            <div class="d-flex justify-space-between mb-2">
                                <span class="text-h6 text-primary">Billing</span>
                            </div>
                            <v-row style="border: 2px solid grey; border-radius:15px;">
                                <v-col cols="12" class="pb-0">
                                    <v-text-field v-model="loadInfo.bill" variant="solo" flat label="Bill"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" class="pb-0">
                                    <v-select v-model="loadInfo.bill_to_customer_id" variant="solo" flat label="Bill to"
                                        :items='[{ id: 1, name: "client 1" }, { id: 2, name: "client 2" }]' item-value="id"
                                        item-title="name" density="compact"></v-select>
                                </v-col>
                                <v-col cols="12" class="pb-0">
                                    <v-text-field v-model="loadInfo.reference" variant="solo" flat label="Reference"
                                        density="compact"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols="12" md="6" class="pa-4">
                            <div class="d-flex justify-space-between mb-2">
                                <span class="text-h6 text-primary">Billing Details</span>
                            </div>
                            <v-row style="border: 2px solid grey; border-radius:15px;">
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="loadInfo.bill_miles" variant="solo" flat label="Bill miles"
                                        type="number" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="loadInfo.received" variant="solo" flat label="Received"
                                        type="date" density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="loadInfo.release" variant="solo" flat label="Release" type="date"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-select v-model="loadInfo.team" variant="solo" flat label="Team"
                                        :items='[{ id: 1, name: "team1" }, { id: 2, name: "team2" }]' item-value="id"
                                        item-title="name" density="compact"></v-select>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-select v-model="loadInfo.type" variant="solo" flat label="Type"
                                        :items='[{ id: 1, name: "type 1" }, { id: 2, name: "type 2" }]' item-value="id"
                                        item-title="name" density="compact"></v-select>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-select v-model="loadInfo.trailer" variant="solo" flat label="Trailer"
                                        :items='[{ id: 1, name: "trailer 1" }, { id: 2, name: "trailer 2" }]'
                                        item-value="id" item-title="name" density="compact"></v-select>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="loadInfo.temp" variant="solo" flat label="Temp"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4" class="pb-0">
                                    <v-text-field v-model="loadInfo.seal_number" variant="solo" flat label="Seal No"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4" class="pb-0">
                                    <v-text-field v-model="loadInfo.pallets" variant="solo" flat label="Pallets"
                                        density="compact"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="2" class="pb-0">
                                    <v-checkbox v-model="loadInfo.exch" label="Exch" density="compact" color="primary"
                                        hide-details></v-checkbox>
                                </v-col>
                                <v-col cols="6" md="6" class="pb-0">
                                    <v-select v-model="loadInfo.salesman_id" variant="solo" flat label="Salesman"
                                        :items='[{ id: 1, name: "salesman 1" }, { id: 2, name: "salesman 2" }]'
                                        item-value="id" item-title="name" density="compact"></v-select>
                                </v-col>
                                <v-col cols="12" class="pb-0">
                                    <v-textarea v-model="loadInfo.notes" variant="solo" flat label="Notes"
                                        density="compact"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-form>

                <div class="d-flex justify-space-between mb-2">
                    <span class="text-h6 text-primary">Commodities</span>
                    <DispatchAddCommodity :show="commodityDialog" @update:show="updateCommodityDialog"
                        :updating="updatingCommodity" :item="editedCommodity" />
                </div>

                <SharedUiCustomTableVariant @editCommodity="editCommodity" :headers="commodityHeaders"
                    :items="loadInfo.commodities">
                    <template v-slot:item.commodity="{ item }">
                        <v-btn color="primary" variant="text" density="compact" class="text-none"
                            @click="editCommodity(item)">
                            {{ item.commodity }}
                        </v-btn>
                    </template>
                </SharedUiCustomTableVariant>

            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="save">
                    {{ saveButtonText }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoadStore } from '@/stores/load'
import { useLoadTypeStore } from '@/stores/settings/dispatch/load_type'
import { ref, computed, defineProps, defineEmits, toRefs, watch } from 'vue'
import type { LoadInfo, StopInfo, CommodityInfo } from '@/types/store/load'
import { v4 as uuidv4 } from 'uuid';

const emit = defineEmits(['update:show'])

// const props = defineProps({
//     item: {
//         type: Object,
//         required: false,
//     },
//     updating: {
//         type: Boolean,
//         default: false
//     },
//     show: {
//         type: Boolean,
//         default: false
//     }
// });
const loadStore = useLoadStore()
const commodityStore = useCommodityStore()

// const { item, updating, show } = toRefs(props);

const loadInfo = ref<LoadInfo>({})

const loadForm = ref(null)

const editedStop = ref<StopInfo>({});
const stopDialog = ref(false)
const updatingStop = ref(false)

const editedCommodity = ref<CommodityInfo>({});
const commodityDialog = ref(false)
const updatingCommodity = ref(false)

// const dialog = computed({
//     get() {
//         return props.show
//     },
//     set(newValue) {
//         emit('update:show', newValue);
//     }
// })

const dialog = ref(false)

const stopHeaders = ref([
    { title: 'Stop', key: 'stop', sortable: false },
    { title: 'No', key: 'stop_number' },
    { title: 'Av', key: 'available_from', sortable: false },
    { title: 'Thru', key: 'available_through', sortable: false },
    { title: 'From', key: 'time_from', sortable: false },
    { title: 'To', key: 'time_to', sortable: false },
    { title: 'Appt', key: 'appointment_required', sortable: false },
    { title: 'Appt Ref', key: 'appointment_reference', sortable: false },
    { title: 'Shipper', key: 'shipper', sortable: false },
    { title: 'Address', key: 'address', sortable: false },
    { title: 'City', key: 'city', sortable: false },
    { title: 'St', key: 'state', sortable: false },
    { title: 'Zip', key: 'zip', sortable: false },
    { title: 'Z', key: 'zone', sortable: false },
    { title: 'MI', key: 'mi', sortable: false },
    { title: 'Reference', key: 'reference', sortable: false },
])

const commodityHeaders = ref([
    { title: 'Commodity', key: 'commodity', sortable: false },
    { title: 'Ref', key: 'commodity_ref' },
    { title: 'Desc', key: 'description', sortable: false },
    { title: 'Wgt', key: 'weight', sortable: false },
    { title: 'Pcs', key: 'pieces', sortable: false },
    { title: 'Spc', key: 'specification', sortable: false },
    { title: 'Notes', key: 'specification_notes', sortable: false },
    // { title: 'Accessorial', key: 'accessorial', sortable: false },
    // { title: 'Ref', key: 'accessorial_reference', sortable: false },
    // { title: 'Rate', key: 'rate', sortable: false },
    // { title: 'Units', key: 'units', sortable: false },
    // { title: 'Amt', key: 'amount', sortable: false },
    // { title: 'Pay', key: 'pay', sortable: false },
    // { title: 'App', key: 'app', sortable: false },
    // { title: 'Notes', key: 'app_notes', sortable: false },
])

const title = computed(() => {
    // return props.updating ? 'Load Info' : 'Book Load'
    return 'Book Load'
})

const saveButtonText = computed(() => {
    // return props.updating ? 'update' : 'Save'
    return 'Save'
})


const save = () => {
    let payload = Object.assign({}, loadInfo.value)
    payload.id = uuidv4().substring(0, 8);
    loadStore.createLoad(payload)
    dialog.value = false
}

const useTemplate = (loadTemplate: LoadInfo) => {
    // Object.keys(loadTemplate).foreach(key =>{
    //     loadInfo[key] = loadTemplate[key]
    // })
    loadInfo.value = Object.assign({}, loadTemplate)
}

const editStop = (stop: any) => {
    editedStop.value = stop
    updatingStop.value = true
    stopDialog.value = true
}

const updateStopDialog = (value: any) => {
    stopDialog.value = value
    editedStop.value = {}
    updatingStop.value = false
}

const editCommodity = (stop: any) => {
    editedCommodity.value = stop
    updatingCommodity.value = true
    commodityDialog.value = true
}

const updateCommodityDialog = (value: any) => {
    commodityDialog.value = value
    editedCommodity.value = {}
    updatingCommodity.value = false
}

const getCommodityName = (commodity_id: number) => {
    return commodityStore.getCommodityById(commodity_id)?.description
}

const resetForm = () => {
    if (loadForm.value) {
        (loadForm.value as HTMLFormElement).reset(); // Reset the form
    }
}


watch(dialog, (val) => {
    // if (val && props.updating) {
    //     loadInfo.value = props.item
    // } else {
    // loadInfo.value = defaultLoad.value
    loadInfo.value = {}
    resetForm()
    // }
})
</script>