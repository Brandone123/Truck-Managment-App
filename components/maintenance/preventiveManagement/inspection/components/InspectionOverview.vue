<template>
    <v-row>
        <v-col :cols="showSidePanel ? 12 : 6">
            <v-card>
                <v-card-title class="font-weight-bold">Inspection Details</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">Vehicle</v-col>
                        <v-col cols="12" md="6">
                            <SharedTableDynamicVehicleItem :vehicle="inspection.vehicle" v-if="inspection.vehicle" />
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Inspection Form</v-col>
                        <v-col cols="12" md="6">{{ inspection.inspection_form?.name }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Started</v-col>
                        <v-col cols="12" md="6">{{
                            new Date(inspection.started_on).toLocaleDateString('en-US', {
                                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                                second: '2-digit', hour12: true
                            }) }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Submitted</v-col>
                        <v-col cols="12" md="6">{{ new Date(inspection.submitted_on).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                            second: '2-digit', hour12: true
                        }) }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Duration (Mins)</v-col>
                        <v-col cols="12" md="6">
                            {{ inspection?.duration_minutes }} {{ ('(Mins)') }}
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Submitted By</v-col>
                        <v-col cols="12" md="6">
                            <SharedTableDynamicTechnicianItem :technician="inspection.submitted_by_user"
                                v-if="inspection.vehicle" />
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col :cols="showSidePanel ? 12 : 6" class="pa-3">
            <v-card>
                <v-card-title class="font-weight-bold">Inspection Items</v-card-title>
                <v-card-text>
                    <!-- <template v-for="(item, i) in inspection.items">
                                <InspectionItem :item="item" />
                                <v-divider class="my-3" v-if="i + 1 < inspection.items.length"></v-divider>
                            </template> -->
                    <v-row v-for="(item, i) in inspection.items">
                        <v-col cols="12" md="6">
                            <div class="d-inline-flex flex-column ml-7">
                                <span>{{ getItemLabel(item.workflow_id) }}</span>
                                <span class="text-caption" v-if="item.failed">
                                    Item Failure:
                                    <SharedTableDynamicItemFailureItem :item_failure="getItemFailure(item.id)" />
                                </span>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
                            {{ item.value }} <span v-if="item.failed" class="text-error">(Failed)</span>
                        </v-col>
                        <v-col v-if="item.comments">
                            <div class="ml-7">Comments: {{ item.comments }}</div>
                        </v-col>
                        <v-divider v-if="i + 1 < inspection?.items?.length"></v-divider>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Inspection } from '@/types/maintenance/inspection';
import { get } from 'jquery';

const props = defineProps({
    inspection: {
        type: Object as PropType<Inspection>,
        required: true,
    },
    loadingDetails: {
        type: Boolean
    },
    showSidePanel: {
        type: Boolean,
        required: false,
        default: false
    }
});

const getItemFailure = (id: number) => {
    return props.inspection.failed_items?.find(item => item.id == id)?.item_failure ?? {};
}

const getItemLabel = (workflowId: string) => {
    return props.inspection?.form_version?.elements?.find(item => item.id == workflowId)?.label
}

</script>

<style scoped>
.title {
    font-weight: bold;
    color: #1984c5;
}
</style>