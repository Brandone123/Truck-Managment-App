<template>
    <SharedUiServerTable :items="tasks" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
        :sticky-top="true" :sticky-top-offset="55" v-model="selectedItems" return-object
        :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
        @hoveredRow="hoveredRow = $event" :items-length="totalTaskCategory" dynamicSearch>

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
        <template v-slot:item.default_sector="{ item, index }">
            <span>
                {{ Array.isArray(item.default_sector) ? item.default_sector.join(', ') : '' }}
            </span>
        </template>
    </SharedUiServerTable>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue';
import type { TaskCategory } from '@/types/recruiting/onboardingOrientation';
import { OnboardingOrientationTaskStore } from '~/stores/recruiting/onboardingOrientation/orientationTaskStore';
import { ApplicantApplicationStore } from '~/stores/recruiting/applicationManagement/applicantApplicationStore';
import { storeToRefs } from 'pinia';

const props = defineProps({
    tasks: {
        type: Array as PropType<TaskCategory[]>,
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

const onboardingStore = OnboardingOrientationTaskStore();
const { pagination: taskCategoryPagination, totalTaskCategory } = storeToRefs(onboardingStore);

const pagination = computed({
    get() {
        return taskCategoryPagination.value;
    },
    set(value) {
        onboardingStore.setPagination(value);
    }
});

const selectedFilters = ref<Record<string, any>>({});
const activeFilter = ref<string>('all');

const tableHeaders = [
    { title: 'Task Category Name', key: 'name', sortable: true },
    { title: 'Default Sector', key: 'default_sector', sortable: true },
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