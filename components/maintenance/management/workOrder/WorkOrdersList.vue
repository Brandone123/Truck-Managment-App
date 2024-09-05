<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="draft" class="text-none">
          <span class="mr-1 bg-grey" style="width: 8px; height: 8px; border-radius: 50%;"></span> Draft
          <v-chip density="compact" class="ml-1 bg-grey">{{ draftCount }}</v-chip></v-tab>
        <v-tab value="open" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span> Open
          <v-chip density="compact" class="ml-1 bg-secondary">{{ openCount }}</v-chip></v-tab>
        <v-tab value="pending" class="text-none"><span class="mr-1 bg-yellow"
            style="width: 8px; height: 8px; border-radius: 50%;"></span>Pending
          <v-chip density="compact" class="ml-1 bg-yellow">{{ pendingCount }}</v-chip></v-tab>
        <v-tab value="completed" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Completed
          <v-chip density="compact" class="ml-1 bg-primary">{{ completedCount }}</v-chip></v-tab>
      </v-tabs>
    </div>
    <SharedUiCustomTable hide-default-header class="customTable" items-per-page="50" :sticky-top="true" :sticky-top-offset="95"
      :show-footer-in-head="false" show-select :headers="tableHeaders" :items="filteredWorkOrders" :loading="loading">

      <!-- <template v-slot:headers>
          <v-data-table-headers sticky></v-data-table-headers>
      </template> -->

      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" @click="$emit('delete', item.id)">mdi-delete</v-icon>
      </template>

            <!-- <template v-slot:headers>
          <v-data-table-headers sticky></v-data-table-headers>
      </template> -->
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" class="text-capitalize"
          :variant="hasWorkInProgress(item.line_items) ? 'tonal' : 'flat'" v-if="item.status"
          :color="getStatusColor(item.status)">
          <template v-slot:prepend v-if="hasWorkInProgress(item.line_items)">
            <v-icon size="small">mdi-alarm-check</v-icon>
          </template>
          {{ item.status }}
        </v-chip>
        <span v-else></span>
      </template>

      
      <template v-slot:item.assigned_to="{ item }">
        <SharedTableTechnicianItem v-if="item.assigned_to" :userId="item.assigned_to" />
        <span v-else>N/A</span>
      </template>
      <!-- <template v-slot:item.service_tasks="{item}">
        <div v-if="service_tasks.length > 3"></div>
        <div v-else>
          <span v-for="(item,i) in item.line_items"></span>
        </div>
      </template> -->

      <template v-slot:item.line_items="{ item }">
        <div v-if="item.line_items != null">
          <div v-if="item.line_items.length <= 3" v-for="(lineItem, i) in item.line_items">
            <ServiceTaskMenu :serviceTaskId="lineItem.service_task_id" />
          </div>

          <div v-else>
            <div v-for="(lineItem, i) in item.line_items.slice(0, 3)">
              <ServiceTaskMenu :serviceTaskId="lineItem.service_task_id" />
            </div>
            <div class="text-primary">+ {{ item.line_items.length - 3 }} more</div>
          </div>
        </div>
      </template>

      <template v-slot:item.issues="{ item }">
        <div v-if="item.issues != null">
          <div v-if="item.issues.length <= 3" v-for="(issue, i) in item.issues">
            <IssueMenu :issue="issue" />
          </div>

          <div v-else>
            <div v-for="(issue, i) in item.issues.slice(0, 3)">
              <IssueMenu :issue="issue" />
            </div>
            <div class="text-primary">+ {{ item.issues.length - 3 }} more</div>
          </div>
        </div>
      </template>

      <template v-slot:item.id="{ item }">
        #{{ item.id }}
      </template>
      

      <template v-slot:item.created_at="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted;">
          {{ new Date(item.created_at).toLocaleDateString('en-US') }}
          <v-tooltip activator="parent" location="top">
            {{ getRelativeDateTime(item.created_at) }}
          </v-tooltip>
        </span>
      </template>
      
      <template v-slot:item.priority="{ item }">
        <v-chip density="compact" class="text-capitalize" variant="flat" v-if="item.priority"
          :color="getPriorityColor(item.priority)">{{
            item.priority
          }}</v-chip>
        <span v-else></span>
      </template>
      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableVehicleItem type="id" :value="item.vehicle_id" />
      </template>
    </SharedUiCustomTable>
  </div>

</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { WorkOrder } from '@/types/maintenance/workOrder';
import type { filterItem } from '~/types/layout/table';
// import { useScrollDirection } from '@/composables/useScrollDirection';
import IssueMenu from './components/WorkOrderTableIssueMenu.vue';
import ServiceTaskMenu from './components/WorkOrderTableServiceTaskMenu.vue';
import { storeToRefs } from 'pinia';

// const { scrollDirection } = useScrollDirection();
import { useStickyTableHeader } from '@/composables/useStickyTableHeader';
import moment from 'moment';

// const techniciansStore = useTechniciansStore();
// const { technicians } = storeToRefs(techniciansStore);
const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

onMounted(() => {
  // useStickyTableHeader('v-table__wrapper');
})
const props = defineProps({
  workOrders: {
    type: Array as PropType<WorkOrder[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const activeFilter = ref<string>('all')

const filteredWorkOrders = computed(() => {
  if (activeFilter.value == 'all') {
    return props.workOrders
  }
  return props.workOrders.filter(item => (item.status || '').toLocaleLowerCase() == activeFilter.value)
})

const draftCount = computed(() => {
  return props.workOrders?.filter(item => (item.status || '').toLocaleLowerCase() == 'draft')?.length || 0
})

const openCount = computed(() => {
  return props.workOrders?.filter(item => (item.status || '').toLocaleLowerCase() == 'open')?.length || 0
})

const pendingCount = computed(() => {
  return props.workOrders?.filter(item => (item.status || '').toLocaleLowerCase() == 'pending')?.length || 0
})

const completedCount = computed(() => {
  return props.workOrders?.filter(item => (item.status || '').toLocaleLowerCase() == 'completed')?.length || 0
})

const localWorkOrder = ref<Partial<WorkOrder>>(JSON.parse(JSON.stringify(props.workOrders || {})));

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);


const hasWorkInProgress = (line_items: Array<any>) => {
  return line_items?.map((lineitem: any) => lineitem.labor)?.reduce((accumulator: Array<any>, currentValue: any) => {
    return accumulator.concat(currentValue);
  }, [])
    ?.filter((item: any) => Boolean(item?.start_time) && !Boolean(item?.end_time) && Boolean(item.user_id)).length > 0
}

const tableHeaders = [
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Number', key: 'id' },
  { title: 'Status', key: 'status' },
  { title: 'Repair Priority Class', key: 'priority' },
  { title: 'Date Created', key: 'created_at' },
  { title: 'Assigned Technician', key: 'assigned_to' },
  { title: 'Service Tasks', key: 'line_items' },
  { title: 'Resolved Issues', key: 'issues' },
  // { title: 'Watchers', key: 'watchers' },
  // { title: 'Operator', key: 'operator_id' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getStatusColor = (status: string) => {
  switch ((status || '').toLocaleLowerCase()) {
    case 'completed':
      return 'primary';
    case 'pending':
      return 'yellow';
    case 'open':
      return 'secondary';
    case 'draft':
      return 'grey'
    default:
      return 'gray'
  }
}

const getPriorityColor = (status: string) => {
  switch ((status || '').toLocaleLowerCase()) {
    case 'scheduled':
      return 'green';
    case 'non-scheduled':
      return 'secondary';
    case 'emergency':
      return 'alert';
  }
}


const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}

const filterAssets = computed(() => {
  return [
    {
      title: 'Status',
      key: 'status',
      items: ['Open', 'In Progress', 'Completed'],
      width: '300px',
    },
  ] as filterItem[]
})
</script>

<style scoped>
/* .customTable :deep() thead {
  position:sticky;
  top: 0px;
  z-index: 1;
} */
</style>