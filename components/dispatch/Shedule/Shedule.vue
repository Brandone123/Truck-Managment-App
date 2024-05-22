<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoadStore } from '~/stores/settings/dispatch/load'
import { defineProps, defineEmits, ref } from 'vue'
import type { filterItem } from '@/types/layout/table'
import type { LoadInfo, StopInfo, CommodityInfo } from '~/types/dispatch/load'

const emit = defineEmits(['editLoad'])

const props = defineProps({
    status: {
        type: String,
        required: false,
    }
});

const loadStore = useLoadStore()
const { loadList: masterLoadList, loading: loadingLoads } = storeToRefs(loadStore)

const loadTypeStore = useLoadTypeStore()
const { loadTypeList } = storeToRefs(loadTypeStore)

const loadList = computed(() => {
    return masterLoadList.value.map((load: LoadInfo) => {
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
    { title: 'TRUCK', key: 'truck_id' },
    { title: 'TRAILER', key: 'trailer_id' },
    { title: 'DRIVER', key: 'driver.name' },
    { title: 'STATUS', key: 'Status' },
])

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

const filteredLoadList = computed(() => {
    if (!!props.status) {
        return loadList.value.filter(load => load.Status === props.status)
    }
    return loadList.value
})

const print = (items: Array<any>) => {
    // add print  logic
    console.log(items[0])
}

//edit load
const editLoad = (load: any) => {
    emit('editLoad', load);
}

const updateStatus = (item: any, newStatusValue: string) => {
    //implement logic to update status
    loadStore.updateLoad({...item, Status: newStatusValue});
}

</script>
<template>
    <SharedUiCustomTable return-object show-select :headers="loadHeaders" :items="loadList"
        :filters="filters" :loading="loadingLoads">

        <template v-slot:item.id="{ item }">
            <v-btn color="primary" variant="text" @click="editLoad(item)">{{ item.id }}</v-btn>
        </template>

        <template v-slot:item.truck_id="{ item }">
            <DispatchSheduleTruck :item="item"/>
        </template>

        <template v-slot:item.Status="{ item }">
            <v-select style="width:150px" @update:modelValue="updateStatus(item,$event)" hide-details variant="outlined" density="compact" :items="['Booked', 'Dispatched', 'Arrived']" v-model="item.Status"></v-select>
        </template>

        <!-- Slot to capture bulk actions -->
        <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
            <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                <v-icon>mdi-printer</v-icon> Print
            </v-btn>

            <DispatchBulkActionsAssignDriverTruckTrailer />

            <v-select class="ml-2" base-color="primary" color="primary" clearable style="width: 200px" dense
                hide-details variant="solo" flat density="compact" label="Update Status"
                :items="['cancelled', 'booked']">
            </v-select>
        </template>
    </SharedUiCustomTable>
</template>

<style scoped>
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