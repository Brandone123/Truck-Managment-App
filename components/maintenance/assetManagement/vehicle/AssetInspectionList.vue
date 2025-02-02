<template>
    <div>
        <InspectionEditDialog :modelValue="inspectionEditDialog" :inspection="selectedInspection"
            @update:modelValue="inspectionEditDialog = $event" @close="closeInspectionEditDialog"
            @save="saveInspection" />
        <v-card v-if="selectedAsset?.latest_inspections?.length > 0" class="mt-3">
            <div class="d-flex">
                <v-card-title class="text-h7 font-weight-bold text-primary">Vehicle Inspections</v-card-title>
                <v-btn color="primary" variant="text" density="compact" @click="addInspection"
                    class="ml-auto mr-2 mt-3 text-none" style="cursor: pointer; font-size: small">
                    <v-icon>mdi-plus</v-icon>Add Inspection
                </v-btn>
            </div>
            <v-card-text>
                <v-data-table :headers="tableHeaders" :items="selectedAsset.latest_inspections">

                    <template v-slot:item.id="{ item }">
                        #{{ item.id }}
                    </template>
                    <template v-slot:item.submitted_by_user="{ item }">
                        {{ item.submitted_by_user?.full_name }}
                    </template>
                    <template v-slot:item.status="{ item }">
                        <v-chip :color="getStatusColor(item.status)"> {{ item.status }} </v-chip>
                    </template>

                    <template v-slot:item.submitted_on="{ item }">
                        <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small">
                            {{ new Date(item.submitted_on).toLocaleDateString('en-US') }}
                            <v-tooltip activator="parent" location="top" location-strategy="connected">
                                {{ getRelativeDateTime(item.submitted_on) }}
                            </v-tooltip>
                        </span>
                    </template>
                </v-data-table>


            </v-card-text>
        </v-card>
        <v-card height="170" v-else class="mt-3">
            <div class="d-flex">
                <v-card-title class="text-h7 font-weight-bold text-primary">Vehicle Inspections</v-card-title>
                <v-btn color="primary" variant="text" density="compact" @click="addInspection"
                    class="ml-auto mr-2 mt-3 text-none" style="cursor: pointer; font-size: small">
                    <v-icon>mdi-plus</v-icon>Add Inspection
                </v-btn>
            </div>
            <div class="pa-5" style="font-size:small; color:grey; text-align: center;">
                <p>There are no Inspections due soon for this Vehicle</p>
            </div>
        </v-card>
    </div>


</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Inspection } from '@/types/maintenance/inspection';
import InspectionEditDialog from '../../preventiveManagement/inspection/InspectionEditDialog.vue';
import moment from 'moment';

// const props = defineProps({
// });

const assetStore = useAssetStore();
const { selectedAsset, loading } = storeToRefs(assetStore);

const inspectionStore = useInspectionStore();


const inspectionEditDialog = ref(false);

const selectedInspection = ref<Partial<Inspection>>({} as Partial<Inspection>);

const saveInspection = async (inspection: any) => {
    inspectionEditDialog.value = false;
    await inspectionStore.createInspection(inspection);
    // await inspectionStore.fetchInspections(searchQuery.value);
}

const closeInspectionEditDialog = () => {
    inspectionEditDialog.value = false;
};

const addInspection = () => {
    selectedInspection.value = {} as Partial<Inspection>;
    inspectionEditDialog.value = true;
}

const getRelativeDateTime = (dateString: any) => {
    return moment(dateString).from(moment());
}

const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
        case 'passed':
            return 'primary';
        case 'medium':
            return 'orange';
        case 'high':
            return 'error';
        case 'no priority':
            return 'gray';
        default:
            return 'gray';
    }
}



const tableHeaders = [
    { title: 'Inspection ID', key: 'id' },
    //   { title: 'Vehicle', key: 'vehicle_id' },
    { title: 'Submitted', key: 'submitted_on' },
    { title: 'Duration (Mins)', key: 'duration_minutes' },
    {
        title: 'Inspection Form',
        key: 'inspection_form.name',
    },
    {
        title: 'Submitted By',
        key: 'submitted_by_user',
    },
    { title: 'Status', key: 'status' },
];
</script>

<style scope></style>