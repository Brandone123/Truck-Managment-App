<template>
  <SharedUiServerTable class="custom-table" show-select :showFooterInHead="false" :headers="tableHeaders"
    :items="servicePrograms" :loading="loading" @update:selectedFilters="selectedFilters = $event" :selectable="true"
    v-model="selectedItems" return-object :items-per-page="pagination.itemsPerPage" @hoveredRow="hoveredRow = $event;"
    :sort-by="pagination.sortBy" :items-length="total_items" @update:options="pagination = $event">
    <template v-slot:item.actions="{ item, index }">
      <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
        <v-list-item @click="viewDetails(item.id)" append-icon="mdi-eye">View</v-list-item>
        <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
        <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
      </SharedTableActionMenu>
    </template>
    <template v-slot:item.id="{ item }">
      <span style="cursor: pointer;" class="text-primary font-weight-bold" dense @click="viewDetails(item.id)">
        {{ item.id }}
      </span>
    </template>
    <!-- <template v-slot:item.program_name="{ item }">
      <SharedTableDynamicServiceProgram :program ="item.service_program"/>
    </template> -->

    <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
      <!-- <v-btn color="primary" class="text-none mr-2" @click="">
        Export Selected
      </v-btn> -->
    </template>
    <template v-slot:item.vehicles="{ item }">
      <span @click="viewTabDetails(item.id, 'vehicle')" style="cursor: pointer; border-bottom: 1px dotted;"
        class="text-secondary font-weight-bold" dense>
        {{ item.vehicles?.length || 0 }}
      </span>
    </template>
    <template v-slot:item.program_schedules="{ item }">
      <span @click="viewTabDetails(item.id, 'overview')" style="cursor: pointer; border-bottom: 1px dotted;"
        class="text-secondary font-weight-bold" dense>
        {{ item.program_schedules?.flatMap((v: any) => v.service_tasks.map((task: any) => task.id)).length || 0 }}
      </span>
    </template>
    <template v-slot:item.primary_meter_utilization="{ item }">
      <span>{{ item.primary_meter_utilization.charAt(0).toUpperCase() + item.primary_meter_utilization.slice(1)
        }}</span>
    </template>
  </SharedUiServerTable>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { ServiceProgram } from '@/types/maintenance/ServiceProgram';
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
const hoveredRow = ref<number | null>(null)

const tableHeaders = [
  { title: 'Program ID', key: 'id' },
  { title: 'Program Name', key: 'program_name' },
  { title: 'Description', key: 'description' },
  { title: 'Number of Tasks', key: 'program_schedules' },
  { title: 'Number of Vehicles', key: 'vehicles' },
  { title: 'Primary Meter', key: 'primary_meter_utilization' },
  { title: '', key: 'actions', sortable: false, width: '200px', align: 'end' },
];

const serviceProgramStore = useServiceProgramStore();
const { servicePrograms, total_items, pagination: programPagination, serviceProgramsSummary } = storeToRefs(serviceProgramStore);

const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const activeFilter = ref<string>('all')

const viewDetails = (programId: number) => {
  router.push(`ServicePrograms/${programId}`)
}

const viewTabDetails = (programId: number, tab: string) => {
  router.push(`ServicePrograms/${programId}?tab=${tab}`)
}

const pagination = computed({
  get() {
    return programPagination.value
  },
  set(value) {
    serviceProgramStore.setPagination(value);
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

  return payload
})

onMounted(() => {
  serviceProgramStore.fetchServicePrograms(searchQuery.value)
})

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  serviceProgramStore.fetchServicePrograms(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    serviceProgramStore.fetchServicePrograms(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  serviceProgramStore.fetchServicePrograms(searchQuery.value);
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