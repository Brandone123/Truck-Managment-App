<template>
  <div>
    <div style="position:sticky;top:95px;z-index:3;" class="grey-background my-5 position-sticky">
      <v-tabs v-model="activeFilter" color="primary" class="" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-progress-circular :size="20" :width="2" class="mt-2" color="white" indeterminate
          v-if="partlocationLoading"></v-progress-circular>
        <template v-else-if="partLocations.length > 0">
          <template v-for="partLocation in partLocations.slice(0, 4)" :key="partLocation.id">
            <v-tab :value="partLocation.id" class="text-none"><span class="mr-1"
                style="width: 8px; height: 8px; border-radius: 50%;"></span>{{ partLocation.name }}
              <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
                indeterminate></v-progress-circular>
              <v-chip v-else density="compact" class="ml-1">{{ inventorySummary[partLocation.name] }}</v-chip>
            </v-tab>
          </template>

          <v-menu v-if="partLocations.slice(0, 4)?.length > 0">
            <template v-slot:activator="{ props }">
              <div class="d-inline-flex align-center v-tab text-none" v-bind="props" style="cursor:pointer">
                More
                <v-icon>mdi-chevron-down</v-icon>
              </div>
            </template>
            <v-list>
              <v-list-item v-for="(tab, index) in partLocations.slice(4)" :key="index"
                @click="activeFilter = tab.id as any" color="primary" density="compact" class="text-none">
                <v-list-item-title class="d-inline-flex align-center">
                  <div class="mr-1" style="width: 8px; height: 8px; border-radius: 50%;"></div>
                  {{ tab.name }}
                  <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
                    indeterminate></v-progress-circular>
                  <v-chip v-else density="compact" class="ml-1">{{ inventorySummary[tab.name] }}</v-chip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

      </v-tabs>
      <v-divider></v-divider>
      <!-- <div class="d-flex justify-start py-3 px-5 mt-10">
      <v-row class="ga-4">
        <v-col cols="auto" class="px-0">
          <v-select hide-details v-model="selectedCategory" :items="partCategories" label="Filter categories"
            density="compact" variant="outlined" style="width: 220px;" clearable></v-select>
        </v-col>
        <v-col cols="auto" class="px-0">
          <v-select :items="partSupplies" item-title="part_number" item-value="id"  hide-details v-model="selectedPartNumber" label="Filter part number" density="compact"
            variant="outlined" style="width: 220px;" clearable></v-select>
        </v-col>
        <v-col cols="auto" class="px-0">
          <v-select hide-details :items="partManufacturers" item-title="name" item-value="id" v-model="selectedManufacturer" label="Filter manufacturers" density="compact"
            variant="outlined" style="width: 220px;" clearable></v-select>
        </v-col>
        <v-col cols="auto" class="px-0">
          <v-btn-toggle v-model="selectedFilter" mandatory density="compact">
            <v-btn color="secondary" value="active" @click="filterBy('active')">Active</v-btn>
            <v-btn color="secondary" value="inactive" @click="filterBy('inactive')">Inactive</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </div> -->
    </div>
    <SharedUiServerTable :show-footer-in-head="false" :headers="headers" :filters="filterInventory"
      :items="inventoryItems" :loading="loading" @update:selectedFilters="selectedFilters = $event" :sticky-top="true"
      :sticky-top-offset="78" v-model="selectedItems" return-object :items-per-page="pagination.itemsPerPage"
      :sort-by="pagination.sortBy" :items-length="total_items" @update:options="pagination = $event">
      <template v-slot:item.part_id="{ item }">
        <v-row style="justify-content: center; " class="my-1">
          <v-col cols="12" sm="2" class="py-0">
            <div class="rounded position-relative mt-1"
              style="display: flex; justify-content: center; align-items: center; width: 45px; height: 45px; background-color: grey; color: white; text-align: center; position: relative;">
              <v-icon size="25">mdi-package-variant-closed</v-icon>
            </div>
          </v-col>
          <v-col cols="12" sm="10" class="py-0">
            <span style="font-size: small; color:grey">
              <strong class="text-secondary">{{ item.part?.part_number }}</strong>
              <div>Category:<span class="font-weight-bold">{{
                item?.part?.category?.name ?? '--' }} </span>
              </div>
              <div>Manufacturer:<span class="font-weight-bold"> {{ item?.part?.manufacturer?.name ?? '--' }}</span>
              </div>
              <div>Measurement Unit:<span class="font-weight-bold">{{
                item?.part?.measurement_unit ? ` ${item.part.measurement_unit.name}
                  (${item.part.measurement_unit.symbol
                    ? item.part.measurement_unit.symbol : ''})` : '--' }} </span>
              </div>
            </span>
          </v-col>
        </v-row>
      </template>

      <template v-slot:item.actions="{ item }">
        <span>
          <v-icon class="ml-2" v-if="item.active" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            {{ 'Edit Inventory' }}
          </v-tooltip>
        </span>
        <span>
          <v-icon class="ml-2" :color="item.active ? 'primary' : 'red'" size="30" @click="$emit('switch', item)">{{
            item.active ? 'mdi-toggle-switch'
              : 'mdi-toggle-switch-off' }}</v-icon>
          <v-tooltip activator="parent" location="top">
            {{ item.active ? 'Deactivate Inventory ' : 'Activate Inventory' }}
          </v-tooltip>
        </span>
      </template>
      <template v-slot:item.aisle="{ item }">
        <span style="font-size:25px;" class="font-weight-bold">
          {{ item.aisle }}
        </span>
        <!-- <div v-if="item.active">
          <v-text-field hide-details single-line min="0" step="1" density="compact" variant="outlined"
            :rules="[(value: any) => value >= 0 || 'Wrong Entry']" v-model="item.aisle"></v-text-field>
        </div> -->
      </template>
      <template v-slot:item.row="{ item }">
        <span style="font-size:25px;" class="font-weight-bold">
          {{ item.row }}
        </span>
        <!-- <div v-if="item.active">
          <v-text-field hide-details single-line min="0" step="1" density="compact" variant="outlined"
            :rules="[(value: any) => value >= 0 || 'Wrong Entry']" v-model="item.row"></v-text-field>
        </div> -->
      </template>
      <template v-slot:item.bin="{ item }">
        <!-- <div v-if="item.active">
          <v-text-field hide-details single-line min="0" step="1" density="compact" variant="outlined"
            :rules="[(value: any) => value >= 0 || 'Wrong Entry']" v-model="item.bin"></v-text-field>
        </div> -->
        <span style="font-size:25px;" class="font-weight-bold">
          {{ item.bin }}
        </span>
      </template>
      <template v-slot:item.quantity="{ item }">
        <div style="justify-content: center; align-items: center;" class="text-center">
          <span style="font-size:25px;" class="font-weight-bold">
            {{ item.quantity }}
          </span>
          <div style="border-bottom: 1px dotted;">{{ getRelativeDateTime(item.updated_at ? item.updated_at :
            item.created_at) }}</div>
          <v-tooltip activator="parent" location="top">
            {{ new Date(item.updated_at ? item.updated_at : item.created_at).toLocaleString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            }) }}
          </v-tooltip>
        </div>
      </template>
      <template v-slot:item.active="{ item }">
        <!-- <button class="custom-switch" :class="{ 'active': item.active }" @click="item.active = !item.active">
          <span class="yes-no-text" :class="{ 'slide-out': item.active, 'slide-in': !item.active }">{{ item.active ?
            'Yes'
            : 'No' }}</span>
          <span class="empty-space" :class="{ 'slide-out': !item.active, 'slide-in': item.active }"></span>
        </button> -->
        <v-icon v-if="item.active" color="secondary" size="large">mdi-check-circle</v-icon>
        <v-icon v-if="!item.active" color="red" size="large">mdi-window-close</v-icon>

      </template>
      <template v-slot:item.new_quantity="{ item }">
        <div v-if="item.active" class="d-flex align-items-center text-center">
          <div class="border rounded d-flex">
            <v-checkbox density="compact" class="mt-3 ml-3" :value="true" v-model="item.selected" color="secondary"
              hide-details></v-checkbox>
            <v-text-field density="compact" variant="outlined" v-model="item.new_quantity" class="ml-5" hide-details
              single-line min="0" step="1" :disabled="!item.selected"
              :rules="[(value: any) => value >= 0 || 'Wrong Entry']"></v-text-field>
          </div>
        </div>
        <div v-else>
          <!-- Afficher la partie "Part" seulement -->
        </div>
        <v-tooltip activator="parent" location="top">
          <pre style="font-size: 0.8em; text-align: center; align-items: center;">Check this box to start tracking <br> inventory on this part at {{ getPartLocation(item.location_id) }}
        </pre>
        </v-tooltip>
      </template>
    </SharedUiServerTable>

  </div>
  <v-divider class="mt-3"></v-divider>
  <!-- <v-card-actions>
    <v-btn color="primary" @click="reloadPage">Cancel</v-btn>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="">Save</v-btn>
  </v-card-actions> -->
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useInventoryStore } from '@/stores/maintenance/inventoryStore';
import type { InventoryItem } from '@/types/maintenance/inventoryTypes';
import moment from 'moment';
import type { PartCategory, PartManufacturer } from '~/types/maintenance/partSupplyTypes';
import type { filterItem } from '~/types/layout/table';
import { usePartCategoryStore } from '~/stores/maintenance/partCategoryStore';


const partAndSupplyStore = usePartsAndSuppliesStore()
const { partSupplies, loading: partSuppliesLoading } = storeToRefs(partAndSupplyStore)

const inventoryStore = useInventoryStore();
const { inventoryItems, loadingSummary, inventorySummary, loading: inventoryLoading, pagination: inventoryPagination, total_items } = storeToRefs(inventoryStore)

const partLocationStore = usePartLocationStore()
const { partLocations, loading: partlocationLoading } = storeToRefs(partLocationStore)

const suppliersStore = useSuppliersStore();
const { selectedSupplier } = storeToRefs(suppliersStore)

const partCategoryStore = usePartCategoryStore()
const { loading: partCategoryLoader, partCategories } = storeToRefs(partCategoryStore)

const partManufacturerStore = usePartManufacturerStore()
const { partManufacturers } = storeToRefs(partManufacturerStore)

const loading = computed(() => {
  return partSuppliesLoading.value || inventoryLoading.value || partlocationLoading.value
})

const emit = defineEmits(['save', 'edit', 'switch']);
const selectedFilters = ref<Record<string, string>>({})
const activeFilter = ref<string>("all");
const selectedItems = ref<Array<any>>([])



const props = defineProps({
  search: String,
  inventoryItems: {
    type: Array as PropType<InventoryItem[]>,
    required: true,
  },
});

const getPartNumber = (partId: number) => {
  return partSupplies.value?.find((part: any) => part.id == partId)
}

const getPartLocation = (partId: number) => {
  return partLocations.value.find((part: any) => part.id == partId)?.name
}

const getCategoryName = (categoryId: number) => {
  return `${partCategories.value.find(category => category.id == categoryId)?.name}-`
}
const getManufacturerName = (manufacturerId: number) => {
  return partManufacturers.value.find(manufacturer => manufacturer.id == manufacturerId)?.name
}

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}
const filterInventory = computed(() => {
  return [
    {
      title: 'Select Category',
      key: 'category_id',
      items: partCategories.value.map((category: PartCategory) => {
        return { value: category.id as any, text: category.name as any }
      }),
      width: '200px',
    },
    {
      title: 'Select Manufacturer',
      key: 'manufacturer_id',
      items: partManufacturers.value.map((manufacturer: PartManufacturer) => {
        return { value: manufacturer.id as any, text: manufacturer.name as any }
      }),
      width: '200px',
    },
    {
      title: 'Select Status',
      key: 'active',
      items: [{ text: "Active", value: 1 }, { text: "Inactive", value: 0 }],
      width: '200px',
    }
  ] as filterItem[]
})

const pagination = computed({
  get() {
    return inventoryPagination.value
  },
  set(value) {
    inventoryStore.setPagination(value);
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
    payload['filters'].location_id = activeFilter.value
  }

  return payload
})

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  inventoryStore.fetchInventoryItems(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    inventoryStore.fetchInventoryItems(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  inventoryStore.fetchInventoryItems(searchQuery.value);
})

onMounted(() => {
  inventoryStore.fetchInventoryItems(searchQuery.value)
});

const saveInventoryItem = async () => {
  const modifiedItems = props.inventoryItems.filter((item) => {
    return item.id !== null && item !== inventoryItems.value.find((original) => original.id === item.id);
  });
  emit('save', modifiedItems);
};

const headers = [
  { title: 'Part', key: 'part_id' },
  { title: 'Aisle', key: 'aisle' },
  { title: 'Row', key: 'row' },
  { title: 'Bin', key: 'bin' },
  { title: 'Current Qty', key: 'quantity' },
  // { title: 'New Qty', key: 'new_quantity' },
  { title: 'Active', key: 'active' },
  { title: 'Actions', key: 'actions', sortable: false },
];

</script>
<style scoped>
.custom-switch {
  background-color: #f2f2f2;
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.custom-switch.active {
  background-color: rgb(61, 128, 160);
  color: white;
}

.yes-no-text {
  display: inline-block;
  width: 50px;
  text-align: left;
  transition: transform 0.3s ease;
}

.custom-switch.active .yes-no-text {
  transform: translateX(50%);
}

.v-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid;
}

.v-checkbox .v-icon {
  color: #1976d2;
  font-size: 16px;
}

.v-text-field {
  width: 50px;
}
</style>