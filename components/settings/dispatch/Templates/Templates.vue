<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useLoadTemplateStore } from '@/stores/settings/dispatch/load_template'
import { defineProps, defineEmits } from 'vue'
import type { LoadInfo, StopInfo } from '@/types/store/load'
const emit = defineEmits(['editLoadTemplate', 'deleteLoadTemplate'])

const props = defineProps({
    status: {
        type: String,
        required: false,
    }
});

const loadTemplateStore = useLoadTemplateStore()
const { loadTemplateList } = storeToRefs(loadTemplateStore)

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

const print = (items: Array<any>) => {
    // add print  logic
    console.log(items[0])
}

const sendNotifications = (items: Array<any>) => {
    // add send notification logic
}

const editTemplate = (item: LoadInfo) => {
    emit('editLoadTemplate', item)
}

const deleteTemplate = (template_id: number) => {
    emit('deleteLoadTemplate', template_id)
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

        // const shipperIndex = item.stops ? item.stops.findIndex((stopItem: StopInfo) => (stopItem.stop || '').toLowerCase() === 'shipper') : -1
        // if (shipperIndex > -1 && Array.isArray(item.stops)) {
        //     data.pickup_address = item.stops[shipperIndex].address
        //     data.pickup_city = item.stops[shipperIndex].city
        //     data.pickup_state = item.stops[shipperIndex].state
        // }
        // const consinee_index = item.stops ? findLastIndex(item.stops, (stopItem: StopInfo) => (stopItem.stop || '').toLowerCase() === 'consignee') : -1
        // if (consignee_index > -1 && Array.isArray(item.stops)) {
        //     data.pickup_address = item.stops[shipperIndex].address
        //     data.pickup_city = item.stops[shipperIndex].city
        //     data.pickup_state = item.stops[shipperIndex].state
        // }
    })
})

</script>
<template>
    <SharedUiCustomTable return-object show-select dateSelectorKey="pickup_date1" :headers="loadTemplateHeaders"
        :items="formattedLoadTemplateList">
        <template v-slot:item.actions="{ item }">
            <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" density="compact" v-bind="props" icon="mdi-dots-vertical">
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="editTemplate(item)">
                        <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteTemplate(item.id)">
                        <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
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