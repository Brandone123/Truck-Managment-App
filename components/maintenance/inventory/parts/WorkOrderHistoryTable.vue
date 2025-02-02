<template>
    <div>
        <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="workOrderHistory" :loading="loading">
        <template v-slot:item.id="{ item }">
            <div class="d-flex align-items-center">
                <v-icon size="25">mdi-package-variant-closed</v-icon>
                <span class="ml-2">{{ item.id }}</span>
            </div>
        </template>
        <template v-slot:item.line_item.work_order_id="{ item }">
            <nuxt-link style="text-decoration: none" class="text-primary"
                :to="`/maintenance/workOrders/${item.line_item.work_order_id}`">{{ item.line_item?.work_order_id
                }}</nuxt-link>
        </template>
        <template v-slot:item.quantity_ordered="{ item }">
            <span>{{ item.quantity_ordered }}</span>
        </template>
        <template v-slot:item.unit_cost="{ item }">
            <span>{{ item.unit_cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</span>
        </template>
        <template v-slot:item.subtotal="{ item }">
            <span>{{ item.subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</span>
        </template>
    </SharedUiCustomTable>
        </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';


const props = defineProps({
    headers: {
        type: Array,
        required: true
    },
    partId: {
        type: Object as PropType<Partial<number>>,
        required: true,
    },
    showSidePanel: {
    type: Boolean,
    required: false,
    default: false
  }
});

const partHistoryStore = usePartHistoryStore();
const { workOrderHistory, loading } = storeToRefs(partHistoryStore);

onMounted(() => {
    partHistoryStore.fetchWorkOrderHistory(props.partId);
});


</script>