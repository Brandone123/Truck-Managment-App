<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useTrailerTypeStore } from '@/stores/settings/dispatch/trailer_type'

const trailerTypeStore = useTrailerTypeStore()
const { trailerTypeList } = storeToRefs(trailerTypeStore)

const trailerTypeHeaders = ref([
    { title: 'Type', key: 'type' },
    { title: 'Height', key: 'height' },
    { title: 'Length', key: 'length' },
    { title: 'Description', key: 'description' },
])

</script>
<template>
    <SharedUiCustomTable :headers="trailerTypeHeaders" :items="trailerTypeList">
    </SharedUiCustomTable>
</template>
