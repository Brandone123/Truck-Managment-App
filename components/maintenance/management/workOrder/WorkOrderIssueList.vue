<template>
    <div>
        <IssueEditDialog :modelValue="issueEditDialog" :issue="selectedIssue" :vehicleName="vehicleName"
            @update:modelValue="issueEditDialog = $event" @close="closeIssueEditDialog" @save="saveIssue" />

        <v-card>
            <div class="d-flex">
                <v-card-title class="font-weight-bold">Issues</v-card-title>
                <v-btn color="primary" @click="AddIssue" :disabled="!vehicleName" class="ml-auto mr-2 mt-3"
                    style="cursor: pointer; font-size: small">
                    <v-icon>mdi-plus</v-icon>Add Issue
                </v-btn>
            </div>
            <v-card-text>
                <div>
                    <v-tabs v-model="activeFilter" background-color="transparent">
                        <v-tab v-for="tab in tabs" :value="tab.value" density="compact">
                            {{ tab.title }}
                        </v-tab>
                    </v-tabs>

                    <v-expand-transition>
                        <v-alert v-if="activeFilter == 'open'" density="compact" class="my-2"
                            title="Select any issues that were resolved as part of this service"></v-alert>
                    </v-expand-transition>

                    <SharedUiServerTable color="primary" :item-selectable="isItemSelectable"
                        :show-select="activeFilter == 'open'" hideTopbar :sticky-top="true" :showFooterInHead="false"
                        :headers="tableHeaders" :items="getIssuesList" :loading="loading" :sticky-top-offset="94"
                        :selectable="true" v-model="selectedIssues" :items-per-page="pagination.itemsPerPage"
                        :sort-by="pagination.sortBy" :items-length="total_items" @update:options="pagination = $event"
                        @hoveredRow="hoveredRow = $event;">
                        <template v-slot:item.actions="{ item, index }">
                            <!-- <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
                    <v-list-item @click="$emit('viewDetails', item.id)" append-icon="mdi-eye">View Details</v-list-item>
                    <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
                    <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
                </SharedTableActionMenu> -->
                        </template>
                        <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                            <!-- <v-btn color="primary" class="text-none mr-2" @click="createWork(selectedItems[0])"> -->
                            <v-btn color="primary" class="text-none mr-2" @click="">
                                Select
                            </v-btn>
                        </template>
                        <template v-slot:item.id="{ item }">
                            #{{ item.id }}
                        </template>

                        <template v-slot:item.source="{ item }">
                            {{ item.source }}
                        </template>


                        <template v-slot:item.status="{ item }">
                            <v-chip class="text-capitalize" density="compact" variant="flat"
                                v-if="typeof item.status === 'string' && (item.status !== '1' && item.status !== '0')"
                                :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
                        </template>
                        <template v-slot:item.issue="{ item }">
                            <span>{{ item.issue ? `#${item.issue}` : 'N/A' }}</span>
                        </template>

                        <template v-slot:item.priority="{ item }">
                            <v-chip class="text-capitalize" density="compact"
                                v-if="typeof item.priority === 'string' && (item.priority !== '1' && item.status !== '0')"
                                :color="getPriorityColor(item.priority)">{{ item.priority }}</v-chip>
                            <span v-else></span>
                        </template>

                        <!-- Assignment -->
                        <template v-slot:item.assigned_to="{ item }">
                            <SharedTableDynamicTechnicianItem v-if="item.assigned_to_user"
                                :technician="item.assigned_to_user" />
                            <span v-else>N/A</span>
                        </template>

                        <template v-slot:item.reported_date="{ item }">
                            <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small">
                                {{ new Date(item.reported_date).toLocaleDateString('en-US') }}
                                <v-tooltip activator="parent" location="top" location-strategy="connected">
                                    {{ getRelativeDateTime(item.reported_date) }}
                                </v-tooltip>
                            </span>
                        </template>
                    </SharedUiServerTable>
                </div>
            </v-card-text>
        </v-card>
    </div>

</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Issues } from '@/types/maintenance/issue';
import IssueEditDialog from '@/components/maintenance/issue/issueManagement/IssueEditDialog.vue';
import moment from 'moment';

const props = defineProps({
    vehicleName: {
        type: String,
        required: false,
    },
    // selected: {
    //     type: Array<Number>,
    //     reqired: false,
    //     default: () => []
    // },
    workOrderId: {
        type: Number,
        required: true,
    },
    issueIds: {
        type: Array<Number>,
        required: true
    }
});


const emit = defineEmits(['onSelection', 'update:issueIds'])

const issueStore = useIssueStore();

const { loading, total_items,
    pagination: issuePagination, getIssuesList } = storeToRefs(issueStore);

const activeFilter = ref<string>('open')

const hoveredRow = ref<number | null>(null)

const issueEditDialog = ref(false);

const selectedIssue = ref<Partial<Issues>>({} as Partial<Issues>);

const closeIssueEditDialog = () => {
    issueEditDialog.value = false;
};

const saveIssue = async (issue: any) => {
    issueEditDialog.value = false;
    await issueStore.createIssue(issue);
    await issueStore.fetchIssues(searchQuery.value);
}

const AddIssue = () => {
    if (!props.vehicleName) {
        useLayoutStore().setStatusMessage('Select First A Vehicle', 'error')
    }
    selectedIssue.value = {} as Partial<Issues>;
    issueEditDialog.value = true;
}

const getRelativeDateTime = (dateString: any) => {
    return moment(dateString).from(moment());
}

const tabs = [
    { title: 'Open', value: 'open' },
    { title: 'Resolved', value: 'resolved' },
    { title: 'Closed', value: 'closed' }
];

const selectedIssues = computed({
    get() {
        return props.issueIds
    },
    set(val) {
        emit('update:issueIds', val)
    }
})

const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
        case 'open':
            return 'primary';
        case 'in progress':
            return 'secondary';
        case 'closed':
            return 'gray';
    }
}

const getPriorityColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
        case 'low':
            return 'grey';
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

const isItemSelectable = (item: any) => {
    return item.work_order_id == null || item.work_order_id == props.workOrderId
}

const tableHeaders = [
    { title: 'Priority', key: 'priority' },
    { title: 'Issue ID', key: 'id' },
    { title: 'Status', key: 'status' },
    { title: 'Assigned', key: 'assigned_to' },
    { title: 'Work Order', key: 'work_order_id' },
    { title: 'Due date', key: 'reported_date' },
];

const pagination = computed({
    get() {
        return issuePagination.value
    },
    set(value) {
        issueStore.setPagination(value);
    }
})

const searchQuery = computed(() => {
    let payload: Record<string, any> = {
        page: pagination.value.page,
        items_per_page: pagination.value.itemsPerPage,
    }

    if (pagination.value.sortBy.length > 0) {
        payload['sort_by'] = pagination.value.sortBy[0]
    }

    if (Boolean(pagination.value.search)) {
        payload['search'] = pagination.value.search
    }

    payload['filters'] = {}

    if (props.vehicleName) {
        payload['filters'].asset_name = props.vehicleName
    }

    payload['filters'].status = activeFilter.value

    return payload
})

watch(() => pagination.value, (newVal, oldVal) => {
    if (!_isEqual(newVal, oldVal)) {
        issueStore.fetchIssues(searchQuery.value);
    }
}, { deep: true })

watch(() => activeFilter.value, () => {
    issueStore.fetchIssues(searchQuery.value);
})


watch(() => props.vehicleName, (val) => {
    if (val) {
        issueStore.fetchIssues(searchQuery.value);
    }
})


onMounted(() => {
    if (props.vehicleName) {
        issueStore.fetchIssues(searchQuery.value);
    }
})

</script>

<style scope></style>