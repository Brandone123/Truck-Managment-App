<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="pending" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span> Pending
          <v-chip density="compact" class="ml-1 bg-secondary">{{ pendingCount }}</v-chip></v-tab>
        <v-tab value="passed" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span> Passed
          <v-chip density="compact" class="ml-1 bg-primary">{{ passedCount }}</v-chip></v-tab>
        <v-tab value="failed" class="text-none"><span class="mr-1 bg-error"
            style="width: 8px; height: 8px; border-radius: 50%;"></span>Failed
          <v-chip density="compact" class="ml-1 bg-error">{{ failedCount }}</v-chip></v-tab>
      </v-tabs>
    </div>

    <SharedUiCustomTable items-per-page="50" :sticky-top="true" :sticky-top-offset="95" show-select
      :filters="filterAssets" :showFooterInHead="false" :headers="tableHeaders" :items="filteredInspections"
      :loading="loading">

      <template v-slot:item.id="{ item }">
        <span style="cursor: pointer;" class="text-primary font-weight-bold" dense @click="$emit('view', item)">
          {{ item.id }}
        </span>
      </template>

      <template v-slot:item.inspection_form_id="{ item }">
        {{ getFormName(item.inspection_form_id) }}
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip density="compact" variant="flat" :color="getStatusColor(item.status)">
          {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" @click="$emit('delete', item.id)">mdi-delete</v-icon>
      </template>
      <!-- Slot to capture bulk actions -->
      <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
        <v-btn color="primary" class="text-none mr-2" @click="">
          <!-- <v-icon>mdi-printer</v-icon> -->
          Export Selected
        </v-btn>
      </template>
      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableVehicleItem :value="item.vehicle_id" type="id" />
      </template>
      <template v-slot:item.submitted_on="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small">
          {{ new Date(item.submitted_on).toLocaleDateString('en-US',
            { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) }}
        </span>
        <v-tooltip activator="parent" location="top">
          {{ getRelativeDateTime(item.submitted_on) }}
        </v-tooltip>
      </template>
      <template v-slot:item.failed_items="{ item }">
        <div v-if="item.failed_items?.length" v-for="(fail) in item.failed_items">
          <span>{{ fail }}</span>
        </div>
        <span v-else>N/A</span>
      </template>
    </SharedUiCustomTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Inspection } from '@/types/maintenance/inspection';
import type { filterItem } from '~/types/layout/table';
import moment from 'moment'

const inspectionFormStore = useInspectionFormStore();

const { forms } = storeToRefs(inspectionFormStore);

const getFormName = (form_id: number) => {
  return forms.value.find(form => form.id == form_id)?.name;
}

const props = defineProps({
  inspections: {
    type: Array as PropType<Inspection[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'secondary';
    case 'passed':
      return 'primary';
    case 'failed':
      return 'error';
  }
}

const tableHeaders = [
  { title: 'Vehicle', key: 'vehicle_id' },
  // { title: 'Inspection ID', key: 'id' },
  { title: 'Submitted', key: 'submitted_on' },
  { title: 'Duration (Mins)', key: 'duration_minutes' },
  {
    title: 'Inspaction Form',
    key: 'inspection_form_id',
    render: (value: any) => {
      return getFormName(value)
    }
  },
  {
    title: 'Submitted By',
    key: 'submitted_by_user.name',
    render: (value: any) => {
      if (value) {
        return `<b>${value}</b>`;
      } else {
        return 'N/A';
      }
    }
  },
  { title: 'Failed Items', key: 'failed_items' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const filterAssets = computed(() => {
  return [
    {
      title: 'Form',
      key: 'type',
      // items: [{ text: 'Daily', value: 'daily' }, { text: 'Pre-Trip', value: 'pre-trip' }, { text: 'Post-Trip', value: 'post-trip' }],
      items: forms.value.map(form => { return { text: form.name, value: form.id } }) as any[] || [],
      width: '300px',
    },
  ] as filterItem[]
})

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const getVehicle = (vehicleId: any) => {
  return assetList.value.find((vehicle) => vehicle.id === vehicleId)
}

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString)?.fromNow()
}

const activeFilter = ref<string>('all')

const filteredInspections = computed(() => {
  if (activeFilter.value == 'all') {
    return props.inspections
  }
  return props.inspections.filter(item => (item.status||'').toLowerCase() == (activeFilter.value || '').toLowerCase())
})

const pendingCount = computed(() => {
  return props.inspections?.filter(item => (item.status||'').toLowerCase() == 'pending')?.length || 0
})

const passedCount = computed(() => {
  return props.inspections?.filter(item => (item.status||'').toLowerCase() == 'passed')?.length || 0
})

const failedCount = computed(() => {
  return props.inspections?.filter(item => (item.status||'').toLowerCase() == 'failed')?.length || 0
})
</script>