<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useZoneStore } from '@/stores/settings/dispatch/zone'

const zoneStore = useZoneStore()
const { zoneList } = storeToRefs(zoneStore)

const headers = ref([
    { title: 'Code', key: 'code' ,width: '30%'},
    { title: 'Description', key: 'description' },
])

</script>
<template>
    <SharedUiCustomTable :headers='headers' :items='zoneList'>
    </SharedUiCustomTable>
</template>
