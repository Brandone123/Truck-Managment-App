<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useLoadTypeStore } from '@/stores/settings/dispatch/load_type'

const loadTypeStore = useLoadTypeStore()
const { loadTypeList } = storeToRefs(loadTypeStore)

const loadTypeHeaders = ref([
    { title: 'Code', key: 'code' },
    { title: 'Description', key: 'description' },
])

</script>
<template>
    <SharedUiCustomTable :headers="loadTypeHeaders" :items="loadTypeList">
    </SharedUiCustomTable>
</template>
