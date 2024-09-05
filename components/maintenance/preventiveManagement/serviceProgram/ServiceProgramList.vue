<template>
  <!-- <SharedUiCustomTable show-select :filters="filterAssets" :showFooterInHead="false" :headers="tableHeaders"
    :items="servicePrograms" :loading="loading"> -->
  <SharedUiCustomTable show-select :showFooterInHead="false" :headers="tableHeaders" :items="servicePrograms"
    :loading="loading">
    <template v-slot:item.actions="{ item }">
      <v-icon class="ml-2" color="primary" @click="viewDetails(item.id)">mdi-eye</v-icon>
      <v-icon class="ml-2" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
      <v-icon class="ml-2" color="red" @click="$emit('delete', item.id)">mdi-delete</v-icon>
    </template>

    <template v-slot:item.program_name="{ item }">
      <div class="d-flex" style="align-items: center;">
        <div>
          <div class="rounded position-relative"
            style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
            <span style="font-size:xx-small;" v-if="item.program_name">{{
              item.program_name.slice(0, 3).toUpperCase() }}</span>
            <span v-else style="font-size:xx-small;">PRO</span>
          </div>
        </div>
        <div>
          <span class="ml-2" v-bind="props"
            style="justify-content: center; align-items: center;text-align: center;">
            {{ item.program_name }}
          </span>
        </div>
      </div>
    </template>

    <!-- Slot to capture bulk actions -->
    <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
      <v-btn color="primary" class="text-none mr-2" @click="">
        <!-- <v-icon>mdi-printer</v-icon> -->
        Export Selected
      </v-btn>
    </template>
    <template v-slot:item.subscribed_vehicles.length="{ item }">
        <span @click="viewTabDetails(item.id, 'vehicle')"
        style="cursor: pointer; border-bottom: 1px dotted;" class="text-secondary font-weight-bold" dense>
          {{ item.subscribed_vehicles.length }}
        </span>
    </template>
    <template v-slot:item.subscribed_tasks.length="{ item }">
        <span @click="viewTabDetails(item.id, 'overview')"
        style="cursor: pointer; border-bottom: 1px dotted;" class="text-secondary font-weight-bold" dense>
          {{ item.subscribed_tasks.length }}
        </span>
    </template>
    <template v-slot:item.primary_meter_utilization="{ item }">
      <span>{{ item.primary_meter_utilization.charAt(0).toUpperCase() + item.primary_meter_utilization.slice(1) }}</span>
    </template>
  </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { ServiceProgram } from '@/types/maintenance/ServiceProgram';
import type { filterItem } from '~/types/layout/table';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  servicePrograms: {
    type: Array as PropType<ServiceProgram[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const tableHeaders = [
  // { title: 'Program ID', key: 'id' },
  { title: 'Program Name', key: 'program_name' },
  // { title: 'Description', key: 'description' },
  { title: 'Number of Tasks', key: 'subscribed_tasks.length' },
  { title: 'Number of Vehicles', key: 'subscribed_vehicles.length' },
  { title: 'Primary Meter', key: 'primary_meter_utilization' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'primary';
    case 'inactive':
      return 'error';
    default:
      return 'grey'
  }
}


const viewDetails = (programId: number) => {
  router.push(`serviceProgram/details/${programId}`)
}

const viewTabDetails = (programId: number, tab: string) => {
  router.push(`serviceProgram/details/${programId}?tab=${tab}`)
}

// const filterAssets = computed(() => {
//   return [
//     {
//       title: 'Status',
//       key: 'status', 
//       items: ['Active', 'Inactive'],
//       width: '300px',
//     },
//   ] as filterItem[]
// })
</script>