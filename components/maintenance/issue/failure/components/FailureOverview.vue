<template>
    <v-row>
        <v-col :cols="showSidePanel ? 12 : 6">
            <v-card>
                <v-card-title class="font-weight-bold">Failure Details</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">Vehicle</v-col>
                        <v-col cols="12" md="6">
                            <SharedTableDynamicVehicleItem :vehicle="failure.vehicle" v-if="failure.vehicle" />
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Submission Date</v-col>
                        <v-col cols="12" md="6">{{ failure.submission_date }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Inspection Form</v-col>
                        <v-col cols="12" md="6">{{ failure.inspection_form?.name }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Item Name</v-col>
                        <v-col cols="12" md="6">
                            <v-icon>mdi-file-document-outline</v-icon>
                            {{ failure.item_name ? failure.item_name : 'N/A' }}
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Stage</v-col>
                        <v-col cols="12" md="6">
                            <v-chip density="compact" v-if="failure.stage" :color="getStatusColor(failure.stage)">{{
                                failure.stage.toLocaleUpperCase()
                            }}</v-chip>
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row v-if="failure.acknowledge_at">
                        <v-col cols="12" md="6">Acknowledged At</v-col>
                        <v-col cols="12" md="6">{{ failure.acknowledge_at ? failure.acknowledge_at : ''
                            }}</v-col>
                    </v-row>
                    <v-divider v-if="failure.acknowledge_at" class="my-3"></v-divider>
                    <v-row v-if="failure.acknowledge_by">
                        <v-col cols="12" md="6">Acknowledge By</v-col>
                        <v-col cols="12" md="6">{{ failure.acknowledge_by ? failure.acknowledge_by : ''
                            }}</v-col>
                    </v-row>
                    <v-divider v-if="failure.acknowledge_at" class="my-3"></v-divider>
                </v-card-text>
            </v-card>
        </v-col>

        <v-col :cols="showSidePanel ? 12 : 6">
            <v-card>
                <v-card-title class="font-weight-bold">Other Details</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">Issues</v-col>
                        <v-col cols="12" md="6">
                            <span v-if="failure.issue" @click="viewIssue(failure.issue_id as number)"
                                style="cursor: pointer; border-bottom: 1px dotted;" class="text-secondary">
                                <IssueMenu :issue="failure.issue" />
                            </span>
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                        <v-col cols="12" md="6">Work Orders</v-col>
                        <v-col cols="12" md="6">
                            <span class="text-secondary" v-if="(failure.issue?.work_order_id as number)"
                                style="cursor: pointer; border-bottom: 1px dotted;"
                                @click="viewWorkOrder(failure.issue?.work_order_id as number)">
                                #{{ (failure.issue?.work_order_id as number) }}
                            </span>
                            <span v-else>N/A</span>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Failure } from '@/types/maintenance/failure';
import InspectionItem from '@/components/maintenance/preventiveManagement/inspection/components/InspectionItem.vue'
import { useRouter } from 'vue-router';
import IssueMenu from '@/components/maintenance/management/workOrder/components/WorkOrderTableIssueMenu.vue';


const serviceProgramStore = useServiceProgramStore();
const { servicePrograms } = storeToRefs(serviceProgramStore);

const router = useRouter();

const props = defineProps({
    failure: {
        type: Object as PropType<Failure>,
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

const getStatusColor = (status: string) => {
    switch (status) {
        case 'open issue':
            return 'primary';
        case 'acknowledged':
            return 'secondary';
        case 'needs action':
            return 'red';
        case 'resolved':
            return 'green'
    }
};

const viewIssue = (issueId: number) => {
    router.push(`/maintenance/IssuesManagement/${issueId}`)
};

const viewWorkOrder = (workOrderId: number) => {
    router.push(`/maintenance/WorkOrders/${workOrderId}`)
};

</script>

<style scoped>
.title {
    font-weight: bold;
    color: #1984c5;
}
</style>