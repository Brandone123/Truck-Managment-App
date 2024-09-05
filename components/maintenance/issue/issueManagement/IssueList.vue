<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="open" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Open
          <v-chip class="ml-1 bg-secondary" density="comfortable">{{ openCount }}</v-chip></v-tab>
        <v-tab value="resolved" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Resolved
          <v-chip class="ml-1 bg-primary" density="comfortable">{{ resolvedCount }}</v-chip></v-tab>
        <v-tab value="overdue" class="text-none">
          <span class="mr-1 bg-orange" style="width: 8px; height: 8px; border-radius: 50%;"></span>Overdue
          <v-chip class="ml-1 bg-orange" density="comfortable">{{ overdueCount }}</v-chip></v-tab>
        <v-tab value="closed" class="text-none">
          <span class="mr-1 bg-cyan" style="width: 8px; height: 8px; border-radius: 50%;"></span>Closed
          <v-chip class="ml-1 bg-cyan" density="comfortable">{{ closedCount }}</v-chip></v-tab>
      </v-tabs>
    </div>

    <SharedUiCustomTable show-select items-per-page="50" :sticky-top="true" :sticky-top-offset="95"
      :showFooterInHead="false" :headers="tableHeaders" :items="filteredIssues" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" @click="$emit('delete', item.id)">mdi-delete</v-icon>
        <!-- <v-icon class="ml-2" color="secondary" @click="$emit('convert', item)">mdi-file-document</v-icon> -->
      </template>
      <template v-slot:item.id="{ item }">
        <span class="text-secondary" v-bind="props" style="cursor: pointer; border-bottom: 1px dotted;"
          @click="$emit('view', item)">
          #{{ item.id }}
        </span>
      </template>

      <template v-slot:item.source="{ item }">
        <div class="text-primary" @click="openSamsaraIssue(item)"
          :style="{ cursor: item.samsara_id != null ? 'pointer' : '' }">{{ item.source }}</div>
      </template>

      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableVehicleItem type="id" :value="item.vehicle_id" />
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip class="text-capitalize" density="compact" variant="flat"
          v-if="typeof item.status === 'string' && (item.status !== '1' && item.status !== '0')"
          :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
      </template>

      <template v-slot:item.priority="{ item }">
        <v-chip density="compact" v-if="item.priority" :color="getPriorityColor(item.priority)">{{ item.priority
          }}</v-chip>
        <span v-else></span>
      </template>

      <!-- Assignment -->
      <template v-slot:item.assigned_to="{ item }">
        <SharedTableTechnicianItem v-if="item.assigned_to" :user-id="item.assigned_to" />
      </template>

      <template v-slot:item.watchers="{ item }">
        <v-menu location="bottom" max-height="310px" width="320px" location-strategy="connected"
          :close-on-content-click="true" class="rounded" open-on-hover>
          <template v-slot:activator="{ props }">
            <div v-if="item.watchers" v-bind="props" class="mr-2" style="cursor: pointer; border-bottom: 1px dotted;">
              {{ item.watchers ? (item.watchers.length === 1 ? '1 watcher' : item.watchers.length + ' watchers') : '' }}
            </div>
          </template>
          <v-row no-gutters>
            <v-col cols="12">
              <v-card class="rounded-lg">
                <v-card-text>
                  <div class="mb-3">
                    <div v-if="authStore.user?.id !== item.watchers[0]">
                      <div class="font-weight-bold text-h6">Not Watching</div>
                      <span>
                        You're not watching this record, so you will not receive any <b class="text-secondary">Watched
                          Notifications</b> .
                      </span>
                      <div class="mt-4 mb-4">
                        <span class="rounded pa-1 watch" style="border: 1px solid silver;cursor: pointer;">
                          <v-icon style="font-size:medium">mdi-bell-outline</v-icon> Watch
                        </span>
                      </div>
                    </div>
                    <v-divider class="my-2"></v-divider>
                    <span class="text-grey mt-3 mb-4">
                      {{ item.watchers ? (item.watchers.length === 1 ? 'WATCHER: 1' : ' WATCHERS: ' +
                        item.watchers.length ) : ''
                      }}
                    </span>
                    <div v-for="(watcherId, index) in item.watchers" :key="index" v-if="item.watchers">
                      <v-chip class="mb-2" variant="text"
                        :prepend-avatar="getAvatarIcon(getTechnicianName(watcherId)?.full_name)">
                        <span v-bind="props" class="text-secondary"
                          style="cursor: pointer; border-bottom: 1px dotted;">{{
                            getTechnicianName(watcherId)?.full_name ?
                              getTechnicianName(watcherId)?.full_name : 'N/A' }}
                        </span>
                      </v-chip>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-menu>
      </template>
      <template v-slot:item.reported_date="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small">
          {{ new Date(item.reported_date).toLocaleDateString('en-US') }}
          <v-tooltip activator="parent" location="top" location-strategy="connected">
            {{ getRelativeDateTime(item.reported_date) }}
          </v-tooltip>
        </span>
      </template>
    </SharedUiCustomTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Issues } from '@/types/maintenance/issue';
import type { filterItem } from '~/types/layout/table';

const props = defineProps({
  issues: {
    type: Array as PropType<Issues[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const authStore = useAuthStore()

const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const activeFilter = ref<string>('all')

const filteredIssues = computed(() => {
  if (activeFilter.value == 'all') {
    return props.issues
  }
  return props.issues.filter(item => item.status == activeFilter.value)
})

const closedCount = computed(() => {
  return props.issues?.filter(item => item.status == 'closed')?.length || 0
})

const openCount = computed(() => {
  return props.issues?.filter(item => item.status == 'open')?.length || 0
})

const overdueCount = computed(() => {
  return props.issues?.filter(item => item.status == 'overdue')?.length || 0
})

const resolvedCount = computed(() => {
  return props.issues?.filter(item => item.status == 'resolved')?.length || 0
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

const getRelativeDateTime = (dateString: any) => {
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

function getAvatarIcon(label: any) {
  const size = 50;
  const circleSize = 50;

  // Générer les initiales à partir du label
  const words = label.split(' ');
  const initials = words.map((word: any) => word.charAt(0).toUpperCase());

  // Créer un canvas et un contexte 2D
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  // Générer une couleur unique et légère pour l'avatar
  const colorHash = label.split('').reduce((acc: number, char: string) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
  const hue = (colorHash % 360);
  const saturation = 80;
  const lightness = 70;
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Dessiner le fond avec la couleur légère
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, circleSize / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Dessiner les initiales en blanc
  ctx.font = `${(circleSize * 0.6)}px Arial`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials.slice(0, 2).join(''), size / 2, size / 2);

  return canvas.toDataURL();
}



const getStatusColor = (status: any) => {
  switch ((status || '').toLowerCase()) {
    case 'open':
      return 'secondary';
    case 'overdue':
      return 'orange';
    case 'closed':
      return 'cyan';
    case 'resolved':
      return 'primary';
  }
}

const openSamsaraIssue = (issue: any) => {
  if (issue.samsara_id) {
    window.open(`https://cloud.samsara.com/o/46837/fleet/maintenance/dvir/${issue.samsara_id}`, '_blank')
  } else {

  }
}

const getPriorityColor = (status: any) => {
  switch ((status || '').toLowerCase()) {
    case 'low':
      return 'grey';
    case 'medium':
      return 'orange';
    case 'high':
      return 'error';
    case 'no priority':
      return 'gray';
    default:
      return 'gray';
  }
}


const tableHeaders = [
  { title: 'Priority', key: 'priority' },
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Issue', key: 'id' },
  { title: 'Status', key: 'status' },
  { title: 'Source', key: 'source' },
  { title: 'Date Reported', key: 'reported_date' },
  { title: 'Assigned', key: 'assigned_to' },
  { title: 'Watchers', key: 'watchers' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getTechnicianName = (userId: any) => {
  const technicianName = technicians.value.find((technician) => technician.user_id === userId)
  return technicianName
}

const filterAssets = computed(() => {
  return [
    {
      title: 'Status',
      key: 'status',
      items: [{ text: 'Passed', value: 'passed' }, { text: 'Failed', value: 'failed' }, { text: 'Pending', value: 'pending' }],
      width: '300px',
    },
  ] as filterItem[]
})

onMounted(() => {
  employeeStore.fetchEmployeeList();
  assetStore.fetchAssets();
})
</script>

<style scope></style>