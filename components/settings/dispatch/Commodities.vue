<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useCommodityStore } from '@/stores/settings/dispatch/commodity'

const commodityStore = useCommodityStore()
const { commodityList } = storeToRefs(commodityStore)

const headers = ref([
    { title: 'Description', key: 'description' ,},
    { title: 'HazMat Code', key: 'hazmat_code' },
    { title: 'Class', key: 'class' },
    { title: 'Type', key: 'type' },
])

</script>
<template>
    <SharedUiCustomTable :headers='headers' :items='commodityList'>
    </SharedUiCustomTable>
</template>
