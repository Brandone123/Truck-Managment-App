<template>
    <SharedUiCustomTable :showFooterInHead="false" :headers="tableHeaders" :items="serviceEntries" :loading="loading">
        <template v-slot:item.completion_date="{ item }">
            <span class="text-secondary font-weight-bold" style="cursor: pointer; border-bottom: 1px dotted;">
                {{ new Date(item.completion_date).toLocaleDateString('en-US') }}
                <v-tooltip activator="parent" location="top">
                    {{ getRelativeDateTime(item.completion_date) }}
                </v-tooltip>
            </span>
        </template>
        <template v-slot:item.due_date="{ item }">
            <span class="text-secondary font-weight-bold" style="cursor: pointer; border-bottom: 1px dotted;">
                {{ new Date(item.due_date).toLocaleDateString('en-US') }}
                <v-tooltip activator="parent" location="top">
                    {{ getRelativeDateTime(item.due_date) }}
                </v-tooltip>
            </span>
        </template>
        <template v-slot:item.compliance="{ item }">
            <v-chip color="primary" class="mt-1" density="comfortable">On-Time</v-chip>
            <div class="d-flex flex-column">
                <span>5 months, 3 weeks ahead</span>
            </div>
        </template>

        <template v-slot:item.service_history_id="{ item }">
            <span v-if="item.service_history_id" @click="viewServiceHistoryDetails(item.service_history_id)"
                class="font-weight-bold" style="cursor: pointer; border-bottom: 1px dotted;">{{ item.service_history_id
                }}</span>
        </template>


        <template v-slot:item.work_order_id="{ item }">
            <span v-if="item.work_order_id" @click="viewWorkOrderDetails(item.work_order_id)" class="font-weight-bold"
                style="cursor: pointer; border-bottom: 1px dotted;">{{ item.work_order_id
                }}</span>
        </template>
    </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import type { ServiceReminder } from "~/types/maintenance/serviceReminders";

const props = defineProps({
    showSidePanel: {
        type: Boolean,
        required: false,
        default: false
    },
    serviceReminder: {
        type: Object as PropType<Partial<ServiceReminder>>,
        required: true,
    },
});

const emit = defineEmits(['view', 'edit', 'delete']);
const router = useRouter();

// 
const serviceEntries = computed(() => {
    return props.serviceReminder?.schedules?.filter((schedule: any) => !!schedule.completion_date && (schedule.work_order_id || schedule.service_history_id)) ?? []
})

const viewServiceHistoryDetails = (serviceHistoryId: number) => {
    router.push(`/maintenance/ServiceHistory/${serviceHistoryId}`);
};

const viewWorkOrderDetails = (workOrderId: number) => {
    router.push(`/maintenance/WorkOrders/${workOrderId}`);
};

const tableHeaders = [
    { title: 'Due', key: 'due_date' },
    { title: 'Completed', key: 'completion_date' },
    { title: 'Work Order', key: 'work_order_id' },
    { title: 'Service History', key: 'service_history_id' },
    // { title: 'Compliance', key: 'compliance' },
    // { title: 'Completed By', key: 'completed by' },
];

const getRelativeDateTime = (dateString: any, alt?: boolean) => {
    return alt ? moment(dateString).format('MMM DD YYYY') : moment(dateString).from(moment());
}

</script>

<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
    position: sticky;
    right: 0;
    width: 20px;
}

.chip {
    width: auto;
    /* Allow the chip to only take the space it needs */
    max-width: 200px;
    /* You can set a max width if needed */
}
</style>