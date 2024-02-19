
<template>
    <v-dialog v-model="dialog" scrollable fullscreen>
        <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
                <v-icon>mdi-format-float-right</v-icon>
                From Template
            </v-list-item>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" density="compact">
                <v-btn icon="mdi-chevron-left" @click="previousWindow"
                    :disabled="activeWindow == 'load-template-list'"></v-btn>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <!-- <v-btn v-if="activeWindow == 'load-template-details'" class="text-none" color="yellow" variant="text"
                    @click="useTemplate(currentTemplate)">Use Template</v-btn> -->
                <DispatchUseTemplate :load="currentTemplate" @createLoad="createLoad"
                    v-if="activeWindow == 'load-template-details'" :dark="true"></DispatchUseTemplate>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-window v-model="activeWindow">

                    <!-- Load Template List -->
                    <v-window-item value="load-template-list">
                        <SharedUiCustomTable return-object show-select dateSelectorKey="pickup_date1"
                            :headers="loadTemplateHeaders" :items="formattedLoadTemplateList">
                            <template v-slot:item.actions="{ item }">
                                <!-- <v-menu open-on-hover>
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="primary" density="compact" v-bind="props" icon="mdi-dots-vertical">
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="viewTemplate(item)">
                                            <v-list-item-title>Preview</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="useTemplate(item)">
                                            <v-list-item-title>Use</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu> -->
                                <v-tooltip location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" icon flat color="transparent" @click="viewTemplate(item)">
                                            <v-icon color="primary">mdi-eye</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Preview</span>
                                </v-tooltip>
                                <!-- <v-tooltip location="bottom">
                                    <template v-slot:activator="{ props }"> -->
                                        <DispatchUseTemplate v-bind="props" :load="item" @createLoad="createLoad">
                                        </DispatchUseTemplate>
                                    <!-- </template>
                                    <span>Use Template</span>
                                </v-tooltip> -->
                            </template>
                        </SharedUiCustomTable>
                    </v-window-item>

                    <!-- Load Template Details -->
                    <v-window-item value="load-template-details">
                        <v-row>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-select readonly v-model="currentTemplate.customer_id" variant="solo" flat
                                    label="Customer" :items='[{ id: 1, name: "Customer 1" }, { id: 2, name: "Customer 2" }]'
                                    density="compact" item-title="name" item-value="id"></v-select>
                            </v-col>
                            <v-col cols="12" md="6" class="pb-0">
                                <v-select readonly v-model="currentTemplate.route_id" variant="solo" flat label="Route"
                                    :items='[{ id: 1, name: "1111" }, { id: 2, name: "1112" }]' density="compact"
                                    item-title="id" item-value="id"></v-select>
                            </v-col>
                        </v-row>

                        <SharedUiCustomTableVariant :headers="stopHeaders" :items="currentTemplate.stops" class="my-2">
                            <template v-slot:item.stop="{ item }">
                                <v-btn color="primary" variant="text" density="compact" class="text-none"
                                    @click="viewStopInfo(item)">
                                    {{ item.stop }}
                                </v-btn>
                            </template>
                        </SharedUiCustomTableVariant>
                    </v-window-item>

                    <!-- Stop Information -->
                    <v-window-item value="load-template-stop-details">
                        <v-row class="my-4">
                            <v-col cols="12" class="pb-0">

                                <v-row>
                                    <v-col cols="12" md="4" class="pb-0">
                                        <v-select v-model="currentStop.stop" variant="solo" flat label="Ship/Cons"
                                            :items='[{ text: "Shipper", value: "shipper" }, { text: "Consignee", value: "consignee" }]'
                                            density="compact" item-title="text" item-value="value"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="4" class="pb-0">
                                        <v-text-field v-model="currentStop.stop_number" variant="solo" flat type="number"
                                            label="Stop No" density="compact"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-divider></v-divider>
                            <v-col cols="12" class="pb-0">
                                <v-row>
                                    <v-col cols="12" md="12" class="pb-0">
                                        <v-select readonly v-model="currentStop.shipper" variant="solo" flat label="Company"
                                            :items='[{ id: 1, name: "team1" }, { id: 2, name: "team2" }]' item-value="id"
                                            item-title="name" density="compact"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="12" class="pb-0">
                                        <v-text-field readonly v-model="currentStop.address" variant="solo" flat
                                            label="Address" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3" class="pb-0">
                                        <v-text-field readonly v-model="currentStop.city" variant="solo" flat label="City"
                                            density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3" class="pb-0">
                                        <v-select readonly v-model="currentStop.state" variant="solo" flat
                                            :items="['state 1', 'state 2']" label="State" density="compact"></v-select>
                                    </v-col>
                                    <v-col cols="12" md="3" class="pb-0">
                                        <v-text-field readonly v-model="currentStop.zip" variant="solo" flat label="Zip"
                                            type="number" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3" class="pb-0">
                                        <v-select readonly v-model="currentStop.zone" variant="solo" flat :items="zoneList"
                                            item-title="code" item-value="id" label="Zone" density="compact"></v-select>
                                    </v-col>

                                    <v-col cols="12" md="4" class="pb-0">
                                        <v-text-field readonly v-model="currentStop.phone" variant="solo" flat label="Phone"
                                            density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4" class="pb-0">
                                        <v-text-field readonly v-model="currentStop.contact" variant="solo" flat
                                            label="Contact" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4" class="pb-0">
                                        <v-text-field readonly v-model="currentStop.reference" variant="solo" flat
                                            label="Reference" density="compact"></v-text-field>
                                    </v-col>
                                    <v-col cols="6" md="4" class="pb-0">
                                        <v-checkbox readonly v-model="currentStop.appointment_required"
                                            label="Appt Required" density="compact" color="primary"
                                            hide-details></v-checkbox>
                                    </v-col>
                                    <v-col cols="12" class="pb-0">
                                        <v-textarea readonly v-model="currentStop.notes" variant="solo" flat label="Notes"
                                            density="compact"></v-textarea>
                                    </v-col>
                                    <v-col cols="12" md="6" class="pb-0">
                                        <v-textarea readonly v-model="currentStop.location_notes" variant="solo" flat
                                            label="Location Notes" density="compact"></v-textarea>
                                    </v-col>
                                    <v-col cols="12" md="6" class="pb-0">
                                        <v-textarea readonly v-model="currentStop.directions" variant="solo" flat
                                            label="Directions" density="compact"></v-textarea>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-window-item>
                </v-window>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useLoadTemplateStore } from '@/stores/settings/dispatch/load_template'
import type { LoadInfo, StopInfo } from '@/types/store/load'
const emit = defineEmits(['useTemplate'])

const props = defineProps({
    status: {
        type: String,
        required: false,
    }
});

const loadStore = useLoadStore()
const loadTemplateStore = useLoadTemplateStore()
const { loadTemplateList } = storeToRefs(loadTemplateStore)

const dialog = ref(false)
const activeWindow = ref('load-template-list')
const currentTemplate = ref<LoadInfo>({})
const currentStop = ref<StopInfo>({})

const loadTemplateHeaders = ref([
    // { title: 'PRO NUMBER ', key: 'id' },
    { title: 'ROUTE ID ', key: 'route_id' },
    { title: 'CUSTOMER ', key: 'customer.name' },
    { title: 'CUSTOMER REF', key: 'customer_id' },
    // { title: 'PU DATETIME', key: 'pickup_date' },
    { title: 'PU ADDRESS', key: 'pickup_address' },
    { title: 'PU CITY', key: 'pickup_city' },
    { title: 'PU STATE', key: 'pickup_state' },
    { title: 'DEL ADDRESS', key: 'delivery_address' },
    { title: 'DEL CITY', key: 'delivery_city' },
    { title: 'DEL STATE', key: 'delivery_state' },
    // { title: 'DEL DATETIME', key: 'delivery_date' },
    { title: '', key: 'actions' },
    // { title: 'TRUCK', key: 'truck_id' },
    // { title: 'TRAILER', key: 'trailer_id' },
    // { title: 'DRIVER', key: 'driver.name' },
    // { title: 'STATUS', key: 'status' },

])

const stopHeaders = ref([
    { title: 'Stop', key: 'stop', sortable: false },
    { title: 'No', key: 'stop_number' },
    // { title: 'Av', key: 'available_from', sortable: false },
    // { title: 'Thru', key: 'available_through', sortable: false },
    // { title: 'From', key: 'time_from', sortable: false },
    // { title: 'To', key: 'time_to', sortable: false },
    { title: 'Appt', key: 'appointment_required', sortable: false },
    // { title: 'Appt Ref', key: 'appointment_reference', sortable: false },
    { title: 'Shipper', key: 'shipper', sortable: false },
    { title: 'Address', key: 'address', sortable: false },
    { title: 'City', key: 'city', sortable: false },
    { title: 'St', key: 'state', sortable: false },
    { title: 'Zip', key: 'zip', sortable: false },
    { title: 'Z', key: 'zone', sortable: false },
    // { title: 'MI', key: 'mi', sortable: false },
    { title: 'Reference', key: 'reference', sortable: false },
    // { title: '', key: 'actions', sortable: false }
])

const title = computed(() => {
    switch (activeWindow.value) {
        case 'load-template-details':
            return 'Load Template Details'
        case 'load-template-stop-details':
            return 'Stop Information'
        default:
            return 'Load Templates'
    }
})

const viewTemplate = (item: LoadInfo) => {
    currentTemplate.value = item
    activeWindow.value = 'load-template-details'
}

const createLoad = (item: LoadInfo) => {
    loadStore.createLoad(item)
    dialog.value = false
}

const useTemplate = (template: LoadInfo) => {
    let payload = Object.assign({}, template)
    emit('useTemplate', payload)
    dialog.value = false;
}

const viewStopInfo = (stop: StopInfo) => {
    currentStop.value = stop
    activeWindow.value = 'load-template-stop-details'
}

const previousWindow = () => {
    switch (activeWindow.value) {
        case 'load-template-details':
            activeWindow.value = 'load-template-list'
            currentTemplate.value = {}
            break;
        case 'load-template-stop-details':
            activeWindow.value = 'load-template-details'
            currentStop.value = {}
            break;
    }
}

const findLastIndex = (array: Array<any>, callback: Function) => {
    for (let i = array.length - 1; i >= 0; i--) {
        if (callback(array[i], i, array)) {
            return i;
        }
    }
    return -1;
}

const formattedLoadTemplateList = computed(() => {
    return loadTemplateList.value.map((item: LoadInfo) => {

        let data = {
            pickup_address: null,
            pickup_city: null,
            pickup_state: null,
            delivery_address: null,
            delivery_city: null,
            delivery_state: null,
        }

        if (Array.isArray(item.stops) && item.stops.length) {
            let shipper = item.stops[0]
            if ((shipper.stop || '').toLowerCase() == 'shipper') {
                data.pickup_address = shipper.address as any
                data.pickup_city = shipper.city as any
                data.pickup_state = shipper.state as any
            }

            if (item.stops.length > 1) {
                let consignee = item.stops[item.stops.length - 1]
                if ((consignee.stop || '').toLowerCase() == 'consignee') {
                    data.delivery_address = consignee.address as any
                    data.delivery_city = consignee.city as any
                    data.delivery_state = consignee.state as any
                }
            }
            return {
                ...item,
                ...data
            }
        }

        return item
    })

    const resetDialog: void = () => {
        activeWindow.value = 'load-template-list'
        currentTemplate.value = {}
        currentStop.value = {}
    }

    watch(dialog, (val) => {
        if (val) {
            resetDialog()
        }
    })
})

</script>

<style scoped >
.etaDisplay {
    color: #452c63;
    border: 2px solid #452c63;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, .15);
    backdrop-filter: blur(5px);
}

.mapContainer {
    width: 100%;
    aspect-ratio: 16 / 9;
}

.map {
    height: 100%;
    width: 100%;
}
</style>