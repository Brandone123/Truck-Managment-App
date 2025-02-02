<template>
    <v-autocomplete v-model="selectedItem" :items="itemList" :no-data-text="noDataText" :loading="loading"
        :hide-no-data="!loading" :variant="variant" :flat="flat" :density="density" :label="label" :rules="rules"
        :item-title="itemTitleKey" :item-value="itemValueKey" @update:search="onSearch" @scroll-bottom="onScrollBottom"
        @update:focused="inputFocused = $event" no-filter @onScroll="console.log($event)" clearable>
        <!-- Show loading spinner at the end of the list when loading more items -->
        <template v-slot:append-item>
            <v-list-item v-if="loading">
                <div class="text-center">
                    <v-progress-circular indeterminate size="20" color="primary"></v-progress-circular>
                </div>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import type { LineItem } from '~/types/maintenance/workOrder';
import { useApiFetch } from '@/composables/useApiFetch';
import { v4 as uuidv4 } from 'uuid'; // For generating UUIDs

const props = defineProps({
    variant: {
        type: String,
        default: '',
    },
    flat: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        default: 'Select Vehicle',
    },
    density: {
        type: String,
        default: '',
    },
    rules: {
        type: Array as PropType<any>,
        default: [],
    },
    modelValue: {
        required: true,
    },
});

const emit = defineEmits(['update:modelValue', 'selection']);

const itemTitleKey = "name"
const itemValueKey = "id"
const endpoint = "/api/shared/employees"

const selectedItem = computed({
    get() {
        return props.modelValue;
    },
    set(value: any) {
        let selection = itemList.value.find((item: any) => item[itemValueKey] == value)
        if (selection) {
            currentSelection.value = selection
            //search.value = selection[itemTitleKey]; // Update the search input with the selected item's name
        }
        emit('update:modelValue', value);
        emit('selection', selection);
    },
});

const inputFocused = ref<boolean>(false);
const currentSelection = ref<Record<string, any> | null>(null)

const search = ref<string>(''); // Holds the search input
const items = ref<Record<string, any>[]>([]); // Items to display in the dropdown
const loading = ref<boolean>(false); // Loading state
const page = ref<number>(1); // Keeps track of the current page
const perPage = 10; // Items per page
const hasMoreData = ref<boolean>(true); // To track if there is more data to load

const noDataText = computed(() => {
    return loading.value ? '' : 'No data available';
})

const itemList = computed(() => {
    // Return `items.value` directly if there's no `currentSelection`
    if (!currentSelection.value) {
        return items.value;
    }

    // Check if currentSelection's id already exists in items
    const itemExists = currentSelection.value && items.value.some(item => item[itemValueKey] === currentSelection.value[itemValueKey]);

    // If the id exists, return `items.value`, otherwise append `currentSelection`
    return itemExists ? items.value : [currentSelection.value, ...items.value];
});


// Array of abort controllers keyed by UUID
const abortControllers = ref<Record<string, AbortController>>({});

// Method to abort all ongoing requests
const abortAllRequests = () => {
    Object.keys(abortControllers.value).forEach((key) => {
        abortControllers.value[key].abort();
    });
    abortControllers.value = {}; // Clear all controllers after aborting
};

// Method to fetch items based on the search query and page
const fetchItems = async () => {
    // Abort all previous requests before making a new one
    if (Object.keys(abortControllers.value).length > 0) {
        abortAllRequests();
    }

    loading.value = true;
    const uuid = uuidv4();
    try {
        // Create a new AbortController for this request
        const controller = new AbortController();
        abortControllers.value[uuid] = controller;

        const { data, error } = await useApiFetch(`${endpoint}`, {
            query: {
                search: search.value ?? undefined,
                page: page.value,
                perPage: perPage,
            },
            signal: controller.signal, // Use the signal from the new AbortController
        });

        if (error.value) {
            throw new Error(error.value);
        }

        const response = data.value as any;

        if (response.data.length > 0) {
            items.value = response.data
        }

        // If there's no more data, set hasMoreData to false
        if (response.current_page >= response.last_page) {
            hasMoreData.value = false;
        }
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.log('Request aborted:', error.signal);
        } else {
            console.error('Error fetching data:', error);
        }
    } finally {
        // Check if the signal was aborted before setting loading state to false
        const controller = abortControllers.value[uuid];
        if (controller) {
            if (!controller.signal?.aborted) {
                loading.value = false; // Only set loading to false if not aborted
            }
            // Remove the abort controller after completion or abort
            delete abortControllers.value[uuid];
        }
    }
};

const triggerSearch = () => {
    page.value = 1; // Reset page to 1 for new search
    items.value = []; // Clear current items for new search
    hasMoreData.value = true; // Allow fetching more data
    fetchItems(); // Trigger new search
}

// Watch the search input and reset the items and page on new search input
watch(search, (newVal, oldVal) => {
    // the seach takes in itemTitleKey on focus
    nextTick(() => {
        if (currentSelection.value && (oldVal == '' || oldVal === newVal) && newVal == currentSelection.value[itemTitleKey]) {
            return
        }

        const itemSelectedAlready = currentSelection.value && newVal == currentSelection.value[itemTitleKey]
        if (!inputFocused.value || itemSelectedAlready) {
            return;
        }

        triggerSearch()
    })
});


// triggered before search in put watcher
watch(() => inputFocused.value, (isFocused) => {
    if (!isFocused) {
        abortAllRequests()
        loading.value = false
    }
})

// Method to handle user input in the autocomplete search bar
const onSearch = (newSearch: string) => {
    search.value = newSearch; // Update the search value
};

// Function to fetch more items when the user scrolls to the bottom
const onScrollBottom = () => {
    if (hasMoreData.value && !loading.value) {
        page.value++; // Increase the page number
        fetchItems(); // Fetch more items
    }
};

// Function to fetch the pre-filled value's corresponding record (for editing)
const fetchSelectedItem = async (preFilledItemId: number) => {
    loading.value = true;
    try {
        const { data, error } = await useApiFetch(`${endpoint}/${preFilledItemId}`);

        if (error.value) {
            throw new Error(error.value);
        }

        currentSelection.value = data.value
        emit('selection', data.value);
        hasMoreData.value = false;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.log('Request aborted:', error.signal);
        } else {
            console.error('Error fetching data:', error);
        }
    } finally {
        loading.value = false;
    }
};

// Fetch the pre-filled item when the component is mounted (e.g., when editing)
onMounted(() => {
    if (props.modelValue) {
        fetchSelectedItem(props.modelValue as number);
    }
    fetchItems();
});

// Clean up on component unmount
onBeforeUnmount(() => {
    abortAllRequests(); // Abort all requests on unmount
});
</script>