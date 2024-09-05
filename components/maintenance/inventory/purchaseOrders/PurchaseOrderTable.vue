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

    <SharedUiCustomTable show-select items-per-page="50" :sticky-top="true" :sticky-top-offset="95"
      :show-footer-in-head="false" :headers="headers" :items="filteredPurchase" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" dense @click="$emit('delete', item)">mdi-delete</v-icon>
      </template>

      <template v-slot:item.id="{ item }">
        <span style="cursor: pointer;" class="text-primary font-weight-bold" dense @click="$emit('view', item)">
          #{{ item.id }}
        </span>
      </template>

      <template v-slot:item.parts="{ item }">
        <div v-if="item.parts" v-for="(part, index) in item.parts" :key="index">
          <div v-if="index < 2">
            {{ part.part_id }}
          </div>
          <div v-else-if="index === 2">
            <span>2</span>
            <v-tooltip activator="parent" location="top">
              <div class="text-left">
                <div v-for="(partId, i) in item.parts.slice(2)" :key="i">
                  {{ partId.part_id }}<br>
                </div>
              </div>
            </v-tooltip>
            <span class="text-secondary font-weight-bold"> + {{ item.parts.length - 2 }} more</span>
          </div>
        </div>
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.status="{ item }">
        <v-chip density="compact" variant="flat" v-if="item.status" :color="getStatusColor(item.status)">
          {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}</v-chip>
        <span v-else></span>
      </template>

      <template v-slot:item.location_id="{ item }">
        <span>{{ getLocationName(item.location_id) }}</span>
      </template>

      <template v-slot:item.vendor_id="{ item }">
        <span class="text-secondary" style="cursor: pointer;" v-if="item.vendor_id">
          <v-icon size="18">mdi-store</v-icon>
          <span style="border-bottom: 1px dotted;">{{ getVendorName(item.vendor_id) }}</span>
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
        <SharedTableTechnicianItem v-if="item.created_by" :user-id="item.created_by" />
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
        </v-menu>
      </template>
    </SharedUiCustomTable>
  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { usePurchaseOrderStore } from '@/stores/maintenance/purchaseOrderStore';
import type { PartSupply } from '@/types/maintenance/partSupplyTypes';
import type { filterItem } from '~/types/layout/table';
import { useRouter } from 'vue-router';
import type { PurchaseOrder } from '~/types/maintenance/purchaseOrderTypes';
import moment from 'moment'

const router = useRouter();

// const props = defineProps({
//   search: String,
// });

const authStore = useAuthStore()

const emit = defineEmits(['view', 'edit', 'delete']);

const purchaseOrderStore = usePurchaseOrderStore();
const { purchaseOrderList, loading } = storeToRefs(purchaseOrderStore)

const partLocationStore = usePartLocationStore()
const { partLocations } = storeToRefs(partLocationStore)

const suppliersStore = useSuppliersStore();
const suppliers = computed(() => suppliersStore.suppliers);

const headers = [
  { title: 'PO Number', key: 'id' },
  { title: 'Status', key: 'status' },
  { title: 'Part Location', key: 'location_id' },
  { title: 'Vendor', key: 'vendor_id' },
  { title: 'Parts', key: 'parts' },
  { title: 'Description', key: 'description' },
  { title: 'Created By', key: 'created_by' },
  { title: 'Created On', key: 'created_at' },
  { title: 'Total', key: 'total_amount' },
  { title: 'Watchers', key: 'watchers' },
  // { title: 'Labels', key: 'labels' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getLocationName = (locationId: number) => {
  return partLocations.value?.find(location => location.id == locationId)?.name
}

const getVendorName = (vendorId: number) => {
  return suppliers.value?.find(vendor => vendor.id == vendorId)?.name
}

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

const activeFilter = ref<string>('all')

const filteredPurchase = computed(() => {
  if (activeFilter.value == 'all') {
    return purchaseOrderList.value
  }
  return purchaseOrderList.value.filter(item => item.status == activeFilter.value)
})

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

const filterParts = computed(() => {
  return [
    {
      title: 'Status',
      key: 'status',
      items: ['Draft', 'Pending Approval', 'Rejected', 'Approved', 'Purchased', 'Received, Partial', 'Received, Full', 'Closed'],
      width: '300px',
    }
  ] as filterItem[]
})

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}


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
</style>