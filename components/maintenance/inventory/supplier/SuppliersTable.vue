<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="charging" class="text-none">
          Charging
          <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
            indeterminate></v-progress-circular>
          <v-chip v-else density="compact" class="ml-1">{{ classificationCategories.charging }}</v-chip>
        </v-tab>
        <v-tab value="fuel" class="text-none">
          Fuel
          <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
            indeterminate></v-progress-circular>
          <v-chip v-else density="compact" class="ml-1">{{ classificationCategories.fuel }}</v-chip>
        </v-tab>
        <v-tab value="parts" class="text-none">
          Parts
          <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
            indeterminate></v-progress-circular>
          <v-chip v-else density="compact" class="ml-1">{{ classificationCategories.parts }}</v-chip>
        </v-tab>
        <v-tab value="service" class="text-none">
          Service
          <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
            indeterminate></v-progress-circular>
          <v-chip v-else density="compact" class="ml-1">{{ classificationCategories.service }}</v-chip>
        </v-tab>
        <v-tab value="vehicle" class="text-none">
          Vehicle
          <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
            indeterminate></v-progress-circular>
          <v-chip v-else density="compact" class="ml-1">{{ classificationCategories.vehicle }}</v-chip>
        </v-tab>
      </v-tabs>
    </div>

    <SharedUiServerTable class="custom-table" show-select :show-footer-in-head="false" :headers="headers"
      :items="suppliers" :loading="loading" @update:selectedFilters="selectedFilters = $event" :sticky-top="true"
      :sticky-top-offset="95" :selectable="true" v-model="selectedItems" return-object
      :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" :items-length="total_items"
      @update:options="pagination = $event" @hoveredRow="hoveredRow = $event;">

      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="$emit('view', item)" append-icon="mdi-eye">View Details</v-list-item>
          <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu>
      </template>
      <template v-slot:item.website="{ item }">

        <NuxtLink :to="item.website" external target="_blank">
          <span class="text-secondary" style="cursor:pointer" v-if="item.website">
            {{ item.website.length > 40 ? item.website.slice(0, 40) + '...' : item.website }}
          </span>
        </NuxtLink>
      </template>
      <template v-slot:item.address="{ item }">
        {{ item.address ? item.address : "N/A" }}
      </template>
      <template v-slot:item.phone="{ item }">
        {{ item.phone ? item.phone : "N/A" }}
      </template>
      <template v-slot:item.contact_information="{ item }">
        <div v-if="item.contact_information?.name">
          <span>{{ item.contact_information?.name }}</span>
          <div class="text-secondary"> {{ item.contact_information?.email }}</div>
        </div>
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.watchers="{ item }">
        <div class="d-flex align-center">
          <div class="mr-2" style="cursor: pointer; border-bottom: 1px dotted;">
            {{ item.watchers ? (item.watchers.length === 1 ? '1 watcher' : item.watchers.length + ' watchers') : '' }}
          </div>
          <v-tooltip bottom>
            <v-card>
              <v-card-title>Watchers</v-card-title>
              <v-card-text>
                <ul>
                  <li>{{ item.watchers ? item.watchers.length : 'No' }}</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-tooltip>
        </div>
      </template>
    </SharedUiServerTable>
  </div>

</template>

<script lang="ts" setup>
import { defineEmits } from 'vue';
import { useSuppliersStore } from '@/stores/maintenance/suppliersStore';

const emit = defineEmits(['view', 'edit', 'delete']);

const suppliersStore = useSuppliersStore();
const { suppliers, loading, loadingSummary, pagination: supplierPagination, classificationCategories, total_items } = storeToRefs(suppliersStore)
const selectedFilters = ref<Record<string, string>>({})
const activeFilter = ref<string>("all");
const selectedItems = ref<Array<any>>([])
const hoveredRow = ref<number | null>(null)

const pagination = computed({
  get() {
    return supplierPagination.value
  },
  set(value) {
    suppliersStore.setPagination(value);
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

  if (Object.keys(selectedFilters.value).length > 0) {
    payload['filters'] = selectedFilters.value
  }

  if (activeFilter.value != 'all') {
    payload['filters'].classification = activeFilter.value
  }

  return payload
})

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  suppliersStore.fetchSuppliers(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    suppliersStore.fetchSuppliers(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  suppliersStore.fetchSuppliers(searchQuery.value);
})

onMounted(() => {
  suppliersStore.fetchSuppliers(searchQuery.value)
});
const headers = [
  // { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Address', key: 'address' },
  { title: 'Phone', key: 'phone' },
  { title: 'Website', key: 'website' },
  // { title: 'Location', key: 'location' },
  { title: 'Contact', key: 'contact_information' },
  { title: 'Watchers', key: 'watchers' },
  { title: '', key: 'actions', sortable: false, width: '200px', align: 'end' },
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