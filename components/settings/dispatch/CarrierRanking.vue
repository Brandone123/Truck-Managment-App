<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useCarrierRankingStore } from '@/stores/settings/dispatch/carrier_ranking'

const carrierRankingStore = useCarrierRankingStore()
const { carrierRankingList } = storeToRefs(carrierRankingStore)

const carrierRankingHeaders = ref([
    { title: 'Code', key: 'code' },
    { title: 'Order', key: 'order' },
    { title: 'Description', key: 'description' },
])

</script>
<template>
    <SharedUiCustomTable :headers="carrierRankingHeaders" :items="carrierRankingList">
    </SharedUiCustomTable>
</template>
