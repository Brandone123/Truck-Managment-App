<template>
    <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="workOrderHistory" :loading="loading">
        <template v-slot:item.id="{ item }">
            <div class="d-flex align-items-center">
                <v-icon size="25">mdi-package-variant-closed</v-icon>
                <span class="ml-2">{{ item.id }}</span>
            </div>
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
        <!-- <template v-slot:item.status="{ item }">
            <span>{{ item.status }}</span>
        </template>
        <template v-slot:item.created_at="{ item }">
            <span>{{ new Date(item.created_at).toLocaleDateString('en-US') }}</span>
        </template> -->
    </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';


const props = defineProps({
    herders: {
        type: Array,
        required: true
    },
    partId: {
        type: Object as PropType<Partial<number>>,
        required: true,
    },
});

const partHistoryStore = usePartHistoryStore();
const { workOrderHistory, loading } = storeToRefs(partHistoryStore);

onMounted(() => {
    partHistoryStore.fetchWorkOrderHistory(props.partId);
});


</script>