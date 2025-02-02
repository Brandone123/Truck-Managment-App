<template>
    <PaginatedAutocomplete :label="label" :itemValue="itemValue"  :return-object="returnObject" :pagination="pagination" 
        variant="outlined" density="compact" :items="records"
        :loading="loading" @intersect="loadNextPage" @update:search-input="handleSearch"
        placeholder="Search for a applicantion...">
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :subtitle="`${item.raw.job?.title}` + `${' | '}` + `${item.raw.job?.status}`" :title="`${item.raw.applicant?.first_name }` + `${ item.raw.applicant?.last_name}`">
            </v-list-item>
        </template>

        <template v-slot:selection="{ props, item }">
            {{ item.raw.applicant?.first_name }}
            
            {{ item.raw.applicant?.last_name }}
        </template>
    </PaginatedAutocomplete>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PaginatedAutocomplete from '@/components/shared/PaginatedAutoComplete.vue';
import type { Application } from '@/types/recruiting/applicantApplication';


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
        default: 'Application'
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
const records = ref<Application[]>([]);
const search = ref<string | null>(null);
const loading = ref<boolean>(false);
const pagination = ref<Pagination>({
    page: 1,
    lastPage: 1,
    perPage: 50,
    total: 0,
});

const ApplicantionTemplateAbortController = ref<AbortController | null>(null)


const freshApplicantionTemplateAbortController = () => {
    // If there's already an abortController, abort it
    if (ApplicantionTemplateAbortController.value) {
        ApplicantionTemplateAbortController.value.abort()
    }
    // Create a new AbortController
    ApplicantionTemplateAbortController.value = new AbortController()
    return ApplicantionTemplateAbortController.value
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
    const controller = freshApplicantionTemplateAbortController()

    loading.value = true;

    const { data, error } = await useApiFetch('/api/recruiting/applicant-application-management/applications', {
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
            records.value = response.data as Application[];
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