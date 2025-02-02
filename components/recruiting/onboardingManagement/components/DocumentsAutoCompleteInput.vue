<template>
    <v-autocomplete v-model="selectedItem" :label="label" :item-value="itemValue" :variant="(variant as any)"
        :density="(density as any)" :items="records" :loading="isLoading">
        <!-- Custom Item Rendering -->
        <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props" :title="item.raw.name">
                <!-- :subtitle="`Type: ${item.raw.document_type}`" -->
            </v-list-item>
        </template>

        <!-- Custom Selection Rendering -->
        <!-- <template v-slot:selection="{ item }">
            <span> {{ item.raw.name }} <span v-if="item.raw.document_type">{{ `(Type:
                    ${item.raw.document_type})` }}</span></span>
        </template> -->
    </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { storeToRefs } from 'pinia'
import type { OrientationDocument } from '~/types/recruiting/onboardingOrientation';

const props = defineProps({
    itemValue: {
        type: String,
        default: 'document_id',
    },
    label: {
        type: String,
        default: 'Document',
    },
    modelValue: {
        type: [String, Number],
        default: null,
    },
    variant: {
        type: String,
        default: ''
    },
    density: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue', 'selection']);

const onboardingStore = OnboardingOrientationDocumentStore();
const { orientationDocuments } = storeToRefs(onboardingStore);
// Reactive state variables
const records = ref<OrientationDocument[]>([]);
const isLoading = ref<boolean>(false);

const emitSelection = (val: any) => {
    // Emit the document object based on the selected value
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

/**
 * Loads records from the API based on the current pagination and query.
 */
const loadRecords = async (): Promise<void> => {
    isLoading.value = true;
    await onboardingStore.fetchOrientationDocuments({});
    isLoading.value = false;
    records.value = orientationDocuments.value as OrientationDocument[];
    emitSelection(props.modelValue)
};

// Load initial records when the component is mounted
onMounted(() => {
    loadRecords();
});
</script>

<style scoped></style>