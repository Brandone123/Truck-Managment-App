<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="Open" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Open
          <v-chip class="ml-1 bg-secondary" density="comfortable">{{ openCount }}</v-chip></v-tab>
        <v-tab value="Resolved" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Resolved
          <v-chip class="ml-1 bg-primary" density="comfortable">{{ resolvedCount }}</v-chip></v-tab>
        <v-tab value="Acknowledged" class="text-none">
          <span class="mr-1 bg-orange" style="width: 8px; height: 8px; border-radius: 50%;"></span>Acknowledged
          <v-chip class="ml-1 bg-orange" density="comfortable">{{ ackCount }}</v-chip></v-tab>
        <v-tab value="Needs Action" class="text-none">
          <span class="mr-1 bg-error" style="width: 8px; height: 8px; border-radius: 50%;"></span>Needs Action
          <v-chip class="ml-1 bg-error" density="comfortable">{{ actionCount }}</v-chip></v-tab>
        <v-tab value="pending" class="text-none">
          <span class="mr-1 bg-yellow" style="width: 8px; height: 8px; border-radius: 50%;"></span>Pending
          <v-chip class="ml-1 bg-yellow" density="comfortable">{{ pendingCount }}</v-chip></v-tab>
      </v-tabs>
    </div>
    <SharedUiCustomTable show-select items-per-page="50" :sticky-top="true" :sticky-top-offset="95"
      :showFooterInHead="false" :headers="tableHeaders" :items="recalls" :loading="loading">
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" variant="flat" v-if="(item.status || '').toLowerCase() === 'needs_action'"
          :color="getStatusColor(item.status)">
          Needs Action
        </v-chip>
        <v-chip density="compact" variant="flat" v-else :color="getStatusColor(item.status)">
          {{ statuses[item.status.toLocaleLowerCase()] }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" @click="$emit('delete', item.id)">mdi-delete</v-icon>
        <!-- <v-icon class="ml-2" color="red" @click="$emit('createIssue', item)">mdi-file-document</v-icon> -->
      </template>
      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableVehicleItem type="id" :value="item.vehicle_id" />
      </template>

      <template v-slot:item.issued_date="{ item }">

        <span style="cursor: pointer; border-bottom: 1px dotted;">
          {{ item.issued_date }}
          <v-tooltip activator="parent" location="top">
            {{ getRelativeDateTime(item.issued_date) }}
          </v-tooltip>
        </span>
      </template>
      <template v-slot:item.summary="{ item }">
        <span>{{ item.summary.length > 100 ? item.summary.slice(0, 100) + '...' : item.summary }}</span>
      </template>
    </SharedUiCustomTable>
  </div>

</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Recall } from '@/types/maintenance/recall';
import type { filterItem } from '~/types/layout/table';

const props = defineProps({
  recalls: {
    type: Array as PropType<Recall[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const getStatusColor = (status: string) => {
  switch ((status || '').toLocaleLowerCase()) {
    case 'open':
      return 'secondary';
    case 'needs_action':
      return 'error';
    case 'resolved_issue':
    case 'resolved':
      return 'primary';
    case 'acknowledged':
      return 'orange';
    case 'pending':
      return 'yellow';
    default:
      return 'grey'
  }
}

const tableHeaders = [
  // { title: 'Recall ID', key: 'id' },
  { title: 'Vehicle', key: 'vehicle_id' },
  // { title: 'Date Imported', key: 'date' },
  { title: 'Issued At', key: 'issued_date' },
  { title: 'Summary', key: 'summary' },
  { title: 'Status', key: 'status' },
  { title: 'NHTSA Campaign Number', key: 'nhtsa_campaign_number' },
  // { title: 'Summary', key: 'summary' },

  { title: 'Actions', key: 'actions', sortable: false },
];


const statuses = ref({
  needs_action: 'Needs Action',
  open: 'Open',
  resolved_issue: 'Resolved',
  acknowledged: 'Acknowledged',
  resolved: 'Resolved',
  pending: 'Pending',
})


const activeFilter = ref<string>('all')

const filteredFaults = computed(() => {
  if (activeFilter.value == 'all') {
    return props.recalls
  }
  return props.recalls.filter(item => (item.status || '').toLocaleLowerCase() == activeFilter.value)
})

const actionCount = computed(() => {
  return props.recalls?.filter(item => (item.status || '').toLocaleLowerCase() == 'needs_action')?.length || 0
})

const pendingCount = computed(() => {
  return props.recalls?.filter(item => (item.status || '').toLocaleLowerCase() == 'pending')?.length || 0
})

const openCount = computed(() => {
  return props.recalls?.filter(item => (item.status || '').toLocaleLowerCase() == 'open')?.length || 0
})

const ackCount = computed(() => {
  return props.recalls?.filter(item => (item.status || '').toLocaleLowerCase() == 'acknowledged')?.length || 0
})

const resolvedCount = computed(() => {
  return props.recalls?.filter(item => ['resolved', 'resolved_issue'].includes((item.status || '').toLocaleLowerCase()))?.length || 0
})

const filterAssets = computed(() => {
  return [
    {
      title: 'Status',
      key: 'status',
      // items: [{ text: 'Passed', value: 'passed' }, { text: 'Failed', value: 'failed' }, { text: 'Needs Action', value: 'pending' }],
      items: [
        { text: 'Needs Action', value: 'needs_action' },
        { text: 'Open', value: 'open' },
        { text: 'Resolved', value: 'resolved_issue' },
        { text: 'Acknowledged', value: 'acknowledged' }
      ],
      width: '300px',
    },
  ] as filterItem[]
})


const getRelativeDateTime = (dateString: string) => {
  const now = new Date();
  const createdAt = new Date(dateString.replace(/\//g, '-'));
  const diff = now.getTime() - createdAt.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};
</script>