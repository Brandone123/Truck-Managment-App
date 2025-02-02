<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="overdue" class="text-none">
          <span class="mr-1 bg-orange" style="width: 8px; height: 8px; border-radius: 50%;"></span>Overdue
          <v-chip class="ml-1 bg-orange" density="comfortable">{{ serviceReminderSummary.overdue }}</v-chip></v-tab>
        <!-- <v-tab value="completed" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Completed
          <v-chip class="ml-1 bg-primary" density="comfortable">{{ serviceReminderSummary.completed }}</v-chip></v-tab> -->
        <v-tab value="upcoming" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Upcoming
          <v-chip class="ml-1 bg-secondary" density="comfortable">{{ serviceReminderSummary.upcoming }}</v-chip></v-tab>
        <v-tab value="due soon" class="text-none">
          <span class="mr-1 bg-brown" style="width: 8px; height: 8px; border-radius: 50%;"></span>Due Soon
          <v-chip class="ml-1 bg-brown" density="comfortable">{{ serviceReminderSummary['due soon'] }}</v-chip></v-tab>
      </v-tabs>
    </div>

    <SharedUiServerTable class="custom-table" items-per-page="50" :sticky-top="true" @hoveredRow="hoveredRow = $event;"
      :sticky-top-offset="95" :showFooterInHead="false" show-select v-model="selectedItems" :headers="tableHeaders"
      :items="filteredServiceReminder" :loading="loading" @update:selectedFilters="selectedFilters = $event"
      return-object :sort-by="pagination.sortBy" :items-length="total_items" @update:options="pagination = $event">
      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="$emit('view', item.id)" append-icon="mdi-arrow-right">View Details</v-list-item>
          <v-list-item :disabled="item.program_id" @click="$emit('edit', item)"
            append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item @click="$emit('addToServiceHistory', item)" append-icon="mdi-format-float-right">Add to
            Service
            Entry</v-list-item>
          <v-list-item @click="$emit('addToWorkOrder', item)" append-icon="mdi-format-float-right">Add to Work
            Order</v-list-item>
          <v-list-item v-if="item.notifications" @click="snoozeReminder(item)" append-icon="mdi-timer-outline">Snooze
            Service Reminder</v-list-item>
          <v-list-item v-else @click="snoozeReminder(item)" append-icon="mdi-timer-outline">Remove Snooze</v-list-item>
          <!-- <v-list-item @click="$emit('edit', item)" append-icon="mdi-bell-outline">Send Notifications</v-list-item> -->
          <v-divider></v-divider>
          <v-list-item :disabled="item.program_id" @click="$emit('delete', item.id)"
            append-icon="mdi-lock">Delete</v-list-item>
        </SharedTableActionMenu>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip v-if="item.status" density="comfortable" variant="flat" :color="getStatusClass(item.status)"
          size="small">
          {{ item.status }}
        </v-chip>
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.due_date="{ item }">
        <span v-if="item.due_date" style="cursor: pointer; border-bottom: 1px dotted;">
          {{ new Date(item.due_date).toLocaleDateString('en-US') }}
          <v-tooltip activator="parent" location="top">
            {{ getRelativeDateTime(item.due_date) }}
          </v-tooltip>
        </span>
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.program_id="{ item }">
        <SharedTableDynamicServiceProgram v-if="item.service_program" :program="item.service_program" />
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.watchers="{ item }">
        <SharedTableDynamicWatcherItem :watchers="item.watching_employees" />
      </template>
      <template v-slot:item.service_task_id="{ item }">
        <SharedTableDynamicServiceTask v-if="item.service_task" :serviceTask="item.service_task" />
      </template>

      <template v-slot:item.next_due_schedule.work_order="{ item }">
        <span v-if="item.next_due_schedule?.work_order && item.next_due_schedule.work_order.status == 'in progress'">#{{
          item.next_due_schedule.work_order_id }} </span>
      </template>
      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableDynamicVehicleItem :vehicle="item.vehicle" />
      </template>

      <template v-slot:bulkActions="{ selectedItems }">
        <v-btn color="primary" class="text-none mr-2" @click="print()">
          <v-icon>mdi-printer</v-icon> Print
        </v-btn>
        <v-btn color="primary" class="text-none mr-2">
          <v-icon>mdi-send</v-icon> Send
        </v-btn>
      </template>

    </SharedUiServerTable>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { useServiceReminderStore } from '@/stores/maintenance/serviceReminders';
import type { ServiceReminder } from '@/types/maintenance/serviceReminders';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const serviceHistoryStore = useServiceHistoryStore();
const workOrderStore = useWorkOrderStore();

const serviceReminderStore = useServiceReminderStore();
const { serviceReminderList, pagination: serviceReminderPagination, serviceReminderSummary, total_items, } = storeToRefs(serviceReminderStore);

const hoveredRow = ref<number | null>(null)
const selectedFilters = ref<Record<string, string>>({})
const activeFilter = ref<string>("all");
const selectedItems = ref<Array<any>>([])
const editServiceReminderEntry = ref(false);
const serviceEntryEditDialog = ref(false);
const selectedServiceReminder = ref<Partial<ServiceReminder>>()
const workOrderEditDialog = ref(false);

const emit = defineEmits(['view', 'edit', 'delete', 'addToServiceHistory', 'addToWorkOrder']);

// const addToNewServiceEntry = () => {
//   serviceEntryEditDialog.value = true;
// }

// const closeServiceEntryEditDialog = () => {
//   serviceEntryEditDialog.value = false;
// };
// const saveServiceEntry = async (entry: any) => {
//   await serviceHistoryStore.createServiceEntry(entry);
//   serviceEntryEditDialog.value = false;
// };


// const addToServiceReminderEntryEditDialog = (serviceReminder: ServiceReminder) => {
//   selectedServiceReminder.value = serviceReminder
//   editServiceReminderEntry.value = true;
// }
// const closeServiceReminderEntryEditDialog = () => {
//   editServiceReminderEntry.value = false;
// };

// const saveServiceReminderEntry = async (serviceReminder: any) => {
//   if (serviceReminder.id) {
//     await serviceReminderStore.updateReminder(serviceReminder);
//   } else {
//     await serviceReminderStore.createReminder(serviceReminder);
//   }
//   editServiceReminderEntry.value = false;
// };

const snoozeReminder = async (serviceReminder: ServiceReminder) => {
  if (serviceReminder) {
    const payload = { ...serviceReminder, notifications: !serviceReminder.notifications }
    await serviceReminderStore.updateReminder(payload);
    await serviceReminderStore.fetchReminders(searchQuery.value)
  }
}


// const closeWorkOrderEditDialog = () => {
//   workOrderEditDialog.value = false;
// };
// const saveWorkOrder = async (workOrder: any) => {
//   await workOrderStore.createWorkOrder(workOrder);
//   workOrderEditDialog.value = false;
// };

const pagination = computed({
  get() {
    return serviceReminderPagination.value
  },
  set(value) {
    serviceReminderStore.setPagination(value);
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

watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  serviceReminderStore.fetchReminders(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    serviceReminderStore.fetchReminders(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  serviceReminderStore.fetchReminders(searchQuery.value);
})

const tableHeaders = [
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Program ID', key: 'program_id' },
  { title: 'Service Task', key: 'service_task_id' },
  { title: 'Status', key: 'status' },
  { title: 'Next Due', key: 'next_due_schedule.due_date' },
  { title: 'Active Work Order', key: 'next_due_schedule.work_order' },
  { title: 'Last Completed', key: 'last_completed_schedule.completion_date' },
  { title: 'Compliance', key: 'compliance' },
  { title: 'Watchers', key: 'watchers' },
  { title: '', key: 'actions', sortable: false, width: '200px', align: 'end' },
];

const getStatusClass = (item: any) => {
  if (item === 'Due Soon') {
    return 'brown';
  } else if (item === 'Overdue') {
    return 'orange';
  } else if (item === 'upcoming') {
    return 'secondary';
  } else if (item === 'Completed') {
    return 'primary';
  } else if (item === 'Upcoming') {
    return 'pink';
  }
  return 'gray';
}

const print = () => {
  if (selectedItems.value) {
    console.log('Print service reminders for:', selectedItems.value);
  }
}

const getRelativeDateTime = (dateString: string) => {
  const now = new Date();
  const createdAt = new Date(dateString.replace(/\//g, '-'));
  const diff = now.getTime() - createdAt.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 > 1 ? 's' : ''} remaining`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} remaining`;
  } else {
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  }
};

const getVehicleStatusColor = (status: any) => {
  switch ((status || '').toLocaleLowerCase()) {
    case 'active':
      return 'primary';
    case 'Out of Service':
      return 'error';
    case 'inactive':
      return 'secondary';
    case 'In Shop':
      return 'brown';
    default:
      return 'grey';
  }
}

const filteredServiceReminder = computed(() => {
  if (activeFilter.value == 'all') {
    return serviceReminderList.value
  }
  return serviceReminderList.value.filter(item => item.status == activeFilter.value)
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