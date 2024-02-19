<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useLoadStore } from '@/stores/load'
import { defineProps, defineEmits } from 'vue'
import googleMaps from '@/composables/googleMaps'
import type { filterItem } from '@/types/layout/table'

const emit = defineEmits(['editLoad'])

const props = defineProps({
    status: {
        type: String,
        required: false,
    }
});

const commodityStore = useCommodityStore()


const loadStore = useLoadStore()
const { loadList } = storeToRefs(loadStore)

const loadTypeStore = useLoadTypeStore()
const { loadTypeList } = storeToRefs(loadTypeStore)

const getCommodityName = (commodity_id: number) => {
    return commodityStore.getCommodityById(commodity_id)?.description
}

const loadHeaders = ref([
    { title: 'PRO NUMBER ', key: 'id' },
    { title: 'CUSTOMER ', key: 'customer.name' },
    { title: 'ROUTE ID ', key: 'route_id' },
    { title: 'CUSTOMER REF', key: 'customer_id' },
    { title: 'PU DATETIME', key: 'pickup_date' },
    { title: 'PU ADDRESS', key: 'pickup_address' },
    { title: 'PU CITY', key: 'pickup_city' },
    { title: 'PU STATE', key: 'pickup_state' },
    { title: 'DEL ADDRESS', key: 'delivery_address' },
    { title: 'DEL CITY', key: 'delivery_city' },
    { title: 'DEL STATE', key: 'delivery_state' },
    { title: 'DEL DATETIME', key: 'delivery_date' },
    { title: 'TRUCK', key: 'truck_id' },
    { title: 'TRAILER', key: 'trailer_id' },
    { title: 'DRIVER', key: 'driver.name' },
    { title: 'STATUS', key: 'status' },

])

const expandedRows = ref([])
watch(expandedRows, (newVal, oldVal) => {
    if (newVal.length > oldVal.length) {
        let index = findNewArrayIndex(newVal, oldVal)
        if (index > -1) {
            let mapContainerID = 'map'// + index
            let zoomControlsContainerID = 'zoomControls'// + index
            waitForElement('#' + mapContainerID + index, (element: HTMLElement) => {
                let mapInstance = googleMaps()
                mapInstance.renderMap({
                    customButtons: [],
                    mapContainerID: mapContainerID,
                    zoomControlsContainerID: zoomControlsContainerID,
                    index: index.toString()
                })
            });
        }
    }
})

function waitForElement(selector: string, callback: Function) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 500); // Check every 500ms
    }
}

function findNewArrayIndex(arr1: any[], arr2: any[]) {
    for (let i = 0; i < arr1.length; i++) {
        if (!arr2.includes(arr1[i])) {
            return loadList.value.indexOf(arr1[i])
        }
    }
    return -1
}

// filter selection values for the displayed table
const filters = ref<filterItem[]>([
    {
        title: 'Shipment Type',
        key: 'shipment_type',
        items: [
            'FTL',
            'LTL'
        ],
        width: '200px'
    },
    // {
    //     title: 'Shipment Type',
    //     key: 'shipment_type',
    //     items: [
    //         {text: 'Full Truck Load', value: 'FTL'},
    //         {text: 'Less Than Truck Load', value: 'LTL'},
    //     ],
    //     width: '200px',
    // }
])

// const filteredLoadList = computed(() => {
//     if (!!props.status) {
//         return loadList.value.filter(load => load.status === props.status)
//     }
//     return loadList.value
// })

const filteredLoadList = computed(() => {
    if (!!props.status) {
        return loadList.value.filter(load => load.status === props.status)
    }
    return loadList.value
})

const print = (items: Array<any>) => {
    // add print  logic
    console.log(items[0])
}

const sendNotifications = (items: Array<any>) => {
    // add send notification logic
}

//edit load
const editLoad = (load: any) => {
    emit('editLoad', load);
}
</script>
<template>
    <SharedUiCustomTable return-object show-select dateSelectorKey="pickup_date1" :headers="loadHeaders" show-expand
        :items="loadList" :filters="filters" v-model:expanded="expandedRows">

        <template v-slot:item.id="{ item }">
            <v-btn color="primary" variant="text" @click="editLoad(item)">{{ item.id }}</v-btn>
        </template>
        <!-- Slot to capture bulk actions -->
        <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
            <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                <v-icon>mdi-printer</v-icon> Print
            </v-btn>

            <v-btn color="primary" class="text-none mr-2" @click="sendNotifications(selectedItems)">
                <v-icon>mdi-send</v-icon> Send Notification
            </v-btn>

            <DispatchBulkActionsAssignDriverTruckTrailer />

            <v-select class="ml-2" base-color="primary" color="primary" clearable style="width: 200px" dense hide-details
                variant="solo" flat density="compact" label="Update Status" :items="['cancelled', 'booked']">
            </v-select>
        </template>

        <template v-slot:expanded-row="{ columns, item, index, isExpanded }">
            <tr>
                <td :colspan="columns.length" style="height:100px;">
                    <v-card flat>
                        <v-card-text>

                            <v-row>
                                <v-col cols="12" md="3">
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-subtitle font-weight-bold">Stops</span>
                                        <!-- <DispatchVariant1AddStop :show="stopDialog" @update:show="updateStopDialog"
                                    :updating="updatingStop" :item="editedStop" /> -->
                                    </div>
                                    <div class="d-flex flex-column">
                                        <div class="d-flex mt-2 " v-for="(stop, i) in item.stops" :key="i">
                                            <div style="width: 90px;">{{ stop.available_from }}</div>
                                            <div class="d-flex flex-column mx-5">
                                                <v-badge color="primary" class="mt-2" :content="stop.stop_number"></v-badge>
                                                <div v-show="i + 1 < item.stops.length"
                                                    style="flex-grow: 1;width:1px;border-left: 2px dotted rgb(var(--v-theme-primary))">
                                                </div>
                                            </div>
                                            <div class="d-flex flex-column">
                                                <div variant="text"
                                                    style="cursor:pointer;color: rgb(var(--v-theme-primary))"
                                                    class="text-capitalize font-weight-bold" color="primary">
                                                    <span class="mr-2">{{ stop.address }}</span>
                                                </div>
                                                <div class=" d-flex flex-column ml-5 text-caption">
                                                    <div>Stop {{ stop.stop_number }}</div>
                                                    <div>Stop {{ stop.time_from }} - {{ stop.time_to }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-subtitle font-weight-bold">Commodities</span>
                                        <!-- <DispatchVariant1AddStop :show="stopDialog" @update:show="updateStopDialog"
                                    :updating="updatingStop" :item="editedStop" /> -->
                                    </div>
                                    <v-list lines="two" density="compact">
                                        <v-list-item v-for="(commodity, i) in item.commodities" :key="i">
                                            <v-list-item-title class="font-weight-bold">{{
                                                getCommodityName(commodity.commodity)
                                            }}</v-list-item-title>
                                            <!-- <v-list-item-subtitle>{{ commodity.description }}description goes
                                                here</v-list-item-subtitle> -->
                                        </v-list-item>
                                        <!-- <v-divider inset></v-divider> -->
                                    </v-list>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <div class="text-subtitle font-weight-bold test-caption">Driver</div>
                                    <div v-if="item.driver_id">
                                        <v-menu open-on-hover :close-on-content-click="false" location="end">
                                            <template v-slot:activator="{ props }">
                                                <v-btn color="primary" variant="text" v-bind="props"
                                                    class="px-0 text-none text-body-1 font-weight-bold py-0">
                                                    {{ item.driver.name }}
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
                                        <div class="text-caption font-weight-bold font-italic">({{ item.driver.phone }})
                                        </div>
                                    </div>
                                    <div v-else>
                                        <span class="text-error">Driver Not Assigned</span><br>
                                        <v-btn class="text-none" density="compact" color="primary">Assign Driver</v-btn>
                                    </div>


                                    <div class="text-subtitle  mt-4 font-weight-bold">Truck</div>
                                    <div v-if="item.truck_id">
                                        <v-menu open-on-hover :close-on-content-click="false" location="end">
                                            <template v-slot:activator="{ props }">
                                                <v-btn color="primary" variant="text" v-bind="props"
                                                    class="px-0 text-none text-body-1 font-weight-bold">
                                                    {{ item.truck_id }}
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
                                                                    <span class="text-subtitle font-weight-bold mr-2">Year
                                                                        of Manufacture: </span>
                                                                    <span class="text-subtitle-1"
                                                                        style="line-height: 1;">2013</span>
                                                                </p>
                                                                <p>
                                                                    <span class="text-subtitle font-weight-bold mr-2">Chasis
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
                                    </div>
                                    <div v-else>
                                        <span class="text-error">Truck Not Assigned</span><br>
                                        <v-btn class="text-none" density="compact" color="primary">Assign Truck</v-btn>
                                    </div>


                                    <div class="d-flex flex-column mt-4">
                                        <div class="text-subtitle font-weight-bold">Trailer</div>
                                        <div v-if="item.trailer_id" class="text-body-1 text-primary font-weight-bold">123456
                                        </div>
                                        <div v-else>
                                            <span class="text-error">Trailer Not Assigned</span><br>
                                            <v-btn class="text-none" density="compact" color="primary">Assign
                                                Trailer</v-btn>
                                        </div>
                                    </div>
                                </v-col>
                                <v-col cols="12" md="3" justify="center">
                                    <!-- <v-img src="/images/load_stops.png"></v-img> -->
                                    <!-- eta display -->
                                    <p class="font-weight-bold text-h6 d-flex justify-end">
                                        ETA: 4hrs 30mins
                                    </p>

                                    <div class="mapContainer">
                                        <div :id="'map' + index" class="map"></div>
                                        <!-- zoom controls -->
                                        <div :id="'zoomControls' + index" style="display:none !important"
                                            class="d-flex flex-column mr-4 mb-4">
                                            <v-btn density="compact" :id="'center' + index">
                                                <v-icon>mdi-crosshairs</v-icon>
                                            </v-btn>
                                            <v-btn density="compact" :id="'zoomIn' + index" class="my-3">
                                                <v-icon>mdi-plus</v-icon>
                                            </v-btn>
                                            <v-btn density="compact" :id="'zoomOut' + index">
                                                <v-icon>mdi-minus</v-icon>
                                            </v-btn>
                                        </div>
                                    </div>
                                    <!-- map container -->
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </td>
            </tr>
        </template>
    </SharedUiCustomTable>
</template>

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