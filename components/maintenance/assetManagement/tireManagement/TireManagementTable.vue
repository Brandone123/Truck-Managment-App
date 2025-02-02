<template>
  <div>
    <!-- Filter Tabs -->
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="uninstalled" class="text-none">
          <!-- <span class="mr-1 bg-orange" style="width: 8px; height: 8px; border-radius: 50%;"></span> -->
          Not Installed
        </v-tab>
      </v-tabs>
    </div>
    <SharedUiServerTable class="custom-table" :show-footer-in-head="false" :headers="headers" :items="tireList"
      :loading="loading" @update:selectedFilters="selectedFilters = $event" :sticky-top="true" :sticky-top-offset="55"
      v-model="selectedItems" return-object :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy"
      :items-length="total_items" @update:options="pagination = $event" @hoveredRow="hoveredRow = $event;">

      <template v-slot:filters>
        <div class="d-inline-flex" v-if="activeFilter != 'uninstalled'">
          <SharedInputVehicleAutoCompleteInput width="300px" flat density="compact" hide-details variant="solo"
            class="filter-input mr-1" v-model="selectedFilters.vehicle_id" clearable />
        </div>
      </template>

      <template v-slot:item.vehicle_id="{ item, index }">
        <SharedTableDynamicVehicleItem :vehicle="item.vehicle" v-if="item.vehicle_id && item.vehicle" />
      </template>
      <template v-slot:item.current_installation="{ item, index }">
        <span v-if="item?.current_installation">{{ item.current_installation.position }}</span>
      </template>

      <template v-slot:item.installed_by="{ item, index }">
        <SharedTableDynamicTechnicianItem :technician="item.current_installation?.installer"
          v-if="item?.current_installation" />
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="$emit('viewDetails', item.id)" append-icon="mdi-eye">View Details</v-list-item>
        </SharedTableActionMenu>
      </template>
    </SharedUiServerTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineEmits } from 'vue';
import type { filterItem } from '~/types/layout/table';

const selectedFilters = ref<Record<string, string>>({})
const activeFilter = ref<string>("all");
const selectedItems = ref<Array<any>>([])
const hoveredRow = ref<number | null>(null)

const tireStore = useTireStore();
const { tireList, pagination: tirePagination, loading, total_items } = storeToRefs(tireStore)

const emits = defineEmits(['viewDetails'])

const pagination = computed({
  get() {
    return tirePagination.value
  },
  set(value) {
    tireStore.setPagination(value);
  }
})

const searchQuery = computed(() => {
  let payload: Record<string, any> = {
    page: pagination.value.page,
    items_per_page: pagination.value.itemsPerPage,
  }

  if (pagination.value.sortBy.length > 0) {
    payload['sort_by'] = pagination.value.sortBy[0]
  }

  if (Boolean(pagination.value.search)) {
    payload['search'] = pagination.value.search
  }

  payload['filters'] = {}

  Object.entries(selectedFilters.value).forEach(([key, value]) => {
    if (value) {
      payload['filters'][key] = value;
    }
  });


  if (activeFilter.value != 'all') {
    switch (activeFilter.value) {
      case 'uninstalled':
        payload['filters'].vehicle_id = null;
        break;
      default:
        break;
    }
  }

  return payload
})

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  tireStore.fetchTires(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    tireStore.fetchTires(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  tireStore.fetchTires(searchQuery.value);
})

onMounted(() => {
  tireStore.fetchTires(searchQuery.value)
});

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Installed Vehicle', value: 'vehicle_id' },
  { title: 'Installed Position', value: 'current_installation' },
  { title: 'Manufacturer', value: 'part.manufacturer.name' },
  // { title: 'Brand', value: 'brand' },
  { title: 'Size', value: 'size' },
  // { title: 'Purchase Date', value: 'purchase_date' },
  { title: 'Cost', value: 'line_item_part.subtotal' },
  { title: 'Installed by', value: 'installed_by' },
  { title: '', value: 'actions', sortable: false, minWidth: '80', align: 'end' },
];
</script>

<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}
</style>