<template>
    <PaginatedAutocomplete v-model="selectedItem" :label="label" :itemValue="itemValue" :return-object="returnObject"
        :pagination="pagination" variant="outlined" density="compact" :items="records" :loading="loading"
        @change="setSelection" @intersect="loadNextPage" @update:search-input="handleSearch" placeholder="Search for a job...">
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :subtitle="item.raw.job_type" :title="item.raw.title">
            </v-list-item>
        </template>

        <template v-slot:selection="{ props, item }">
            {{ item.raw.title }}
        </template>
    </PaginatedAutocomplete>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PaginatedAutocomplete from '@/components/shared/PaginatedAutoComplete.vue';
import type { JobTemplate } from '@/types/recruiting/jobManagement';


const props = defineProps({
    returnObject: {
        type: Boolean,
        default: false,
    },
    itemValue: {
        type: String,
        default: 'id'
    },
    label: {
        type: String,
        default: 'Job'
    },
    modelValue: {
        type: [String, Number],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue', 'selection']);

// Define the shape of pagination state
interface Pagination {
    page: number;
    lastPage: number;
    perPage: number;
    total: number;
}

// Reactive state variables
const records = ref<JobTemplate[]>([]);
const search = ref<string | null>(null);
const loading = ref<boolean>(false);
const pagination = ref<Pagination>({
    page: 1,
    lastPage: 1,
    perPage: 50,
    total: 0,
});

const jobTemplateAbortController = ref<AbortController | null>(null)

const emitSelection = (val: any) => {
    // Emit the leave balance object based on the selected value
    let foundItem: any = records.value.find(
        (item: Record<string, any>) => item[props.itemValue] == val
    );
    foundItem = foundItem ? { ...foundItem } : null
    emit('selection', foundItem);
}

// Computed property for v-model binding
const selectedItem = computed({
    get() {
        return props.modelValue;
    },
    set(val) {

        emitSelection(val)
        // Emit the updated model value
        emit('update:modelValue', val);
    },
});


const setSelection = (selection: any) => {
    console.log('selection is')
    console.log(selection)
}

const freshJobTemplateAbortController = () => {
    // If there's already an abortController, abort it
    if (jobTemplateAbortController.value) {
        jobTemplateAbortController.value.abort()
    }
    // Create a new AbortController
    jobTemplateAbortController.value = new AbortController()
    return jobTemplateAbortController.value
}

const searchQuery = computed(() => {
    let payload: Record<string, any> = {
        page: pagination.value.page,
        items_per_page: pagination.value.perPage,
    }

    if (Boolean(search.value)) {
        payload['search'] = search.value
        payload['page'] = 1
    }

    return payload
})

/**
 * Loads records from the API based on the current pagination and query.
 */
const loadRecords = async (): Promise<void> => {
    const controller = freshJobTemplateAbortController()

    loading.value = true;

    const { data, error } = await useApiFetch('/api/recruiting/job-management/jobs', {
        query: searchQuery.value,
        signal: controller.signal
    });

    if (controller?.signal?.aborted) {
        return
    }


    if (error.value) {
        //console.log(error.value)
    } else {
        const response = data.value as any;
        if (pagination.value.page === 1) {
            records.value = response.data as JobTemplate[];
            pagination.value.total = response.total
            pagination.value.lastPage = response.last_page
        } else {
            records.value.push(...response.data);
            emitSelection(props.modelValue)
        }
    }

    loading.value = false;
};

/**
 * Loads the next page of records if available.
 */
const loadNextPage = (): void => {
    if (pagination.value.page == pagination.value.lastPage) {
        return;
    }

    pagination.value.page += 1;
    loadRecords();
};

const handleSearch = (value: string | null) => {
    search.value = value;
    loadRecords()
}

// Load initial records when the component is mounted
onMounted(() => {
    loadRecords();
});

</script>

<style scoped>
/* Add your component-specific styles here */
main {
    padding: 20px;
}
</style>