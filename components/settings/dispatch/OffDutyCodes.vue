<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
// import { useOffDutyCodeStore } from '@/stores/settings/dispatch/off_duty_code'

const offDutyCodeStore = useOffDutyCodeStore()
const { offDutyCodeList } = storeToRefs(offDutyCodeStore)

const headers = ref([
    { title: 'Code', key: 'code', width: '30%' },
    { title: 'Description', key: 'description' },
])

</script>
<template>
    <SharedUiCustomTable :headers='headers' :items='offDutyCodeList'>
    </SharedUiCustomTable>
</template>
