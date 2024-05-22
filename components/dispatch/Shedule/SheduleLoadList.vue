<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { defineProps, defineEmits, ref } from 'vue'
import type { filterItem } from '@/types/layout/table'
import type { LoadInfo, StopInfo } from '~/types/dispatch/load'
import type { LoadReservationInfo } from '~/types/dispatch/load_reservation';
import renderMap from '@/composables/renderMap'

const emit = defineEmits(['editLoad'])

const props = defineProps({
    filter: {
        type: String,
        required: false,
        default: ''
    }
});

const sheduleLoadStore = useScheduleLoadStore()
const { scheduleLoadList: masterLoadList, loading: loadingLoads } = storeToRefs(sheduleLoadStore)
const commodityStore = useCommodityStore()

const loadList = computed(() => {
    return masterLoadList.value.filter((item) => props.filter ? props.filter == item.Status : true)
        .map((load: LoadInfo) => {
            const pickup = load.stops ? load.stops[0] : {} as StopInfo
            const delivery = load.stops ? load.stops[load.stops.length - 1] : {} as StopInfo
            return {
                ...load,
                pickup_date: `${pickup?.earliest_date} ${pickup?.earliest_time}`,
                pickup_city: pickup?.location?.City,
                pickup_state: pickup?.location?.State,
                pickup_address: pickup?.location?.AddressLine,
                delivery_date: `${delivery?.earliest_date} ${delivery?.earliest_time}`,
                delivery_city: delivery?.location?.City,
                delivery_state: delivery?.location?.State,
                delivery_address: delivery?.location?.AddressLine,
            }
        })
})

const loadHeaders = ref([
    { title: 'PRO NUMBER ', key: 'id' },
    { title: 'CUSTOMER ', key: 'customer.name' },
    { title: 'ROUTE ID ', key: 'route_number' },
    { title: 'CUSTOMER REF', key: 'reference_number' },
    { title: 'PU DATETIME', key: 'pickup_date' },
    { title: 'PU ADDRESS', key: 'pickup_address' },
    { title: 'PU CITY', key: 'pickup_city' },
    { title: 'PU STATE', key: 'pickup_state' },
    { title: 'DEL ADDRESS', key: 'delivery_address' },
    { title: 'DEL CITY', key: 'delivery_city' },
    { title: 'DEL STATE', key: 'delivery_state' },
    { title: 'DEL DATETIME', key: 'delivery_date' },
    { title: 'DRIVER', key: 'current_driver_id' },
    { title: 'TRUCK', key: 'current_truck_id' },
    { title: 'TRAILER', key: 'current_trailer_id' },
    { title: 'STATUS', key: 'Status' },
    { title: 'ACTIONS', key: 'actions', sortable: false }
])

const carrierListStore = useCarrierStore()
const {carrierList} = storeToRefs(carrierListStore)

const employeeStore = useEmployeeStore()
const {employeeList} = storeToRefs(employeeStore)

// filter selection values for the displayed table
const filterLoad = ref<filterItem[]>([]);

function initializeFilters() {
  // Convertion of employeeList to filterItemOptionObject[] format
  const convertedEmployeeList = employeeList.value.map(item => ({
    value: item.id?.toString() ?? '',
    text: `${item.full_name ?? ''}`
  }));

  // Convertion of carrierList to filterItemOptionObject[] format
  const convertedCarrierList = carrierList.value.map(item => ({
    value: item.id?.toString() ?? '',
    text: item.name ?? ''
  }));

  filterLoad.value = [
    {
      title: 'Select Dispatcher',
      key: 'dispatcher_id',
      items: convertedEmployeeList,
      width: '300px',
    },
    {
      title: 'Select Carriers',
      key: 'carrier_id',
      items: convertedCarrierList,
      width: '300px'
    }
  ];
}

watchEffect(() => {
  if (employeeList.value && carrierList.value) {
    initializeFilters();
  }
});

const print = (items: Array<any>) => {
    // add print  logic
    console.log(items[0])
}

//edit load
const editLoad = (load: any) => {
    emit('editLoad', load);
}

const updateStatus = (load: LoadReservationInfo, statusUpdate: string) => {
    sheduleLoadStore.updateStatus({ id: load.id, Status: statusUpdate })
}

const itemRowBackground = (row: any) => {
    switch (row.item.Status) {
        case 'Booked':
            return { class: 'booked' };
        case 'Reserved':
            return { class: 'reserved' };
        case 'Dispatched':
            return { class: 'dispatched' };
        default:
            return { class: '' };
    }
}

const expandedRows = ref<LoadInfo[]>([])


function waitForElement(selector: string, callback: Function) {
    console.log('waiting for element')
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 500); // Check every 500ms
    }
}

const getCommodityName = (commodity_id: number) => {
    return commodityStore.getCommodityById(commodity_id)?.description
}

function getEdiMessages(load: LoadInfo, stop: StopInfo) {
    return load?.edi_communication?.filter((item: any) => item.stopSequenceNumber == stop?.sequence && !['990', '997'].includes(item.MessageType)) || []
}

const toLocalDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

const expand = (load: LoadInfo) => {
    let index = expandedRows.value.findIndex(item => item.id == load.id)
    if (index > -1) {
        expandedRows.value.splice(index, 1);
    } else {
        expandedRows.value.push(load);
       
        //rendering map
        let mapContainerID = 'map'
        let index = load.id

        console.log('about to wait for element')
        waitForElement('#' + mapContainerID + index, async (element: HTMLElement) => {
            console.log('element is available')
            var mapLoader: HTMLElement | null = document.getElementById('loader' + index);
            let mapinstance = await renderMap(load, mapContainerID, index.toString())

            //hide map loader once map is rendered
            if (mapLoader) {
                mapLoader.style.display = "none"
            }
        });
    }
}

const selectedItems = ref([])
</script>
<template>
    <SharedUiCustomTable class="custom-table" show-expand show-select v-model:expanded="expandedRows"
        :headers="loadHeaders" :items="loadList" :filters="filterLoad" :loading="loadingLoads"
        :row-props="itemRowBackground" items-per-page="30" v-model="selectedItems" return-object>

        <template v-slot:item.id="{ item }">
            <v-btn color="primary" variant="text" density="compact" class="custom-font-size" @click="editLoad(item)">{{
                item.id }}</v-btn>
        </template>

        <template v-slot:item.data-table-expand="{ item }">
          <v-icon v-if="item.Status == 'Dispatched'" @click="expand(item)">{{ expandedRows.includes(item) ?
                'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
        </template>

        <template v-slot:item.current_truck_id="{ item }">
            <DispatchSheduleTruck v-if="item.Status == 'Dispatched'" :item="item" />
            <span v-else>{{ item.current_truck_id }}</span>
        </template>

        <template v-slot:item.current_trailer_id="{ item }">
            <DispatchSheduleTrailer v-if="item.Status == 'Dispatched'" :item="item" />
            <span v-else>{{ item.current_trailer_id }}</span>
        </template>

        <template v-slot:item.current_driver_id="{ item }">
            <DispatchSheduleDriver v-if="item.Status == 'Dispatched'" :item="item" />
            <span v-else>{{ item.current_driver?.name }}</span>
        </template>

        <template v-slot:item.Status="{ item }">
            <v-select class="custom-select" density="compact" hide-details variant="outlined"
                :items="['Booked', 'Reserved', 'Dispatched']" v-model="item.Status"
                @update:modelValue="updateStatus(item, $event)"></v-select>
        </template>

        <!-- Slot to capture bulk actions -->
        <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
            <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                <v-icon>mdi-printer</v-icon> Print
            </v-btn>

            <v-btn color="primary" class="text-none mr-2" @click="">
                <!-- <v-icon>mdi-send</v-icon>  -->
                Manage
            </v-btn>
        </template>
        <template #item.actions="{ item }">
            <DispatchSheduleReservationDialog v-if="item.Status == 'Booked'" :item="item" />

            <DispatchSheduleDispatchDialog v-else-if="item.Status == 'Reserved'" :item="item" />
        </template>

        <template v-slot:expanded-row="{ columns, item, index, isExpanded }">
            <tr class="expanded-row">
                <td :colspan="columns.length" style="height:100px;" class="custom-td">
                    <v-card flat>
                        <v-card-text>
                            <v-row>

                                <!-- Stops  -->
                                <v-col cols="12" md="3">
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-subtitle font-weight-bold">Stops</span>
                                    </div>
                                    <div class="d-flex align-center" v-for="(stop, i) in item.stops" :key="i">
                                        <div class="d-flex" style="position:relative;">
                                            <div style="position:relative;" class="d-flex justify-center mr-5">
                                                <v-avatar style="z-index:2;" color="primary" size="small">
                                                    <span class="text-h6">{{ stop.sequence }}</span>
                                                </v-avatar>
                                                <div class="mb-n4" v-if="i < item.stops.length - 1"
                                                    style="position:absolute;top:0;bottom:0;width:2px; background-image: repeating-linear-gradient(to bottom, transparent, transparent 5px, rgb(var(--v-theme-primary)) 5px, rgb(var(--v-theme-primary)) 5px 10px);">
                                                </div>
                                            </div>
                                            <div class="d-flex">
                                                <v-card class="mb-5" style="min-width:300px;">
                                                    <v-card-text>
                                                        <p class="text-body">Address: {{ stop.location?.AddressLine }}
                                                        </p>
                                                        <p class="text-body">Date: {{ stop.earliest_date }}</p>
                                                        <p class="text-body">Time: {{ stop.earliest_time }} -
                                                            {{ stop.latest_time }}</p>
                                                    </v-card-text>
                                                    <v-expansion-panels density="compact" flat>
                                                        <v-expansion-panel>
                                                            <v-expansion-panel-title class="text-primary">
                                                                EDI Messages
                                                            </v-expansion-panel-title>
                                                            <v-expansion-panel-text>
                                                                <v-list>
                                                                    <v-list-item @click="" class="px-0"
                                                                        v-for="(message, index) in getEdiMessages(item, stop)"
                                                                        :key="'msg-' + index">
                                                                        <v-list-item-title>{{ message.MessageType
                                                                            }}</v-list-item-title>
                                                                        <v-list-item-subtitle>
                                                                            <span class="mr-1">Status:</span>
                                                                            {{ message.Status }}
                                                                            <span class="text-caption ml-4">({{
                                                                                toLocalDate(message.created_at)
                                                                                }})</span>
                                                                        </v-list-item-subtitle>
                                                                    </v-list-item>
                                                                </v-list>
                                                            </v-expansion-panel-text>
                                                        </v-expansion-panel>
                                                    </v-expansion-panels>
                                                </v-card>
                                            </div>
                                        </div>
                                    </div>
                                </v-col>


                                <!-- MAP -->
                                <v-col cols="12" md="3" justify="center">
                                    <!-- <v-img src="/images/load_stops.png"></v-img> -->
                                    <!-- eta display -->
                                    <p class="font-weight-bold text-h6 d-flex justify-end">
                                        ETA: 4hrs 30mins
                                    </p>

                                    <div class="mapContainer" style="position:relative">
                                        <v-overlay :id="'loader' + item.id" :model-value="true" contained
                                            class="align-center justify-center">
                                            <v-progress-circular :size="30" :width="5" color="primary"
                                                indeterminate></v-progress-circular>
                                        </v-overlay>
                                        <div :id="'map' + item.id" class="map"></div>
                                        <!-- zoom controls -->
                                        <div :id="'zoomControls' + item.id" style="display:none !important"
                                            class="d-flex flex-column mr-4 mb-4">
                                            <v-btn density="compact" :id="'center' + item.id">
                                                <v-icon>mdi-crosshairs</v-icon>
                                            </v-btn>
                                            <v-btn density="compact" :id="'zoomIn' + item.id" class="my-3">
                                                <v-icon>mdi-plus</v-icon>
                                            </v-btn>
                                            <v-btn density="compact" :id="'zoomOut' + item.id">
                                                <v-icon>mdi-minus</v-icon>
                                            </v-btn>
                                        </div>
                                    </div>
                                    <!-- map container -->
                                </v-col>

                                <!-- Diver/Truck/Trailer -->
                                <v-col cols="12" md="3">
                                    <div class="text-subtitle font-weight-bold test-caption">Driver</div>
                                    <div v-if="item.current_driver_id">
                                        <v-menu open-on-hover :close-on-content-click="false" location="end">
                                            <template v-slot:activator="{ props }">
                                                <v-btn color="primary" variant="text"  density="compact" v-bind="props"
                                                    class="px-0 text-none text-body-1 font-weight-bold py-0 custom-text">
                                                    {{ item.current_driver.name }}
                                                </v-btn>
                                            </template>
                                            <v-card style="width: 400px;">
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
                                                                <div class="text-subtitle font-weight-bold">License
                                                                    Number
                                                                </div>
                                                                <div class="text-subtitle-1" style="line-height: 1;">
                                                                    {{ item.current_driver?.license_number }}</div>
                                                            </div>
                                                            <div class="d-flex flex-column mt-3">
                                                                <div class="text-subtitle font-weight-bold">Status</div>
                                                                <div class="text-body-1 text-success">
                                                                    {{ item.current_driver?.samsara_status }}</div>
                                                            </div>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-menu>
                                        <div class="text-caption font-weight-bold font-italic">({{
                                            item.current_driver.phone }})
                                        </div>
                                    </div>

                                    <div class="text-subtitle  mt-4 font-weight-bold">Truck</div>
                                    <div v-if="item.current_truck_id">
                                        <v-menu open-on-hover :close-on-content-click="false" location="end">
                                            <template v-slot:activator="{ props }">
                                                <v-btn color="primary" variant="text" density="compact" v-bind="props"
                                                    class="px-0 text-none text-body-1 font-weight-bold py-0 custom-text">
                                                    {{ item.current_truck?.name }}
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
                                                                        class="text-subtitle font-weight-bold mr-2">VIN:</span>
                                                                    <span class="text-subtitle-1"
                                                                        style="line-height: 1;">{{
                                                                        item.current_truck?.vin
                                                                        }}</span>
                                                                </p>

                                                                <p>
                                                                    <span
                                                                        class="text-subtitle font-weight-bold mr-2">Model:</span>
                                                                    <span class="text-subtitle-1"
                                                                        style="line-height: 1;">{{ item.current_truck?.model
                                                                        }}</span>
                                                                </p>
                                                                <p>
                                                                    <span
                                                                        class="text-subtitle font-weight-bold mr-2">Year
                                                                        of Manufacture: </span>
                                                                    <span class="text-subtitle-1"
                                                                        style="line-height: 1;">{{
                                                                        item.current_truck?.year
                                                                        }}</span>
                                                                </p>
                                                                <p>
                                                                    <span
                                                                        class="text-subtitle font-weight-bold mr-2">serial:</span>
                                                                    <span class="text-subtitle-1"
                                                                        style="line-height: 1;">{{
                                                                        item.current_truck?.serial
                                                                        }}</span>
                                                                </p>
                                                            </div>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                            </v-card>
                                        </v-menu>
                                    </div>


                                    <div class="d-flex flex-column mt-4">
                                        <div class="text-subtitle font-weight-bold">Trailer</div>
                                        <div v-if="item.current_trailer_id">
                                            <v-menu open-on-hover :close-on-content-click="false" location="end">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn color="primary" variant="text" density="compact" v-bind="props"
                                                        class="px-0 text-none text-body-1 font-weight-bold py-0 custom-text">
                                                        {{ item.current_trailer?.name }}
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
                                                                            class="text-subtitle font-weight-bold mr-2">VIN:</span>
                                                                        <span class="text-subtitle-1"
                                                                            style="line-height: 1;">{{
                                                                            item.current_trailer?.vin
                                                                            }}</span>
                                                                    </p>

                                                                    <p>
                                                                        <span
                                                                            class="text-subtitle font-weight-bold mr-2">Model:</span>
                                                                        <span class="text-subtitle-1"
                                                                            style="line-height: 1;">{{ item.current_trailer?.model
                                                                            }}</span>
                                                                    </p>
                                                                    <p>
                                                                        <span
                                                                            class="text-subtitle font-weight-bold mr-2">Year
                                                                            of Manufacture: </span>
                                                                        <span class="text-subtitle-1"
                                                                            style="line-height: 1;">{{
                                                                            item.current_trailer?.year
                                                                            }}</span>
                                                                    </p>
                                                                    <p>
                                                                        <span
                                                                            class="text-subtitle font-weight-bold mr-2">serial:</span>
                                                                        <span class="text-subtitle-1"
                                                                            style="line-height: 1;">{{
                                                                            item.current_trailer?.serial }}</span>
                                                                    </p>
                                                                </div>
                                                            </v-col>
                                                        </v-row>
                                                    </v-card-text>
                                                </v-card>
                                            </v-menu>
                                        </div>

                                    </div>
                                </v-col>

                                <!-- Commodities -->
                                <v-col cols="12" md="3">
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-subtitle font-weight-bold">Commodities</span>
                                    </div>
                                    <v-list lines="two" density="compact">
                                        <v-list-item v-for="(commodity, i) in item.commodities" :key="i">
                                            <v-list-item-title class="font-weight-bold">{{
                                                getCommodityName(commodity.commodity)
                                                }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </td>
            </tr>
        </template>
    </SharedUiCustomTable>
</template>

<style scoped>
.custom-select {
    width: 100px;
    font-size: 12px !important;
}

.custom-font-size {
    font-size: 9px;
}

.custom-select :deep() .v-select__selection-text {
    font-size: 12px !important;
    font-weight: bold !important;
}

.custom-select :deep() .v-field__input {
    padding-left: 2px;
    padding-top: 2px;
    padding-bottom: 2px;
    min-height: 25px;
}

.custom-select :deep() .v-field {
    padding-right: 0;
}

.expanded-row :deep() div,
.custom-text {
    font-size: 10px !important;
}

.v-table.v-data-table :deep() tr>th {
    height: 25px !important;
    padding: 0 2px !important;
    font-size: 12px !important;
}

.v-table.v-data-table :deep() tr>td:not(:last-child) {
    height: 25px !important;
    padding: 0 2px !important;
    font-size: 12px !important;
}

tr :deep() .custom-td {
    padding: 0 0 !important;
}

/* 
--v-table-header-height: 40px;
    --v-table-row-height: 36px; */

.v-table.v-data-table :deep() .booked {
    background-color: #78c679 !important;
}

.v-table.v-data-table :deep() .reserved {
    background-color: #ffb74d !important;
}

.v-table.v-data-table :deep() .dispatched {
    background-color: #64b5f6 !important;
}

.v-table.v-data-table :deep() td,
.v-table.v-data-table :deep() th {
    background-color: transparent !important;
}


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