<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useLoadReferenceStore } from '@/stores/settings/dispatch/load_reference'

const loadRefernceStore = useLoadReferenceStore()
const { loadReferenceList } = storeToRefs(loadRefernceStore)

const loadReferenceHeaders = ref([
    { title: 'Name', key: 'name' },
    { title: 'Description', key: 'description' },
    // {
    //     title: 'Include On',
    //     align: 'center',
    //     children: [
    { title: 'Invoice', value: 'invoice' },
    { title: 'Disp Conf', value: 'disp_conf' },
    { title: 'Trans Ag', value: 'trans_ag' },
    { title: 'EDI 210', value: 'edi_210' },
    { title: 'EDI 214', value: 'edi_214' },

    //     ],
    // },
    { title: 'TL', key: 'tl' },
])

</script>
<template>
    <SharedUiCustomTable density="compact" :headers="loadReferenceHeaders" :items="loadReferenceList">
        <template v-slot:item.invoice="{ item }">
            <v-checkbox v-model="item.invoice" density="compact" :hide-details="true"></v-checkbox>
        </template>
        <template v-slot:item.disp_conf="{ item }">
            <v-checkbox v-model="item.disp_conf" density="compact" :hide-details="true"></v-checkbox>
        </template>
        <template v-slot:item.trans_ag="{ item }">
            <v-checkbox v-model="item.trans_ag" density="compact" :hide-details="true"></v-checkbox>
        </template>
        <template v-slot:item.edi_210="{ item }">
            <v-checkbox v-model="item.edi_210" density="compact" :hide-details="true"></v-checkbox>
        </template>
        <template v-slot:item.edi_214="{ item }">
            <v-checkbox v-model="item.edi_214" density="compact" :hide-details="true"></v-checkbox>
        </template>
        <template v-slot:item.tl="{ item }">
            <v-checkbox v-model="item.tl" density="compact" :hide-details="true"></v-checkbox>
        </template>
    </SharedUiCustomTable>
</template>
