<template>
    <div>
        <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="inventoryActivity" :loading="loading">
        <template v-slot:item.quantity="{ item }">
            <span>{{ (item.quantity != null) ? item.quantity : 'N/A' }}</span>
        </template>
        <template v-slot:item.total_quantity="{ item }">
            <span>{{ (item.total_quantity != null) ? item.total_quantity : 'N/A' }}</span>
        </template>
        <template v-slot:item.location_id="{ item }">
            <span>{{ item.location?.name }}</span>
        </template>
        <template v-slot:item.reason="{ item }">
            <span>{{ item.reason }}</span>
        </template>
        <template v-slot:item.created_by="{ item }">
            <SharedTableDynamicTechnicianItem v-if="item.created_by && item.created_by_user" :technician="item.created_by_user" />
            <span v-else>N/A</span>
        </template>
        <template v-slot:item.created_at="{ item }">
            <span>{{ new Date(item.created_at).toLocaleDateString('en-US') }}</span>
        </template>
    </SharedUiCustomTable>
        </div>
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
    showSidePanel: {
    type: Boolean,
    required: false,
    default: false
  }
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