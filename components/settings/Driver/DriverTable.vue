<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useDriverStore } from '@/stores/settings/driver'
import { defineProps, defineEmits } from 'vue'
import type { DriverInfo } from '@/types/store/driver';

const driverStore = useDriverStore()
const { driverList, loading } = storeToRefs(driverStore)

onMounted(() => {
    driverStore.fetchDriverList();
});

const emit = defineEmits(['editDriverTemplate', 'deleteDriverTemplate'])
const driverTemplateHeaders = ref([
    { title: 'DRIVER ID ', key: 'id' },
    { title: 'EMPLOYEE ID', key: 'employee_id' },
    { title: 'CATEGORY', key: 'category' },
    { title: 'CDL EXPIRATION ', key: 'cdl_expiration' },
    { title: 'MVR DUE ', key: 'mvr_due' },
    { title: 'HAZMAT EXPIRATION', key: 'hazmat_expiration' },
    { title: 'PHYSICAL DUE', key: 'physical_due' },
    { title: 'ACTIONS', key: 'actions' },

])


const editTemplate = (item: DriverInfo) => {
    emit('editDriverTemplate', item)
}

const deleteTemplate = (driver_id: number) => {
    emit('deleteDriverTemplate', driver_id)
}


</script>
<template>
    <SharedUiCustomTable return-object :headers="driverTemplateHeaders"
        :items="driverList" :loading="loading">
        <template v-slot:item.actions="{ item }">
            <div>
                <v-icon color="primary" dense @click="editTemplate(item)">mdi-pencil</v-icon>
                <v-icon color="red" dense @click="deleteTemplate(item.id)">mdi-delete</v-icon>
            </div>
        </template>
    </SharedUiCustomTable>
</template>


<style scoped >
</style>