<template>
    <div class="mt-5">
        <v-row>
            <v-col cols="12">
                <SharedUiCustomTable :loading="loading" :show-footer-in-head="false" :headers="headers"
                    :items="installationHistory">
                    <template v-slot:item.vehicle="{ item }">
                        <SharedTableDynamicVehicleItem v-if="item.vehicle" :vehicle="item.vehicle" />
                    </template>
                    <template v-slot:item.peformed_by="{ item }">
                        <SharedTableDynamicTechnicianItem v-if="item.peformed_by" :technician="item.peformed_by" />
                    </template>
                </SharedUiCustomTable>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { TireInstallation } from '@/types/maintenance/tireTypes';


const props = defineProps({
    installationHistory: {
        type: Array as PropType<any[]>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: false,
        default: false,
    }
})

const headers = [
    { title: 'Vehicle', key: 'vehicle' },
    { title: 'Installed By', key: 'peformed_by' },
    { title: 'Action Peformed', key: 'action' },
    { title: 'Date', key: 'action_date' },
];

</script>