<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useLoadStore } from '@/stores/tender'
// import { useLoadTypeStore } from '@/stores/settings/dispatch/tender_type'
// import { defineProps, defineEmits } from 'vue'


// const tenderStore = useLoadStore()
// const { LoadTender204List } = storeToRefs(tenderStore)

// const ediList = ref([
//     {
//         id: 1,
//         date_received: '2023-12-12 14:55',
//         receiver_id: '12345',
//         customer: 'John Smith',
//         reference: '56789',
//         off: '',
//         pu: '12/23',
//         shipper: 'GM Factory',
//         del: '12/25',
//         consignee: 'GM Pontiac',
//         stop: '',
//         comm: '',
//         status: 'Pending',
//         notes: 'Reference Number already exists'
//     },
//     {
//         id: 2,
//         date_received: '2023-12-12 14:55',
//         receiver_id: '12345',
//         customer: 'John Smith',
//         reference: '56789',
//         off: '',
//         pu: '12/23',
//         shipper: 'GM Factory',
//         del: '12/25',
//         consignee: 'GM Pontiac',
//         stop: '',
//         comm: '',
//         status: 'Cancelled',
//         notes: 'Reference Number already exists'
//     }
// ])

const LoadTenderList = ref([
    {
        id: 1,
        date_received: '2023-12-12 14:55',
        receiver_id: '12345',
        customer: 'John Smith',
        reference: '56789',
        off: '',
        pu: '12/23',
        shipper: 'GM Factory',
        del: '12/25',
        consignee: 'GM Pontiac',
        stop: '',
        comm: '',
        status: 'Pending',
        notes: 'Reference Number already exists'
    }
])

// const tenderTypeStore = useLoadTypeStore()
// const { tenderTypeList } = storeToRefs(tenderTypeStore)

const ediHeaders = ref([
    { title: 'Received', key: 'date_received' },
    { title: 'Receiver ID', key: 'receiver_id' },
    { title: 'Customer', key: 'customer' },
    { title: 'Ref', key: 'reference' },
    { title: 'Off', key: 'off' },
    { title: 'PU', key: 'pu' },
    { title: 'Shipper', key: 'shipper' },
    { title: 'Del', key: 'address' },
    { title: 'Consignee', key: 'consignee' },
    { title: 'Stop', key: 'stop' },
    { title: 'Comm', key: 'comm' },
    { title: 'Status', key: 'status' },
    { title: 'Notes', key: 'notes' },
])

// filter selection values for the displayed table
const filters = ref([
    {
        title: 'Status',
        key: 'status',
        width: '200px',
        items: ['Current']
    },
    // {
    //     title: 'Type',
    //     key: 'to',
    //     width: '200px',
    //     items: ['Load Tenders'],
    // },
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

const print = (items: Array<any>) => {
    // add print  logic
    console.log(items[0])
}

const sendNotifications = (items: Array<any>) => {
    // add send notification logic
}

</script>

<template>
    <SharedUiCustomTable return-object show-select dateSelectorKey="test" :items="LoadTenderList"
        :headers="ediHeaders" :filters="(filters as Array<any>)">

        <template v-slot:item.date_received="{ item }">
            <DispatchEdi204LoadInformation :item="item" :itemLabel="item.date_received" />
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
