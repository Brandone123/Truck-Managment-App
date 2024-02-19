<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useLoadStore } from '@/stores/tender'
// import { useLoadTypeStore } from '@/stores/settings/dispatch/tender_type'
import { defineProps, defineEmits } from 'vue'

const emit = defineEmits(['editLoadTender'])

const props = defineProps({
    status: {
        type: String,
        required: false,
    }
});

// const tenderStore = useLoadStore()
// const { LoadTender204List } = storeToRefs(tenderStore)

const LoadTender204List = ref([
{
    id:1234,
    post_date: '2023-11-11',
    bill_of_reference: 54321,
    status_date: '2023-11-12',
    status: 'AG',
    weight: '10000',
    pieces: '10',
    equipment: '',
    customer: '12344',
    address: '500 HALL ROAD',
    city: 'Woodhaven',
    state: 'MI',
    zip: '',

}
])

// const tenderTypeStore = useLoadTypeStore()
// const { tenderTypeList } = storeToRefs(tenderTypeStore)

const ediHeaders = ref([
    { title: 'Post DT', key: 'post_date' },
    { title: 'Load', key: 'id' },
    { title: 'Bill Of Ref', key: 'bill_of_reference' },
    { title: 'Status Date', key: 'status_date' },
    { title: 'Status', key: 'status' },
    { title: 'Weight', key: 'weight' },
    { title: 'Pieces', key: 'pieces' },
    { title: 'Equipment', key: 'equipment' },
    { title: 'Customer', key: 'customer' },
    { title: 'Address', key: 'address' },
    { title: 'City', key: 'city' },
    { title: 'St', key: 'state' },
    { title: 'Zip', key: 'zip' },
])

// filter selection values for the displayed table
const filters = ref([
    {
        title: 'From',
        key: 'from',
        width: '200px',
        type: 'date',
    },
    {
        title: 'To',
        key: 'to',
        width: '200px',
        type: 'date',
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
        return LoadTender204List.value.filter(tender => tender.status === props.status)
    }
    return LoadTender204List.value
})

const print = (items: Array<any>) => {
    // add print  logic
    console.log(items[0])
}

const sendNotifications = (items: Array<any>) => {
    // add send notification logic
}

//edit tender
const editLoadTender = (tender : any) => {
    emit('editLoadTender', tender);
}

</script>
<template>
    <SharedUiCustomTable return-object show-select dateSelectorKey="pickup_date" :headers="ediHeaders"
        :items="filteredLoadList">

        <template v-slot:item.post_date="{ item }">
            <DispatchEdi204LoadInformation :item="item" :itemLabel="item.post_date" />
        </template>

        <!-- Slot to capture bulk actions -->
        <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
            <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                <v-icon>mdi-printer</v-icon> Print
            </v-btn>

            <v-btn color="primary" class="text-none mr-2" @click="sendNotifications(selectedItems)">
                <v-icon>mdi-send</v-icon> Send Notification
            </v-btn>

            <v-select base-color="primary" color="primary" clearable style="width: 200px" dense hide-details variant="solo"
                flat density="compact" label="Update Status" :items="['cancelled', 'booked']"></v-select>
        </template>
    </SharedUiCustomTable>
</template>
