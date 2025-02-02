<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="pending" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span> Pending
          <v-chip density="compact" class="ml-1 bg-secondary">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ inspectionSummary?.pending || 0 }}</span>
          </v-chip>
        </v-tab>

        <v-tab value="passed" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span> Passed
          <v-chip density="compact" class="ml-1 bg-primary">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ inspectionSummary?.passed || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="failed" class="text-none"><span class="mr-1 bg-error"
            style="width: 8px; height: 8px; border-radius: 50%;"></span>Failed
          <v-chip density="compact" class="ml-1 bg-error">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ inspectionSummary?.failed || 0 }}</span>
          </v-chip></v-tab>
      </v-tabs>
    </div>

    <SharedUiServerTable class="custom-table" :sticky-top="true" :sticky-top-offset="94" show-select
      :filters="filterAssets" :showFooterInHead="false" :headers="tableHeaders" :items="filteredInspections"
      :loading="loading" @update:selectedFilters="selectedFilters = $event" :selectable="true" v-model="selectedItems"
      return-object :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" :items-length="total_items"
      @update:options="pagination = $event" @hoveredRow="hoveredRow = $event;">

      <template v-slot:item.id="{ item }">
        <span style="cursor: pointer;" class="text-primary font-weight-bold" dense
          @click="$emit('viewDetails', item.id)">
          {{ item.id }}
        </span>
      </template>
      <!-- <template v-slot:item.inspection_form_id="{ item }">
        {{ item.related_inspection_form
          ?.name || getFormName(item.inspection_form_id) }}

      </template> -->

      <template v-slot:item.submitted_by_user="{ item }">
        <!-- {{ item.submitted_by_user?.name }} -->
        <SharedTableDynamicTechnicianItem :technician="item.submitted_by_user" />
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip density="compact" variant="flat" class="text-capitalize" :color="getStatusColor(item.status)">
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="$emit('viewDetails', item.id)" append-icon="mdi-eye">View</v-list-item>
          <!-- <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item> -->
          <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu>
      </template>
      <!-- Slot to capture bulk actions -->
      <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
        <!-- <v-btn color="primary" class="text-none mr-2" @click="">]
          Export Selected
        </v-btn> -->
      </template>

      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableDynamicVehicleItem :vehicle="item.vehicle" />
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
        <div v-if="item.failed_items.length">
          <div v-if="item.failed_items.length <= 2" v-for="(failed_item, i) in item.failed_items" :key="i">
            <span>{{ failed_item.item }}</span>
          </div>

          <div v-else>
            <div v-for="(failed_item, i) in item.failed_items.slice(0, 2)" :key="i">
              <span>{{ failed_item.item }}</span>
            </div>
            <div class="text-primary">+ {{ item.failed_items.length - 2 }} more</div>
          </div>
        </div>
        <span v-else>--</span>
      </template>
    </SharedUiServerTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Inspection } from '@/types/maintenance/inspection';
import moment from 'moment'

const inspectionFormStore = useInspectionFormStore();
const { forms } = storeToRefs(inspectionFormStore);

const inspectionStore = useInspectionStore();
const {
  loadingSummary,
  total_items,
  pagination: inspectionPagination,
  loading,
  inspectionSummary,
  getInspectionsList
} = storeToRefs(inspectionStore);

// const getFormName = (form_id: number) => {
//   return forms.value.find(form => form.id == form_id)?.name;
// }

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

const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)

const getStatusColor = (status: string) => {
  switch ((status || '').toLowerCase()) {
    case 'pending':
      return 'secondary';
    case 'passed':
      return 'primary';
    case 'failed':
      return 'error';
  }
}

const tableHeaders = [
  { title: 'Inspection ID', key: 'id' },
  { title: 'Vehicle', key: 'vehicle_id' },
  // { title: 'Inspection ID', key: 'id' },
  { title: 'Submitted', key: 'submitted_on' },
  { title: 'Duration (Mins)', key: 'duration_minutes' },
  {
    title: 'Inspection Form',
    key: 'inspection_form.name',
    // render: (value: any) => {
    //   return getFormName(value)
    // }
  },
  {
    title: 'Submitted By',
    key: 'submitted_by_user',
    // render: (value: any) => {
    //   if (value) {
    //     return `<b>${value}</b>`;
    //   } else {
    //     return 'N/A';
    //   }
    // }
  },
  { title: 'Failed Items', key: 'failed_items' },
  { title: 'Status', key: 'status' },
  { title: '', key: 'actions', sortable: false, minWidth: '50', align: 'end' },
];

const filterAssets = computed(() => {
  return [
    {
      title: 'Form',
      key: 'inspection_form_id',
      items: forms.value.map(form => ({ text: form.name, value: form.id })),
      width: '300px',
    },
  ]
})

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

// const getVehicle = (vehicleId: any) => {
//   return inspections.value.find((vehicle) => vehicle.id === vehicleId)
// }

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString)?.fromNow()
}

const activeFilter = ref<string>('all')

const filteredInspections = computed(() => {
  if (activeFilter.value == "all") {
    return getInspectionsList.value;
  }
  return getInspectionsList.value.filter(
    (item) => item.status == activeFilter.value
  );
});

const pagination = computed({
  get() {
    return inspectionPagination.value
  },
  set(value) {
    inspectionStore.setPagination(value);
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
    payload['filters'].status = activeFilter.value
  }

  return payload
})

onMounted(() => {
  inspectionFormStore.fetchForms({})
  inspectionStore.fetchInspections(searchQuery.value);
})


watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  inspectionStore.fetchInspections(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    inspectionStore.fetchInspections(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  inspectionStore.fetchInspections(searchQuery.value);
})
</script>


<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}
</style>