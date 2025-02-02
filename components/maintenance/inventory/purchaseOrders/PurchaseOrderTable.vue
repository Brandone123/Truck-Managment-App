<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="draft" class="text-none">
          <span class="mr-1 bg-grey" style="width: 8px; height: 8px; border-radius: 50%;"></span>Draft
          <v-chip class="ml-1 bg-grey" density="comfortable">{{ draftCount }}</v-chip>
        </v-tab>
        <v-tab value="approved" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Approved
          <v-chip class="ml-1 bg-primary" density="comfortable">{{ approvedCount }}</v-chip>
        </v-tab>
        <v-tab value="rejected" class="text-none">
          <span class="mr-1 bg-red" style="width: 8px; height: 8px; border-radius: 50%; color:red"></span>Rejected
          <v-chip class="ml-1 bg-red" density="comfortable">{{ rejectedCount }}</v-chip>
        </v-tab>
        <v-tab value="closed" class="text-none">
          <span class="mr-1 bg-cyan" style="width: 8px; height: 8px; border-radius: 50%;"></span>Closed
          <v-chip class="ml-1 bg-cyan" density="comfortable">{{ closedCount }}</v-chip>
        </v-tab>
        <v-menu>
          <template v-slot:activator="{ props }">
            <div class="d-inline-flex align-center v-tab text-none" v-bind="props" style="cursor:pointer">
              More
              <v-icon>mdi-chevron-down</v-icon>
            </div>
          </template>
          <v-list>
            <v-list-item v-for="(tab, index) in additionalTabs" :key="index" @click="activeFilter = tab.value"
              color="primary" density="compact" class="text-none">
              <v-list-item-title class="d-inline-flex align-center">
                <div :class="`mr-1 bg-${tab.color}`" style="width: 8px; height: 8px; border-radius: 50%;"></div>
                {{ tab.title }}
                <v-chip v-if="tab.count" :class="`ml-1 bg-${tab.color}`" density="comfortable">{{ tab.count }}</v-chip>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-tabs>
    </div>

    <SharedUiServerTable class="custom-table" :show-footer-in-head="false" :headers="headers" :items="purchaseOrderList"
      :loading="loading" @update:selectedFilters="selectedFilters = $event" :sticky-top="true" :sticky-top-offset="96"
      v-model="selectedItems" return-object :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy"
      :items-length="total_items" @update:options="pagination = $event" @hoveredRow="hoveredRow = $event;">
      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="$emit('view', item)" append-icon="mdi-eye">View Details</v-list-item>
          <v-divider></v-divider>
          <v-list-item append-icon="mdi-check" v-if="item.status == 'draft'"
            @click="$emit('approved', item.id)">Approve</v-list-item>
          <v-list-item append-icon="mdi-invlice-list-outline" v-if="item.status == 'approved'"
            @click="$emit('purchased', item.id)">Mark As Purchased</v-list-item>
          <v-list-item @click="$emit('receive', item)" append-icon="mdi-package-variant-closed"
            v-if="['purchased', 'received, partial'].includes(item.status)">Receive</v-list-item>
          <v-list-item @click="$emit('closed', item)"
            v-if="['received, full'].includes(item.status)">Close</v-list-item>
          <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item @click="$emit('delete', item)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu>
        <!-- <div class="d-flex">
          <v-icon class="ml-2" color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" dense @click="$emit('delete', item)">mdi-delete</v-icon>
        </div> -->
      </template>

      <template v-slot:filters>
        <div class="d-inline-flex">
          <!-- <SharedInputPartCategoryAutoCompleteInput width="200px" flat density="compact" hide-details variant="solo"
            class="filter-input mr-1" v-model="selectedFilters.category_id" /> -->
          <SharedInputPartLocationAutoCompleteInput width="200px" flat density="compact" hide-details variant="solo"
            class="filter-input mr-1" v-model="selectedFilters.location_id" />
          <SharedInputPartSuppliersAutoCompleteInput label="Vendor" flat width="200px" density="compact" hide-details
            variant="solo" class="filter-input mr-1" v-model="selectedFilters.vendor_id" />
        </div>
      </template>

      <template v-slot:item.id="{ item }">
        <span style="cursor: pointer;" class="text-primary font-weight-bold" dense @click="$emit('view', item)">
          #{{ item.id }}
        </span>
      </template>

      <template v-slot:item.parts="{ item }">
        <span class="font-weight-semibold" style="cursor: pointer; font-size: small">
          {{ formatPartsNumbers(item.parts).name + ` ` }}
        </span>
        <span class="text-primary font-weight-bold" style="cursor: pointer; font-size: small">
          {{ formatPartsNumbers(item.parts).count > 0 ? `+${formatPartsNumbers(item.parts).count} more` : '' }}
        </span>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip density="compact" variant="flat" v-if="item.status" :color="getStatusColor(item.status)">
          {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}</v-chip>
        <span v-else></span>
      </template>

      <template v-slot:item.vendor="{ item }">
        <span class="text-secondary" style="cursor: pointer;" v-if="item.vendor">
          <v-icon size="18">mdi-store</v-icon>
          <span style="border-bottom: 1px dotted;">{{ item.vendor?.name }}</span>
        </span>
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.description="{ item }">
        <div v-if="item.description != null">
          <span :style="{ 'border-bottom': item.description.length > 40 ? '1px dotted' : 'none' }">
            {{ item.description.length > 40 ? item.description.slice(0, 40) + '...' : item.description }}
          </span>
          <v-tooltip activator="parent" location="top" v-if="item.description.length > 40">
            <pre>{{ item.description }}</pre>
          </v-tooltip>
        </div>
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.created_by="{ item }">
        <SharedTableDynamicTechnicianItem :technician="(item.created_by_user as EmployeeInfo)" v-if="item.created_by" />
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.created_at="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted;">
          {{ new Date(item.created_at).toLocaleDateString('en-US') }}
        </span>
        <v-tooltip activator="parent" location="top">
          {{ getRelativeDateTime(item.created_at) }}
        </v-tooltip>
      </template>

      <template v-slot:item.total_amount="{ item }">
        <span>${{ item.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }}</span>
      </template>
      <template v-slot:item.watchers="{ item }">
        <SharedTableDynamicWatcherItem :watchers="item.watching_employees" />

        <!-- <v-menu location="bottom" max-height="310px" width="320px" location-strategy="connected"
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
              item.watchers.length) :
              '' }}
            </span>
            <div v-for="(watcherId, index) in item.watchers" :key="index" v-if="item.watchers" class="mb-1">
              <SharedTableTechnicianItem v-if="item.created_by" :user-id="watcherId" />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  </v-menu> -->
      </template>
    </SharedUiServerTable>
  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { usePurchaseOrderStore } from '@/stores/maintenance/purchaseOrderStore';
import type { filterItem } from '~/types/layout/table';
import moment from 'moment'
import type { EmployeeInfo } from '~/types/store/employee';
import type { PurchasePart } from '~/types/maintenance/purchaseOrderTypes';
const selectedFilters = ref<Record<string, string>>({})
const activeFilter = ref<string>("all");
const selectedItems = ref<Array<any>>([])
const hoveredRow = ref<number | null>(null)


const authStore = useAuthStore()

const emit = defineEmits(['view', 'edit', 'delete', 'approved', 'receive', 'purchased', 'closed']);

const purchaseOrderStore = usePurchaseOrderStore();
const { purchaseOrderList, pagination: purchaseOrderPagination, loadingSummary, total_items, loading } = storeToRefs(purchaseOrderStore)

const suppliersStore = useSuppliersStore();
const suppliers = computed(() => suppliersStore.suppliers);

const formatPartsNumbers = (parts: PurchasePart[]) => {
  const partNumbers = parts?.map(part => part.part_number).filter(part_number => part_number); // Filter out any undefined or null names
  const firstTwoParts = partNumbers.slice(0, 2);
  return { name: [...firstTwoParts].filter(Boolean).join(', '), count: partNumbers.length > 2 ? partNumbers.length - 2 : 0 };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'closed':
      return 'cyan';
    case 'draft':
      return 'grey';
    case 'approved':
      return 'primary';
    case 'rejected':
      return 'alert';
    case 'received, partial':
      return 'purple';
    case 'rejected, full':
      return 'error';
    case 'pending, approval':
      return 'yellow';
    case 'purchased':
      return 'secondary';
    default:
      return 'gray'
  }
}

const closedCount = computed(() => {
  return purchaseOrderList.value.filter(item => item.status == 'closed')?.length || 0
})

const draftCount = computed(() => {
  return purchaseOrderList.value.filter(item => item.status == 'draft')?.length || 0
})

const rejectedCount = computed(() => {
  return purchaseOrderList.value.filter(item => item.status == 'rejected')?.length || 0
})

const approvedCount = computed(() => {
  return purchaseOrderList.value.filter(item => item.status == 'approved')?.length || 0
})

const purchasedCount = computed(() => {
  return purchaseOrderList.value.filter(item => item.status == 'purchased')?.length || 0
})
const receivedParCount = computed(() => {
  return purchaseOrderList.value.filter(item => item.status == 'received, partial')?.length || 0
})
const receivedFullCount = computed(() => {
  return purchaseOrderList.value.filter(item => item.status == 'received, full')?.length || 0
})
const pendingCount = computed(() => {
  return purchaseOrderList.value.filter(item => item.status == 'pending, approval')?.length || 0
})

const additionalTabs = [
  { value: 'purchased', title: 'Purchased', color: 'secondary', count: purchasedCount },
  { value: 'received, partial', title: 'Received Partial', color: 'purple', count: receivedParCount },
  { value: 'received, full', title: 'Received Full', color: 'error', count: receivedFullCount },
  { value: 'pending, approval', title: 'Pending Approval', color: 'yellow', count: pendingCount },
]


const statuses = ref([
  { value: 'draft', title: 'Draft' },
  { value: 'pending approval', title: 'Pending Approval' },
  { value: 'approved', title: 'Approved' },
  { value: 'purchased', title: 'Purchased' },
  { value: 'received, partial', title: 'Received, Partial' },
  { value: 'received, full', title: 'Received, Full' },
  { value: 'closed', title: 'Closed' },
  { value: 'rejected', title: 'Rejected' }
])

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}


const pagination = computed({
  get() {
    return purchaseOrderPagination.value
  },
  set(value) {
    purchaseOrderStore.setPagination(value);
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
  purchaseOrderStore.fetchPurchaseOrders(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    purchaseOrderStore.fetchPurchaseOrders(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  purchaseOrderStore.fetchPurchaseOrders(searchQuery.value);
})

onMounted(() => {
  purchaseOrderStore.fetchPurchaseOrders(searchQuery.value);
});
const headers = [
  { title: 'PO Number', key: 'id' },
  { title: 'Status', key: 'status' },
  { title: 'Vendor', key: 'vendor' },
  { title: 'Parts', key: 'parts' },
  { title: 'Description', key: 'description' },
  { title: 'Created By', key: 'created_by' },
  { title: 'Created On', key: 'created_at' },
  { title: 'Total', key: 'total_amount' },
  { title: 'Watchers', key: 'watchers' },
  // { title: 'Labels', key: 'labels' },
  { title: '', key: 'actions', sortable: false, minWidth: '50', align: 'end' },
];

</script>

<style scoped>
::v-deep .v-tooltip__content {
  background-color: #fff;
  color: #333;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-line;
  font-family: monospace;
}

.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}
</style>