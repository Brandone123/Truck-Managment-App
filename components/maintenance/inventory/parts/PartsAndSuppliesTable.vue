<template>
  <SharedUiServerTable class="custom-table" :show-footer-in-head="false" :filters="filterParts" :headers="headers"
    :items="partSupplies" :loading="loading" @update:selectedFilters="selectedFilters = $event" :sticky-top="true"
    :sticky-top-offset="55" v-model="selectedItems" return-object :items-per-page="pagination.itemsPerPage"
    :sort-by="pagination.sortBy" :items-length="total_items" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event;">
    <template v-slot:item.actions="{ item, index }">
      <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
        <v-list-item @click="viewDetails(item.id)" append-icon="mdi-eye">View Details</v-list-item>
        <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
        <v-list-item @click="$emit('delete', item)" append-icon="mdi-delete">Delete</v-list-item>
      </SharedTableActionMenu>
    </template>
    <template v-slot:item.part_number="{ item }">
      <div class="d-flex">
        <v-col cols="12" sm="3">
          <div class="rounded position-relative" style=" display: flex; justify-content: center; align-items: center;
                width: 28px; height: 28px; background-color: grey; color: white; text-align: center;
                position: relative;">
            <span style="font-size: xx-small">
              {{ item.part_number.slice(0, 4).toUpperCase() }}
            </span>
          </div>
        </v-col>
        <v-col cols="12" sm="9">
          <span @click="viewDetails(item.id)" class="text-primary mr-5" style="cursor: pointer; border-bottom: 1px dotted;
                justify-content: center; align-items: center; text-align: center; white-space: nowrap;
                text-overflow: ellipsis;">
            {{ item.part_number }}
          </span>
        </v-col>
      </div>
    </template>
    <template v-slot:item.unit_cost="{ item }">
      <span>
        ${{ item.unit_cost }}
      </span>
    </template>
    <template v-slot:item.manufacturer="{ item }">
      <span>
        {{ item.manufacturer ? item.manufacturer : 'N/A' }}
      </span>
    </template>
    <template v-slot:item.measurement_unit="{ item }">
      <span>
        {{ item.measurement_unit ? `${item.measurement_unit.name} (${item.measurement_unit.symbol ?
          item.measurement_unit.symbol : ''})` : 'N/A' }}
      </span>
    </template>
    <template v-slot:item.UPC="{ item }">
      <span>
        {{ item.UPC ? item.UPC : 'N/A' }}
      </span>
    </template>
    <template v-slot:item.quantity="{ item }">
      <div v-if="item && item.locations">
        <span class="font-weight-bold text-h6">{{ getTotalQuantity(item) }}</span>
      </div>
    </template>
  </SharedUiServerTable>
</template>

<script lang="ts" setup>
import { defineEmits, ref } from 'vue';
import { usePartsAndSuppliesStore } from '@/stores/maintenance/partsAndSupplies';
import type { filterItem } from '~/types/layout/table';
import { useRouter } from 'vue-router';
import type { PartCategory, PartManufacturer } from '~/types/maintenance/partSupplyTypes';
import { usePartCategoryStore } from '@/stores/maintenance/partCategoryStore';
import { usePartManufacturerStore } from '@/stores/maintenance/partManufacturer';
import { usePartMeasurementUnitstore } from '@/stores/maintenance/partMeasurementsUnits';

const router = useRouter();
const selectedFilters = ref<Record<string, string>>({})
const activeFilter = ref<string>("all");
const selectedItems = ref<Array<any>>([])
const hoveredRow = ref<number | null>(null)

const partCategoryStore = usePartCategoryStore()
const { loading: partCategoryLoader } = storeToRefs(partCategoryStore)

const partManufacturerStore = usePartManufacturerStore()
const { loading: partManufacturerLoader } = storeToRefs(partManufacturerStore)

const partMeasurementUnitStore = usePartMeasurementUnitstore()
const { loading: partMeasurementLoader } = storeToRefs(partMeasurementUnitStore)

const emit = defineEmits(['view', 'edit', 'delete']);

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies, loading: partAndSuppliesLoader,
  loadingSummary,
  pagination: partsAndSuppliesPagination, total_items } = storeToRefs(partsAndSuppliesStore)

const loading = computed(() => {
  return partAndSuppliesLoader.value || partCategoryLoader.value || partManufacturerLoader.value || partMeasurementLoader.value
})
const headers = [
  { title: 'Part', key: 'part_number' },
  { title: 'Category', key: 'category.name' },
  { title: 'Manufacturer', key: 'manufacturer.name' },
  // { title: 'Location', key: 'location' },
  { title: 'Manufacturer Part Number', key: 'manufacturer_part_number' },
  { title: 'Measurement Unit', key: 'measurement_unit' },
  { title: 'Total Quantity', key: 'quantity' },
  { title: 'Unit Cost', key: 'unit_cost' },
  { title: 'UPC', key: 'UPC' },
  // { title: 'Description', key: 'description' },
  { title: '', key: 'actions', sortable: false, width: '200px', align: 'end' },
];

const categoryStore = usePartCategoryStore()
const { partCategories } = storeToRefs(categoryStore)

const manufacturerStore = usePartManufacturerStore()
const { partManufacturers } = storeToRefs(manufacturerStore)


const viewDetails = (partId: number) => {
  router.push(`PartSupplyTrackingPage/${partId}`)
}

const filterParts = computed(() => {
  return [
    {
      title: 'Select Category',
      key: 'category_id',
      items: partCategories.value.map((category: PartCategory) => {
        return { value: category.id as any, text: category.name as any }
      }),
      width: '300px',
    },
    {
      title: 'Select Manufacturer',
      key: 'manufacturer_id',
      items: partManufacturers.value.map((manufacturer: PartManufacturer) => {
        return { value: manufacturer.id as any, text: manufacturer.name as any }
      }),
      width: '300px',
    }
  ] as filterItem[]
})

const getTotalQuantity = computed(() => (item: { locations?: { quantity: number | null }[] } = {}): number => {
  return item.locations?.reduce((total, location) => total + (location.quantity || 0), 0) || 0;
});

const pagination = computed({
  get() {
    return partsAndSuppliesPagination.value
  },
  set(value) {
    partsAndSuppliesStore.setPagination(value);
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

  if (activeFilter.value != 'all' && payload['filters'].status != null) {
    payload['filters'].status.status = activeFilter.value
  }

  return payload
})

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  partsAndSuppliesStore.fetchPartSupplies(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    partsAndSuppliesStore.fetchPartSupplies(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  partsAndSuppliesStore.fetchPartSupplies(searchQuery.value);
})

onMounted(() => {
  partsAndSuppliesStore.fetchPartSupplies(searchQuery.value)
});

</script>

<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}
</style>