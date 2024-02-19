<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useRateTypeStore } from '@/stores/settings/dispatch/rate_type'

const rateTypeStore = useRateTypeStore()
const { rateTypeList } = storeToRefs(rateTypeStore)

const headers = ref([
    { title: 'Code', key: 'code' ,width: '30%'},
])

</script>
<template>
    <SharedUiCustomTable :headers='headers' :items='rateTypeList'>
    </SharedUiCustomTable>
</template>
