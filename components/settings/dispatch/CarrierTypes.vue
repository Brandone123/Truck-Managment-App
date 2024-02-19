<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useCarrierTypeStore } from '@/stores/settings/dispatch/carrier_type'

const carrierTypeStore = useCarrierTypeStore()
const { carrierTypeList } = storeToRefs(carrierTypeStore)

const carrierTypeHeaders = ref([
    { title: 'Code', key: 'code' },
    { title: 'Description', key: 'description' },
])
</script>
<template>
    <SharedUiCustomTable :headers="carrierTypeHeaders" :items="carrierTypeList">
    </SharedUiCustomTable>
</template>
