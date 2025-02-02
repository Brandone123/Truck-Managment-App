<template>
    <v-autocomplete :style="{ width: width}" v-model="selectedItem" :items="itemList" :no-data-text="noDataText" :loading="loading"
        :hide-no-data="!loading" :variant="(variant as any)" :flat="flat" :density="(density as any)" :label="label"
        :rules="rules" item-title="name" item-value="id" clearable>
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
import { storeToRefs } from 'pinia';

const props = defineProps({
    width: {
        type: String,
        required: false,
        default: '100%'
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
        default: 'Supplier',
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
const selectedItem = computed({
    get() {
        return props.modelValue;
    },
    set(value: any) {
        let selectedItem = itemList.value.find(item => item.id == value)
        emit('update:modelValue', value);
        emit('selection', selectedItem);
    }
});

const commonListStore = useMaintenanceCommonListStore()

const { loadingSuppliers: loading } = storeToRefs(commonListStore);

const itemList = computed(() => {
    return commonListStore.getSuppliers
})

onMounted(() => {
    commonListStore.fetchList('part-suppliers')
})

const noDataText = computed(() => {
    return loading.value ? '' : 'No data available';
})
</script>