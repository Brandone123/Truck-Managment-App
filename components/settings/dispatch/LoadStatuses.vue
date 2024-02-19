<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useLoadStatusStore } from '@/stores/settings/dispatch/load_status'

const loadStatusStore = useLoadStatusStore()
const { loadStatusList } = storeToRefs(loadStatusStore)

const loadStatusHeaders = ref([
    { title: 'Status ID', key: 'status_id' },
    { title: 'Allow Driver Updates', key: 'allow_driver_updates' },
    { title: 'Description', key: 'description' },
])

</script>
<template>
    <SharedUiCustomTable :headers="loadStatusHeaders" :items="loadStatusList">
        <template v-slot:item.allow_driver_updates="{ item }">
            <v-checkbox v-model="item.allow_driver_updates" color="primary" density="compact" :hide-details="true"></v-checkbox>
        </template>
    </SharedUiCustomTable>
</template>
