<template>
    <PaginatedAutocomplete :label="label" :itemValue="itemValue"  :return-object="returnObject" :pagination="pagination" variant="outlined" density="compact" :items="records"
        :loading="loading" @intersect="loadNextPage" @update:search-input="handleSearch"
        placeholder="Search for a form...">
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :subtitle="`${item.raw.current_version?.elements?.length ?? 0}` + `${' Item(s)'}`" :title="item.raw.name">
            </v-list-item>
        </template>

        <template v-slot:selection="{ props, item }">
            {{ item.raw.name }}
        </template>
    </PaginatedAutocomplete>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PaginatedAutocomplete from '@/components/shared/PaginatedAutoComplete.vue';
import type { ApplicationForm } from '@/types/recruiting/applicantApplication';


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
        default: 'Form'
    }
})

// Define the shape of pagination state
interface Pagination {
    page: number;
    lastPage: number;
    perPage: number;
    total: number;
}

// Reactive state variables
const records = ref<ApplicationForm[]>([]);
const search = ref<string | null>(null);
const loading = ref<boolean>(false);
const pagination = ref<Pagination>({
    page: 1,
    lastPage: 1,
    perPage: 50,
    total: 0,
});

const FormTemplateAbortController = ref<AbortController | null>(null)


const freshFormTemplateAbortController = () => {
    // If there's already an abortController, abort it
    if (FormTemplateAbortController.value) {
        FormTemplateAbortController.value.abort()
    }
    // Create a new AbortController
    FormTemplateAbortController.value = new AbortController()
    return FormTemplateAbortController.value
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
    const controller = freshFormTemplateAbortController()

    loading.value = true;

    const { data, error } = await useApiFetch('/api/recruiting/applicant-application-management/application-forms', {
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
            records.value = response.data as ApplicationForm[];
            pagination.value.total = response.total
            pagination.value.lastPage = response.last_page
        } else {
            records.value.push(...response.data);
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