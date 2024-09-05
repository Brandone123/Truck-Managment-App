<template>
    <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="inventoryActivity" :loading="loading">
        <template v-slot:item.quantity="{ item }">
            <span>{{ (item.quantity != null) ? item.quantity : 'N/A' }}</span>
        </template>
        <template v-slot:item.total_quantity="{ item }">
            <span>{{ (item.total_quantity != null) ? item.total_quantity : 'N/A' }}</span>
        </template>
        <template v-slot:item.location_id="{ item }">
            <span>{{ getLocationName(item.location_id) }}</span>
        </template>
        <template v-slot:item.reason="{ item }">
            <span>{{ item.reason }}</span>
        </template>
        <template v-slot:item.created_by="{ item }">
            <SharedTableTechnicianItem v-if="item.created_by" :user-id="item.created_by" />
            <span v-else>N/A</span>
        </template>
        <template v-slot:item.created_at="{ item }">
            <span>{{ new Date(item.created_at).toLocaleDateString('en-US') }}</span>
        </template>
        <!-- <template v-slot:item.id="{ item }">
            <div class="d-flex align-items-center">
                <v-icon size="25">mdi-package-variant-closed</v-icon>
                <span class="ml-2">{{ item.reason_id }}</span>
            </div>
        </template> -->
        <!-- <template v-slot:item.unit_cost="{ item }">
            <span>{{ (item.unit_cost != null) ? item.unit_cost.toLocaleString('en-US', {
                style: 'currency', currency:
                'USD' }) : 'N/A' }}</span>
        </template>
        <template v-slot:item.subtotal="{ item }">
            <span>{{ (item.subtotal != null) ? item.subtotal.toLocaleString('en-US', {
                style: 'currency', currency:
                'USD' }) : 'N/A' }}</span>
        </template> -->
        <!-- <template v-slot:item.location_id="{ item }">
            <span>{{ new Date(item.location_id).toLocaleDateString('en-US') }}</span>
        </template> -->
    </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, computed } from 'vue';


const props = defineProps({
    headers: {
        type: Array,
        require: true
    },
    partId: {
        type: Object as PropType<Partial<number>>,
        required: true,
    },
});

// const authStore = useAuthStore()

const partLocationStore = usePartLocationStore()
const { partLocations } = storeToRefs(partLocationStore)

const partHistoryStore = usePartHistoryStore();
const { inventoryActivity, loading } = storeToRefs(partHistoryStore);


onMounted(() => {
    partHistoryStore.fetchAllInventoryHistory(props.partId);
});


const getLocationName = (locationId: number) => {
    return partLocations.value?.find(location => location.id == locationId)?.name
}

loading.value = partHistoryStore.loading;
inventoryActivity.value = partHistoryStore.inventoryActivity;

</script>