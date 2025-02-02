<template>
    <v-autocomplete v-model="selectedItem" :chips="chips" :closable-chips="closableChips" :items="workOrders"
        :no-data-text="noDataText" :loading="loading" :hide-no-data="!loading" :variant="variant" :flat="flat"
        :multiple="multiple" :density="density" :label="label" :rules="rules" item-title="id" item-value="id">
        <!-- Show loading spinner at the end of the list when loading more items -->
        <template v-slot:append-item>
            <v-list-item v-if="loading">
                <div class="text-center">
                    <v-progress-circular indeterminate size="20" color="primary"></v-progress-circular>
                </div>
            </v-list-item>
        </template>

        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="`#${item.raw.id}`">
                <template v-slot:append>{{ formatDate(item.raw.created_at) }}</template>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import moment from "moment";

const props = defineProps({
    variant: {
        type: String,
        default: '',
    },
    vehicleId: {
        required: false
    },
    flat: {
        type: Boolean,
        default: false,
    },
    label: {
        type: String,
        default: 'Work Order',
    },
    density: {
        type: String,
        default: 'default',
    },
    rules: {
        type: Array as PropType<any[]>,
        default: [],
    },
    modelValue: {
        required: true,
    },
    selectedItems: {
        type: Array as PropType<any[]>,
        required: false,
        default: () => []
    },
    multiple: {
        type: Boolean,
        default: false
    },
    chips: {
        type: Boolean,
        default: false
    },
    closableChips: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'selection']);
const commonListStore = useMaintenanceCommonListStore()

const { loadingWorkOrders: loading } = storeToRefs(commonListStore);

const workOrders = computed(() => {
    if (props.selectedItems?.length > 0) {
        let filterOutItems = []
        if (Array.isArray(props.modelValue)) {
            filterOutItems = props.selectedItems.filter(item => !(props.modelValue as Array<any>).includes(item))
        } else {
            filterOutItems = props.selectedItems.filter(item => item != props.modelValue)
        }
        return commonListStore.getWorkOrders?.filter(item => !filterOutItems.includes(item.id)) ?? []
    }

    return commonListStore.getWorkOrders
})

function formatDate(dateString: string) {
    return moment(dateString).format('MM/DD/YY');
}

onMounted(() => {
    let query: Record<string, any> = {}
    if (props.vehicleId) {
        query.filters = { vehicle_id: props.vehicleId }
    }
    commonListStore.fetchList('work-orders', query)
})

const selectedItem = computed({
    get() {
        return props.modelValue;
    },
    set(value: any) {
        // let selectedItem = workOrders.value.find(item => item.id == value)
        let selectedItem = props.multiple ? workOrders.value.filter(item => value.includes(item.id)) : workOrders.value.find(item => item.id == value)
        emit('update:modelValue', value);
        emit('selection', selectedItem);
    },
});

const noDataText = computed(() => {
    return loading.value ? '' : 'No data available';
})
</script>