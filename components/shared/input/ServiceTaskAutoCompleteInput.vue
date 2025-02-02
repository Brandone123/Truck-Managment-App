<template>
    <v-autocomplete v-model="selectedItem" :chips="chips" :closable-chips="closableChips" :items="serviceTasks"
        :no-data-text="noDataText" :loading="loading" :hide-no-data="!loading" :variant="variant" :flat="flat"
        :multiple="multiple" :density="density" :label="label" :rules="rules" item-title="name" item-value="id">
        <!-- Show loading spinner at the end of the list when loading more items -->
        <template v-slot:append-item>
            <v-list-item v-if="loading">
                <div class="text-center">
                    <v-progress-circular indeterminate size="20" color="primary"></v-progress-circular>
                </div>
            </v-list-item>
        </template>

        <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.name">
                <v-list-item-subtitle>
                    <span style="font-size: 12px;text-overflow:ellipsis;">{{
                        item.raw.description }}</span>
                </v-list-item-subtitle>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';

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
        default: 'Service Task',
    },
    density: {
        type: String,
        default: '',
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

const { loadingServiceTasks: loading } = storeToRefs(commonListStore);

const serviceTasks = computed(() => {
    if (props.selectedItems?.length > 0) {
        let filterOutItems = []
        if (Array.isArray(props.modelValue)) {
            filterOutItems = props.selectedItems.filter(item => !(props.modelValue as Array<any>).includes(item))
        } else {
            filterOutItems = props.selectedItems.filter(item => item != props.modelValue)
        }
        return commonListStore.getServiceTasks?.filter(item => !filterOutItems.includes(item.id)) ?? []
    }

    return commonListStore.getServiceTasks
})

onMounted(() => {
    commonListStore.fetchList('service-tasks')
})

const selectedItem = computed({
    get() {
        return props.modelValue;
    },
    set(value: any) {
        // let selectedItem = serviceTasks.value.find(item => item.id == value)
        let selectedItem = props.multiple ? serviceTasks.value.filter(item => value.includes(item.id)) : serviceTasks.value.find(item => item.id == value)
        emit('update:modelValue', value);
        emit('selection', selectedItem);
    },
});

const noDataText = computed(() => {
    return loading.value ? '' : 'No data available';
})
</script>