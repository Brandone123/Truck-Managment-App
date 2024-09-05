<template>
  <SharedUiCustomTable :show-footer-in-head="false" :filters="filterParts" :headers="headers" :items="partSupplies"
    :loading="loading">
    <template v-slot:item.actions="{ item }">
      <v-icon class="ml-2" color="primary" @click="viewDetails(item.id)">mdi-eye</v-icon>
      <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">
        mdi-pencil
      </v-icon>
      <v-icon class="ml-2" color="red" dense @click="$emit('delete', item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:item.part_number="{ item }">
      <v-row>
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
      </v-row>
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
    <template v-slot:item.UPC="{ item }">
      <span>
        {{ item.UPC ? item.UPC : 'N/A' }}
      </span>
    </template>
    <template v-slot:item.quantity="{ item }">
      <div v-if="item && item.locations">
        <span class="font-weight-bold text-h6">{{ getTotalQuantity(item) }}</span>
      </div>
      <!-- <div v-for="(location, index) in item.locations">
        <span class="font-weight-bold text-h6" v-if="location.quantity > 0">
          {{ location.quantity }}
        </span>
        <span class="font-weight-bold text-red text-h6" v-else>
          {{ location.quantity }}
        </span>
      </div> -->
    </template>
  </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { usePartsAndSuppliesStore } from '@/stores/maintenance/partsAndSupplies';
import type { PartSupply } from '@/types/maintenance/partSupplyTypes';
import type { filterItem } from '~/types/layout/table';
import { useRouter } from 'vue-router';

const router = useRouter();

// const props = defineProps({
//   search: String,
// });

const emit = defineEmits(['view', 'edit', 'delete']);

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies, loading } = storeToRefs(partsAndSuppliesStore)

const headers = [
  { title: 'Part', key: 'part_number' },
  { title: 'Category', key: 'category' },
  { title: 'Manufacturer', key: 'manufacturer' },
  // { title: 'Location', key: 'location' },
  { title: 'Manufacturer Part Number', key: 'manufacturer_part_number' },
  { title: 'Measurement Unit', key: 'measurement_unit' },
  { title: 'Total Quantity', key: 'quantity' },
  { title: 'Unit Cost', key: 'unit_cost' },
  { title: 'UPC', key: 'UPC' },
  // { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false },
];

loading.value = partsAndSuppliesStore.loading;
partSupplies.value = partsAndSuppliesStore.partSupplies;

const viewDetails = (partId: number) => {
  router.push(`Part/details/${partId}`)
}

const filterParts = computed(() => {
  return [
    {
      title: 'Select Category',
      key: 'category',
      items: ['Battery', 'Belts', 'Brakets', 'Cores', 'Electrical', 'DEF', 'Filters', 'Fluids', 'Oil', 'Parts', 'Suspension', 'Tires', 'Miscellaneous'],
      width: '300px',
    }
  ] as filterItem[]
})

const getTotalQuantity = computed(() => (item: { locations?: { quantity: number | null }[] } = {}): number => {
  return item.locations?.reduce((total, location) => total + (location.quantity || 0), 0) || 0;
});

</script>