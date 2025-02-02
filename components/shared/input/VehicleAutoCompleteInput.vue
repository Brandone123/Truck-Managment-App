<template>
    <v-autocomplete :style="{ width: width }" v-model="selectedItem" :items="vehicles" :no-data-text="noDataText"
        :loading="loading" :hide-no-data="!loading" :variant="(variant as any)" :flat="flat" :density="(density as any)"
        :label="label" :rules="rules" :item-title="itemTitle" :item-value="itemValue">
        <!-- Show loading spinner at the end of the list when loading more items -->
        <template v-slot:append-item>
            <v-list-item v-if="loading">
                <div class="text-center">
                    <v-progress-circular indeterminate size="20" color="primary"></v-progress-circular>
                </div>
            </v-list-item>
        </template>
        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :subtitle="item.raw.type" :title="item.raw.name"></v-list-item>
        </template>
    </v-autocomplete>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';

const props = defineProps({
    width: {
        type: String,
        required: false,
        default: '100%'
    },
    itemTitle: {
        type: String,
        required: false,
        default: 'name'
    },
    itemValue: {
        type: String,
        required: false,
        default: 'id'
    },
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
    selectedItems: {
        type: Array as PropType<any[]>,
        required: false,
        default: () => []
    }
});

const emit = defineEmits(['update:modelValue', 'selection']);

const selectedItem = computed({
    get() {
        return props.modelValue;
    },
    set(value: any) {
        let selectedItem = vehicles.value.find(item => item.id == value)
        emit('update:modelValue', value);
        emit('selection', selectedItem);
    }
});

const commonListStore = useMaintenanceCommonListStore()

const { loadingVehicles: loading } = storeToRefs(commonListStore);

const vehicles = computed(() => {
    if (props.selectedItems?.length > 0) {
        let filterOutItems = []
        if (Array.isArray(props.modelValue)) {
            filterOutItems = props.selectedItems.filter(item => !(props.modelValue as Array<any>).includes(item))
        } else {
            filterOutItems = props.selectedItems.filter(item => item != props.modelValue)
        }
        return commonListStore.getVehicles?.filter(item => !filterOutItems.includes(item.id)) ?? []
    }
    return commonListStore.getVehicles
})

onMounted(() => {
    let query: Record<string, any> = {}
    query.relations = [['odometer']]

    commonListStore.fetchList('vehicles', query)
})

const noDataText = computed(() => {
    return loading.value ? '' : 'No data available';
})
</script>