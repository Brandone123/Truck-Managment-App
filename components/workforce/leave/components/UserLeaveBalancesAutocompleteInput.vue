<template>
    <v-autocomplete v-model="selectedItem" :label="label" :item-value="itemValue" :variant="(variant as any)"
        :density="(density as any)" :items="records" :loading="isLoading">
        <!-- Custom Item Rendering -->
        <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props" :title="item.raw.leave_type_name"
                :subtitle="`Remaining days: ${item.raw.leave_balance_remaining_days}`">
            </v-list-item>
        </template>

        <!-- Custom Selection Rendering -->
        <template v-slot:selection="{ item }">
            <span> {{ item.raw.leave_type_name }} <span v-if="item.raw.leave_type_name">{{ `(Remaining days:
                    ${item.raw.leave_balance_remaining_days})` }}</span></span>
        </template>
    </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import type { LeaveBalance } from '@/types/workforce/leaveRecord';
import { storeToRefs } from 'pinia'

const props = defineProps({
    itemValue: {
        type: String,
        default: 'leave_type_id',
    },
    label: {
        type: String,
        default: 'Leave Type',
    },
    userId: {
        type: [String, Number],
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

// Reactive state variables
const records = ref<LeaveBalance[]>([]);
const isLoading = ref<boolean>(false);


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

/**
 * Loads records from the API based on the current pagination and query.
 */
const loadRecords = async (): Promise<void> => {
    isLoading.value = true;

    const { data, error } = await useApiFetch(`/api/workforce/leave/balances/user/${props.userId}/year/${new Date().getFullYear()}`);

    isLoading.value = false

    if (error.value) {
        //console.log(error.value)
    } else {
        records.value = data.value;
        emitSelection(props.modelValue)
    }
};

// Load initial records when the component is mounted
onMounted(() => {
    if (props.userId) {
        loadRecords();
    }
});

// Reload records when userId changes
watch(
    () => props.userId, (newVal) => {
        if (newVal) {
            loadRecords();
        }
    }
);
</script>

<style scoped></style>