<template>
    <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="purchaseHistory" :loading="loading">
        <template v-slot:item.id="{ item }">
            <div class="d-flex align-items-center">
                <v-icon size="25">mdi-package-variant-closed</v-icon>
                <span class="ml-2">{{ item.id }}</span>
            </div>
        </template>
        <template v-slot:item.quantity_ordered="{ item }">
            <span>{{ (item.quantity_ordered != null) ? item.quantity_ordered : 'N/A' }}</span>
        </template>
        <template v-slot:item.unit_cost="{ item }">
            <span>{{ (item.unit_cost != null) ? item.unit_cost.toLocaleString('en-US', {
                style: 'currency',
                currency:
                    'USD'
            }) : 'N/A' }}</span>
        </template>
        <template v-slot:item.subtotal="{ item }">
            <span>{{ (item.subtotal != null) ? item.subtotal.toLocaleString('en-US', {
                style: 'currency', currency:
                    'USD'
            }) : 'N/A' }}</span>
        </template>
        <template v-slot:item.status="{ item }">
            <span>{{ item.status }}</span>
        </template>
        <!-- <template v-slot:item.created_by="{ item }">
                <SharedTableTechnicianItem v-if="item.created_by" :user-id="item.created_by" />
                <span v-else>N/A</span>
            </template> -->
        <template v-slot:item.created_at="{ item }">
            <span>{{ new Date(item.created_at).toLocaleDateString('en-US') }}</span>
        </template>
    </SharedUiCustomTable>

</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, computed } from 'vue';


const props = defineProps({
    headers: {
        type: Array,
        required: true
    },
    partId: {
        type: Object as PropType<Partial<number>>,
        required: true,
    },
});


const partHistoryStore = usePartHistoryStore();
const { purchaseHistory, loading } = storeToRefs(partHistoryStore);

onMounted(() => {
    partHistoryStore.fetchPurchaseHistory(props.partId);
});


loading.value = partHistoryStore.loading;
purchaseHistory.value = partHistoryStore.workOrderHistory;




</script>