<template>
  <div>
     <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="open" class="text-none"> 
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Open 
          <v-chip class="ml-1 bg-secondary" density="comfortable">{{ openCount}}</v-chip></v-tab>
        <v-tab value="resolved" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Resolved 
          <v-chip class="ml-1 bg-primary" density="comfortable">{{resolvedCount }}</v-chip></v-tab>
        <v-tab value="ignored" class="text-none">
          <span class="mr-1 bg-purple" style="width: 8px; height: 8px; border-radius: 50%;"></span>Ignored
          <v-chip class="ml-1 bg-purple" density="comfortable">{{ignoredCount }}</v-chip></v-tab>
        <v-tab value="pending" class="text-none">
          <span class="mr-1 bg-yellow" style="width: 8px; height: 8px; border-radius: 50%;"></span>Pending
          <v-chip class="ml-1 bg-yellow" density="comfortable">{{ pendingCount}}</v-chip></v-tab>
      </v-tabs>
    </div>

    <SharedUiCustomTable show-select items-per-page="50" :sticky-top="true" :sticky-top-offset="95" :showFooterInHead="false" :headers="tableHeaders"
      :items="filteredFaults" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" @click="$emit('delete', item.id)">mdi-delete</v-icon>
        <!-- <v-icon class="ml-2" color="secondary" @click="$emit('createIssue', item)">mdi-file-document</v-icon> -->
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" class="text-capitalize" variant="flat" :color="getStatusColor(item.status)">{{ item.status}}</v-chip>
      </template>
      <template v-slot:item.priority="{ item }">
        <v-chip density="compact" class="text-capitalize" variant="flat" style="color:" :color="getPriorityColor(item.priority)">{{ item.priority}}</v-chip>
      </template>
      <template v-slot:item.critical="{ item }">
        <span>{{ item.critical ? 'Yes' : 'No' }}</span>
      </template>
      <template v-slot:item.date_reported="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted;">
          {{ new Date(item.date_reported).toLocaleDateString('en-US') }}
          <v-tooltip activator="parent" location="top" location-strategy="connected">
            {{ getRelativeDateTime(item.date_reported) }}
          </v-tooltip>
        </span>
      </template>

      <template v-slot:item.vehicle_id="{ item }">
       <SharedTableVehicleItem type="id" :value="item.vehicle_id" />
      </template>

    </SharedUiCustomTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Fault } from '@/types/maintenance/fault';
import type { filterItem } from '~/types/layout/table';

const props = defineProps({
  faults: {
    type: Array as PropType<Fault[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const tableHeaders = [
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Fault Code', key: 'fault_code' },
  { title: 'Critical', key: 'critical' },
  { title: 'Name', key: 'name' },
  { title: 'Priority', key: 'priority' },
  // { title: 'Fault ID', key: 'id' },
  { title: 'Date Reported', key: 'date_reported' },
  // { title: 'Description', key: 'description' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getStatusColor = (status: string) => {
  switch ((status||'').toLowerCase() ) {
    case 'open':
      return 'secondary';
    case 'resolved':
      return 'primary';
    case 'pending':
      return 'yellow';
    case 'ignored':
      return 'purple';
  }
}

const getPriorityColor = (status: string) => {
  switch ((status||'').toLowerCase() ) {
    case 'low':
      return 'grey';
    case 'medium':
      return 'orange';
    case 'high':
      return 'error';
    case 'no priority':
      return 'gray';
    case 'normal':
      return 'gray';
    default:
      return 'gray';
  }
}

const activeFilter = ref<string>('all')

const filteredFaults = computed(() => {
  if (activeFilter.value == 'all') {
    return props.faults
  }
  return props.faults.filter(item => (item.status||'').toLowerCase() == activeFilter.value)
})

const pendingCount = computed(() => {
  return props.faults?.filter(item => (item.status||'').toLowerCase() == 'pending')?.length || 0
})

const openCount = computed(() => {
  return props.faults?.filter(item => (item.status||'').toLowerCase() == 'open')?.length || 0
})

const ignoredCount = computed(() => {
  return props.faults?.filter(item => (item.status||'').toLowerCase() == 'ignored')?.length || 0
})

const resolvedCount = computed(() => {
  return props.faults?.filter(item => (item.status||'').toLowerCase() == 'resolved')?.length || 0
})


const getRelativeDateTime = (dateString: any) =>{
  const now = new Date();
  const createdAt = new Date(dateString);
  const diff = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
}

const filterAssets = computed(() => {
  return [
    {
      title: 'Filter By Status',
      key: 'status',
      items:
      [
        {text: 'Open', value: 'open'}, 
        {text: 'In Progress', value: 'resolved'},
        {text: 'Closed', value: 'pending'},
        {text: 'Ignored', value: 'ignored'}
      ],
      width: '300px',
    },
    {
      title: 'Filter By Priority',
      key: 'priority',
      items: 
      [
        {text: 'Low', value: 'low'}, 
        {text: 'Medium', value: 'medium'},
        {text: 'High', value: 'high'},
        {text: 'Normal', value: 'normal'}
      ],
      width: '300px',
    }
  ] as filterItem[]
})

onMounted(() => {
  assetStore.fetchAssets()
})
</script>