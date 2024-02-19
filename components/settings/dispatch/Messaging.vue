<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useMessagingStore } from '@/stores/settings/dispatch/messaging'

const messagingStore = useMessagingStore()
const { messagingList } = storeToRefs(messagingStore)

const headers = ref([
    { title: 'Driver', key: 'driver.name' ,},
    { title: 'Cell', key: 'cell_phone' },
    { title: 'Email', key: 'email' },
    { title: 'GPS', key: 'gps' },
    { title: 'ID', key: 'driver_id' },
    { title: 'Mob Exp', key: 'mob_exp' },
    { title: 'Trucker ELD', key: 'trucker_eld' },
])

</script>
<template>
    <SharedUiCustomTable :headers='headers' :items='messagingList'>
    </SharedUiCustomTable>
</template>
