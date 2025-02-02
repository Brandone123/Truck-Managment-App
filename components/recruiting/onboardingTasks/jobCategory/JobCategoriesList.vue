<template>
    <SharedUiServerTable :items="jobs" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
        :sticky-top="true" :sticky-top-offset="55" v-model="selectedItems" return-object
        :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
        @hoveredRow="hoveredRow = $event" :items-length="totalJobCategory" dynamicSearch>

        <template v-slot:item.actions="{ item, index }">
            <div class="d-flex">
                <span style="cursor: pointer;" class="mr-2">
                    <v-icon dense @click="$emit('edit', item)" color="secondary">mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="top">
                        Edit task
                    </v-tooltip>
                </span>

                <span style="cursor: pointer;">
                    <v-icon dense @click="$emit('delete', item.id)" color="error">mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="top">
                        Delete task
                    </v-tooltip>
                </span>
            </div>
        </template>
    </SharedUiServerTable>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue';
import type { JobCategory } from '@/types/recruiting/jobManagement';
import { JobManagementStore } from '~/stores/recruiting/jobManagement/jobManagementStore';
import { storeToRefs } from 'pinia';

const props = defineProps({
    jobs: {
        type: Array as PropType<JobCategory[]>,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['view', 'edit', 'delete', 'update:pagination']);

const selectedItems = ref<Array<any>>([]);
const hoveredRow = ref<number | null>(null);

const jobStore = JobManagementStore();

const { pagination: jobCategoryPagination, totalJobCategory } = storeToRefs(jobStore);

const pagination = computed({
    get() {
        return jobCategoryPagination.value;
    },
    set(value) {
        jobStore.setPagination(value);
    }
});

const selectedFilters = ref<Record<string, any>>({});
const activeFilter = ref<string>('all');

const tableHeaders = [
    { title: 'Job Category Name', key: 'name', sortable: true },
    { title: 'Description', key: 'description', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false, width: '150px' },
];


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

    if (Object.keys(selectedFilters.value).length > 0) {
        payload['filters'] = selectedFilters.value
    }

    if (activeFilter.value != 'all') {
        payload['filters'].status = activeFilter.value
    }

    return payload
})

const setSelectedItems = (value: any) => {
    selectedItems.value = value;
}

defineExpose({
    searchQuery,
    setSelectedItems
})
</script>

<style scoped>
/* Add your styles here */
</style>