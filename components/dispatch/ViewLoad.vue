<template>
    <v-dialog v-model="dialog" fullscreen scrollable>
        <!-- <template v-slot:activator="{ props }">
            <v-btn color="primary" flat v-bind="props" class="text-none">
                <v-icon>mdi-plus</v-icon>
                Create New Load
            </v-btn>
        </template> -->
        <v-card class="grey-background">
            <v-toolbar color="primary" density="compact">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <DispatchLoad />
                <v-btn icon @click="dialog = false" class="ml-5">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <div id="mapContainer">
                <!-- map container -->
                <div id="map"></div>

                <!-- zoom controls -->
                <div id="zoomControls" style="display:none !important;" class="d-flex flex-column mr-4 mb-4">
                    <v-btn density="compact" id="center">
                        <v-icon>mdi-crosshairs</v-icon>
                    </v-btn>
                    <v-btn density="compact" id="zoomIn" class="my-3">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn density="compact" id="zoomOut">
                        <v-icon>mdi-minus</v-icon>
                    </v-btn>
                </div>

                <!-- eta display -->
                <span id="etaDisplay" class="etaDisplay text-h4 font-weight-bold mr-4 mt-4" style="display:none !important">
                    ETA: 4hrs 30mins
                </span>

                <!-- load details  -->
                <div id="detailsDisplay" :style="{ width: showDetails ? '50%' : '100px' }"
                    style="height:100%;overflow:auto;" class="ml-4 mt-4">
                    <div class="d-flex justify-space-between" style="z-index:2;position:sticky;top:0px;right:0px;">
                        <v-btn @click="showDetails = !showDetails" density="compact" color="primary"
                            :icon="showDetails ? 'mdi-chevron-left' : 'mdi-chevron-right'"></v-btn>
                    </div>

                    <v-expand-x-transition>
                        <div v-if="showDetails">
                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Stops</span>
                                        <DispatchAddStop :show="stopDialog" @update:show="updateStopDialog"
                                            :updating="updatingStop" :item="editedStop" />
                                    </div>
                                    <v-row>
                                        <v-col cols="12" md="6" v-if="Array.isArray(loadInfo.stops)">
                                            <div class="d-flex flex-column">
                                                <div class="d-flex mt-2 " v-for="(item, i) in loadInfo.stops" :key="i">
                                                    <div style="width: 90px;">{{ item.available_from }}</div>
                                                    <div class="d-flex flex-column mx-5">
                                                        <v-badge color="primary" class="mt-2"
                                                            :content="String(item.stop_number)"></v-badge>
                                                        <div v-show="i + 1 < loadInfo.stops.length"
                                                            style="flex-grow: 1;width:1px;border-left: 2px dotted rgb(var(--v-theme-primary))">
                                                        </div>
                                                    </div>
                                                    <div class="d-flex flex-column">
                                                        <div variant="text"
                                                            style="cursor:pointer;color: rgb(var(--v-theme-primary))"
                                                            class="text-capitalize font-weight-bold" color="primary"
                                                            @click="editStop(item)">
                                                            <span class="mr-2">{{ item.address }}</span>
                                                            <DispatchCheckCallDialog />
                                                        </div>
                                                        <div class=" d-flex flex-column ml-5 text-caption">
                                                            <div>Stop {{ item.stop_number }}</div>
                                                            <div>Stop {{ item.time_from }} - {{ item.time_to }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>
                                        <v-col>

                                            <div class="text-subtitle font-weight-bold">Driver</div>
                                            <v-menu open-on-hover v-model="driverMenu" :close-on-content-click="false"
                                                location="end">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn color="primary" variant="text" v-bind="props"
                                                        class="px-0 text-none text-body-1 font-weight-bold">
                                                        John Doe
                                                    </v-btn>
                                                </template>
                                                <v-card style="max-with: 400px;">
                                                    <v-card-text>
                                                        <v-row>
                                                            <v-col cols="12" md="4">
                                                                <v-avatar size="100">
                                                                    <v-img src="https://cdn.vuetifyjs.com/images/john.jpg"
                                                                        alt="John">
                                                                        <template v-slot:placeholder>
                                                                            <div
                                                                                class="d-flex align-center justify-center fill-height">
                                                                                <v-progress-circular color="grey-lighten-4"
                                                                                    indeterminate></v-progress-circular>
                                                                            </div>
                                                                        </template>
                                                                    </v-img>
                                                                </v-avatar>
                                                            </v-col>
                                                            <v-col cols="12" md="8">
                                                                <div class="d-flex flex-column">
                                                                    <div class="text-subtitle font-weight-bold">Address
                                                                    </div>
                                                                    <div class="text-subtitle-1" style="line-height: 1;">
                                                                        1234 Arlington Lane MI tX</div>
                                                                </div>
                                                                <div class="d-flex flex-column mt-3">
                                                                    <div class="text-subtitle font-weight-bold">Status</div>
                                                                    <div class="text-body-1 text-success">
                                                                        Active</div>
                                                                </div>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-text>
                                                </v-card>
                                            </v-menu>
                                            <div class="text-caption">(+123456789)</div>



                                            <div class="text-subtitle  mt-3 font-weight-bold">Truck</div>
                                            <v-menu open-on-hover v-model="truckMenu" :close-on-content-click="false"
                                                location="end">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn color="primary" variant="text" v-bind="props"
                                                        class="px-0 text-none text-body-1 font-weight-bold">
                                                        123456
                                                    </v-btn>
                                                </template>
                                                <v-card style="width: 500px;">
                                                    <v-card-text>
                                                        <v-row>
                                                            <v-col cols="12" md="4">
                                                                <v-img max-width="200"
                                                                    src="https://www.sotrex.com/media/catalog/product/cache/1/thumbnail/225x/17f82f742ffe127f42dca9de82fb58b1/c/n/cn12egj_-_1_1.jpg"
                                                                    alt="John">
                                                                    <template v-slot:placeholder>
                                                                        <div
                                                                            class="d-flex align-center justify-center fill-height">
                                                                            <v-progress-circular color="grey-lighten-4"
                                                                                indeterminate></v-progress-circular>
                                                                        </div>
                                                                    </template>
                                                                </v-img>
                                                            </v-col>
                                                            <v-col cols="12" md="8">
                                                                <div class="d-flex flex-column">
                                                                    <p>
                                                                        <span
                                                                            class="text-subtitle font-weight-bold mr-2">Manufacturer:</span>
                                                                        <span class="text-subtitle-1"
                                                                            style="line-height: 1;">Volvo</span>
                                                                    </p>
                                                                    <p>
                                                                        <span
                                                                            class="text-subtitle font-weight-bold mr-2">Model:</span>
                                                                        <span class="text-subtitle-1"
                                                                            style="line-height: 1;">FH500</span>
                                                                    </p>
                                                                    <p>
                                                                        <span
                                                                            class="text-subtitle font-weight-bold mr-2">Year
                                                                            of Manufacture: </span>
                                                                        <span class="text-subtitle-1"
                                                                            style="line-height: 1;">2013</span>
                                                                    </p>
                                                                    <p>
                                                                        <span
                                                                            class="text-subtitle font-weight-bold mr-2">Chasis
                                                                            Number:</span>
                                                                        <span class="text-subtitle-1"
                                                                            style="line-height: 1;">YV2AG30C6DB652729</span>
                                                                    </p>
                                                                    <p>
                                                                        <span
                                                                            class="text-subtitle font-weight-bold mr-2">Model:</span>
                                                                        <span class="text-subtitle-1"
                                                                            style="line-height: 1;">FH500</span>
                                                                    </p>
                                                                </div>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-text>
                                                </v-card>
                                            </v-menu>


                                            <div class="d-flex flex-column mt-3">
                                                <div class="text-subtitle font-weight-bold">Trailer</div>
                                                <div class="text-body-1 text-primary font-weight-bold">123456</div>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Commodites</span>
                                        <div>
                                            <DispatchAddCommodity :show="commodityDialog"
                                                @update:show="updateCommodityDialog" :updating="updatingCommodity"
                                                :item="editedCommodity" />
                                            <v-btn class="ml-3" density="compact" color="primary" variant="text"
                                                @click="showCommodityInfo = !showCommodityInfo" :icon='showCommodityInfo
                                                    ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                        </div>

                                    </div>
                                    <v-expand-y-transition>
                                        <div class="mt-3" v-if="showCommodityInfo">
                                            <v-list lines="two" density="compact">
                                                <v-list-item v-for="(item, i) in loadInfo.commodities" :key="i"
                                                    @click="editCommodity(item)">
                                                    <v-list-item-title class="text-primary font-weight-bold">{{
                                                        item.commodity != null ? getCommodityName(item.commodity) :
                                                        'Unknown'
                                                    }}</v-list-item-title>
                                                    <v-list-item-subtitle>{{ item.description }}description goes
                                                        here</v-list-item-subtitle>
                                                </v-list-item>
                                                <!-- <v-divider inset></v-divider> -->
                                            </v-list>
                                        </div>
                                    </v-expand-y-transition>

                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Telematics</span>
                                        <div>
                                            <DispatchVideoFeed />
                                            <v-btn class="ml-3" density="compact" color="primary" variant="text"
                                                @click="showTelematicsInfo = !showTelematicsInfo" :icon='showTelematicsInfo
                                                    ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                        </div>

                                    </div>
                                    <v-expand-y-transition>
                                        <div class="d-flex flex-column mt-3" v-if="showTelematicsInfo">
                                            <div class="d-flex mb-2">
                                                <span class="mr-2"><v-icon class="mr-2">mdi-speedometer</v-icon>Speed
                                                    :</span>
                                                <span class="font-weight-bold">98 km/h</span>
                                            </div>

                                            <div class="d-flex mb-2">
                                                <span class="mr-2"><v-icon class="mr-2">mdi-thermometer-lines</v-icon>Engine
                                                    Temp
                                                    :</span>
                                                <span class="font-weight-bold">140 <sup>O</sup>C</span>
                                            </div>
                                        </div>
                                    </v-expand-y-transition>
                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Incidents on the route</span>
                                        <v-btn density="compact" color="primary" variant="text"
                                            @click="showIncidentInfo = !showIncidentInfo" :icon='showIncidentInfo
                                                ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                    </div>
                                    <v-expand-y-transition>
                                        <div class="d-flex flex-column mt-3" v-if="showIncidentInfo">
                                            <div class="d-flex flex-column mb-2">
                                                <div class="mr-2 text-h6 font-weight-bold"><v-icon class="mr-2" size="12"
                                                        color="red">mdi-circle-slice-8</v-icon>There is no voltage at the
                                                    PSN
                                                    input
                                                </div>
                                                <div class="text-caption ml-5">21.2 KW Recorded at 00:44</div>
                                                <v-btn color="primary" density="comfortable" style="width: 200px;"
                                                    class="">More
                                                    Details</v-btn>
                                            </div>
                                        </div>
                                    </v-expand-y-transition>

                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Billing Info</span>
                                        <v-btn density="compact" color="primary" variant="text"
                                            @click="showBillingInfo = !showBillingInfo" :icon='showBillingInfo
                                                ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                    </div>
                                    <v-expand-y-transition>
                                        <div class="mt-3" v-if="showBillingInfo">
                                            <v-row>
                                                <v-col cols="12" class="pb-0">
                                                    <v-text-field v-model="loadInfo.bill" variant="outlined" flat
                                                        label="Bill" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" class="pb-0">
                                                    <v-select v-model="loadInfo.bill_to_customer_id" variant="outlined" flat
                                                        label="Bill to"
                                                        :items='[{ id: 1, value: "client 1" }, { id: 2, value: "client 2" }]'
                                                        item-value="id" item-titie="name" density="compact"></v-select>
                                                </v-col>
                                                <v-col cols="12" class="pb-0">
                                                    <v-text-field v-model="loadInfo.reference" variant="outlined" flat
                                                        label="Reference" density="compact"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-expand-y-transition>

                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Billing Details</span>
                                        <v-btn density="compact" color="primary" variant="text"
                                            @click="showLoadInfo = !showLoadInfo" :icon='showLoadInfo
                                                ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                    </div>
                                    <v-expand-y-transition>
                                        <div class="mt-3" v-if="showLoadInfo">
                                            <v-row>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.bill_miles" variant="outlined" flat
                                                        label="Bill miles" type="number" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.received" variant="outlined" flat
                                                        label="Received" type="date" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.release" variant="outlined" flat
                                                        label="Release" type="date" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-select v-model="loadInfo.team" variant="outlined" flat label="Team"
                                                        :items='[{ id: 1, name: "team1" }, { id: 2, name: "team2" }]'
                                                        item-value="id" item-title="name" density="compact"></v-select>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-select v-model="loadInfo.type" variant="outlined" flat label="Type"
                                                        :items='[{ id: 1, name: "type 1" }, { id: 2, name: "type 2" }]'
                                                        item-value="id" item-title="name" density="compact"></v-select>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-select v-model="loadInfo.trailer" variant="outlined" flat
                                                        label="Trailer"
                                                        :items='[{ id: 1, name: "trailer 1" }, { id: 2, name: "trailer 2" }]'
                                                        item-value="id" item-title="name" density="compact"></v-select>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.temp" variant="outlined" flat
                                                        label="Temp" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.seal_number" variant="outlined" flat
                                                        label="Seal No" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="6" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.pallets" variant="outlined" flat
                                                        label="Pallets" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="6" md="2" class="pb-0">
                                                    <v-checkbox v-model="loadInfo.exch" label="Exch" density="compact"
                                                        color="primary" hide-details></v-checkbox>
                                                </v-col>
                                                <v-col cols="6" md="6" class="pb-0">
                                                    <v-select v-model="loadInfo.salesman_id" variant="outlined" flat
                                                        label="Salesman"
                                                        :items='[{ id: 1, name: "salesman 1" }, { id: 2, name: "salesman 2" }]'
                                                        density="compact" item-value="id" item-title="name"></v-select>
                                                </v-col>
                                                <v-col cols="12" class="pb-0">
                                                    <v-textarea v-model="loadInfo.notes" variant="outlined" flat
                                                        label="Notes" density="compact"></v-textarea>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-expand-y-transition>
                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Activity Logs</span>
                                        <v-btn density="compact" color="primary" variant="text"
                                            @click="showLogs = !showLogs" :icon='showLogs
                                                ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                    </div>
                                    <v-expand-y-transition>
                                        <div class="mt-3" v-if="showLogs">

                                        </div>
                                    </v-expand-y-transition>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-expand-x-transition>
                </div>
            </div>


        </v-card>
    </v-dialog>
</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia'
// import { useCommodityStore } from '@/stores/settings/dispatch/commodity'
import { ref, computed, defineProps, defineEmits, toRefs, watch, onMounted } from 'vue'
import type { LoadInfo, StopInfo, CommodityInfo } from '@/types/store/load'
import googleMaps from '@/composables/googleMaps'

const emit = defineEmits(['update:show'])

const props = defineProps({
    item: {
        type: Object as () => LoadInfo,
        required: false,
    },
    updating: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    }
});

const commodityStore = useCommodityStore()

const { item, updating, show } = toRefs(props);

const showDetails = ref(true)
const showBillingInfo = ref(false)
const showLoadInfo = ref(false)
const showTelematicsInfo = ref(true)
const showIncidentInfo = ref(false)
const showCommodityInfo = ref(false)
const showLogs = ref(false)

const driverMenu = ref(false)
const truckMenu = ref(false)

const mounted = ref(false)

const defaultLoad = ref<LoadInfo>({
    // id: null,
    // status: null,
    // bill: null,
    // bill_to_customer_id: null,
    // // reference: null,
    // bill_miles: null,
    // received: null,
    // release: null,
    // team: null,
    // type: null,
    // trailer: null,
    // temp: null,
    // seal_number: null,
    // pallets: null,
    // exch: null,
    // salesman: null,
    // notes: null,
    // route_id: null,
    // route: {
    //     id: null,
    //     name: null,
    //     stops: [] as StopInfo[]
    // },
    // commodities: [] as CommodityInfo[],
})

const loadInfo = ref(defaultLoad.value)

const editedStop = ref({});
const stopDialog = ref(false)
const updatingStop = ref(false)

const defaultCommodity = ref<CommodityInfo>({
    id: null,
    matrix: null,
    commodity: null,
    reference: null,
    description: null,
    notes: null,
    actual_weight: null,
    tarrif_weight: null,
    as_weight: null,
    pieces: null,
    space: null,
    seats: null,
    value: null,
    measure: null,
    length: null,
    width: null,
    height: null,
    volume: null,
    stackable: false,
    floor_board: false,
})

const editedCommodity = ref(defaultCommodity.value)

const commodityDialog = ref(false)
const updatingCommodity = ref(false)

const dialog = computed({
    get() {
        return props.show
    },
    set(newValue) {
        emit('update:show', newValue);
    }
})

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
    return props.updating ? 'Load Info (Load #1234, Route #F212)' : 'Book Load'
})

const saveButtonText = computed(() => {
    return props.updating ? 'update' : 'Save'
})

const dispatchLoad = () => {
    console.log('dispatching load')
}

const Load = () => {
    console.log('dispatching load')
}

const editStop = (stop: object) => {
    editedStop.value = stop
    updatingStop.value = true
    stopDialog.value = true
}

const updateStopDialog = (value: boolean) => {
    stopDialog.value = value
    editedStop.value = {}
    updatingStop.value = false
}

const editCommodity = (commodity: CommodityInfo) => {
    editedCommodity.value = commodity
    updatingCommodity.value = true
    commodityDialog.value = true
}

const updateCommodityDialog = (value: boolean) => {
    commodityDialog.value = value
    editedCommodity.value = defaultCommodity.value
    updatingCommodity.value = false
}

const getCommodityName = (commodity_id: number) => {
    return commodityStore.getCommodityById(commodity_id)?.description
}

onMounted(() => {
    mounted.value = true
})

watch(dialog, (val) => {
    if (val) {
        showDetails.value = true
        if (props.updating) {
            loadInfo.value = props.item as LoadInfo
        }

        if (mounted.value) {
            let mapInstance = googleMaps()
            mapInstance.renderMap({
                customButtons: [{ id: 'etaDisplay', position: 'RIGHT_TOP' }, { id: 'detailsDisplay', position: 'LEFT_TOP' }],
                mapContainerID: 'map',
                zoomControlsContainerID: 'zoomControls',
                index: '',
            })
        }

    } else {
        loadInfo.value = defaultLoad.value
    }
})
</script>

<style scoped>
.etaDisplay {
    color: #452c63;
    border: 2px solid #452c63;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, .15);
    backdrop-filter: blur(5px);
}

#mapContainer {
    height: calc(100vh - 48px) !important;
    position: relative;
    overflow-y: auto !important;
}

#map {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
