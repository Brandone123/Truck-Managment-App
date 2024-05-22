<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia'
import { useVehicleStore } from '@/stores/vehicle'
import { useYardStore } from '@/stores/yard'
import type { filterItem } from '~/types/layout/table';

const vehicleStore = useVehicleStore()
const { vehicleList, loading } = storeToRefs(vehicleStore)

const yardStore = useYardStore()
const { yardList } = storeToRefs(yardStore)

const filtersVehicle = ref<filterItem[]>([]);
const selectedYard = ref<string | null>(null);

onMounted(() => {
  yardStore.fetchYardList();
  vehicleStore.fetchVehicleList();
});

const yardHeaders = ref([
  // { title: 'ID', key: 'id', class: "no-wrap" },
  { title: 'VEHICLE ID', key: 'asset_name', class: "no-wrap" },
  // { title: 'YARD NAME', key: 'yard_id', class: "no-wrap" },
  { title: 'ASSET TYPE', key: 'asset_type', class: "no-wrap" },
  { title: 'Current Location', key: 'diagnostics.gps.reverseGeo.formattedLocation', class: "no-wrap" },
  // { title: 'RECORDED AT', key: 'recorded_at', class: "no-wrap" },
  { title: 'Current Yard', key: 'yard_name', class: "no-wrap" },
  { title: 'STATUS', key: 'status', class: "no-wrap" }, // asset_name

]);

const getYardName = (yard_id: any) => {
  const yard = yardList.value.find((yard) => yard.id === yard_id)
  return yard ? yard.name : ''
}

const filteredVehicles = computed(() => {
  return vehicleList.value?.map(item => {return {...item,diagnostics: JSON.parse(item.diagnostics as string)}})
});

const yardFilterValues = computed(() => {
  return yardList.value?.map(yard => {
    return { text: yard.name, value: yard.id }
  }) || []
})

function initializeFilters() {
  // const yardNameMap = new Map();

  // const convertedVehicle = vehicleList.value.map(item => {
  //   const yardName = getYardName(item.yard_id);

  //   if (!yardNameMap.has(yardName)) {
  //     yardNameMap.set(yardName, {
  //       value: item.yard_id?.toString() ?? '',
  //       text: yardName ?? ''
  //     });
  //   }

  //   return yardNameMap.get(yardName);
  // });

  filtersVehicle.value = [
    {
      title: 'Select Yard',
      key: 'yard_id',
      items: yardFilterValues.value as any,
      width: '300px',
    },
    {
      title: 'Status',
      key: 'status',
      items: [
        { value: 'In Yard', text: 'In Yard' },
        { value: 'Out of Yard', text: 'Out of Yard' },
      ],
      width: '300px',
    }
  ];
}

const getStatusClass = (status: any) => {
  if (status != 'In Yard') {
    return 'alert';
  } else {
    return 'primary';
  }
}

watchEffect(() => {
  if (vehicleList.value) {
    initializeFilters();
  }
});
</script>
<template>
  <div class="d-flex justify-space-between">
    <span class="text-primary text-h5">Vehicles</span>
  </div>
  <div class="mt-16">
    <SharedUiCustomTable :filters="filtersVehicle" return-object show-select :headers="yardHeaders"
      :items="filteredVehicles" :loading="loading">
      <!-- <template v-slot:item.yard_id="{ item }">
        <div>
          {{ getYardName(item.yard_id) }}
        </div>
      </template> -->
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusClass(item.status)" size="small"> {{ item.status }}</v-chip>
      </template>
    </SharedUiCustomTable>
  </div>
</template>