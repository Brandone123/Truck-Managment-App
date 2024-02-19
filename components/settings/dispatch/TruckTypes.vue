<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useTruckTypeStore } from '@/stores/settings/dispatch/truck_type'

const truckTypeStore = useTruckTypeStore()
const { truckTypeList } = storeToRefs(truckTypeStore)

const truckTypeHeaders = ref([
    { title: 'Type', key: 'type' },
    { title: 'Description', key: 'description' },
])

</script>
<template>
    <SharedUiCustomTable :headers="truckTypeHeaders" :items="truckTypeList">
    </SharedUiCustomTable>
</template>
        