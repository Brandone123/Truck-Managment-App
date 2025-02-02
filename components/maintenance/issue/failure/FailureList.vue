<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>

        <v-tab value="needs action" class="text-none">
          <span class="mr-1 bg-error" style="width: 8px; height: 8px; border-radius: 50%;"></span> Needs Action
          <v-chip density="compact" class="ml-1 bg-error">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ failureSummary['needs action'] || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="open issue" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span> Open Issue
          <v-chip density="compact" class="ml-1 bg-secondary">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ failureSummary['open issue'] || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="acknowledged" class="text-none"><span class="mr-1 bg-orange"
            style="width: 8px; height: 8px; border-radius: 50%;"></span>Acknowledged
          <v-chip density="compact" class="ml-1 bg-orange">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ failureSummary?.acknowledged || 0 }}</span>
          </v-chip></v-tab>
        <v-tab value="resolved" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Resolved
          <v-chip density="compact" class="ml-1 bg-primary">
            <v-progress-circular v-if="loadingSummary" :size="20" :width="2" color="white"
              indeterminate></v-progress-circular>
            <span v-else>{{ failureSummary?.resolved || 0 }}</span>
          </v-chip></v-tab>
      </v-tabs>
    </div>
    <SharedUiServerTable class="custom-table" :sticky-top="true" :sticky-top-offset="95" show-select
      :show-footer-in-head="false" :headers="tableHeaders" :items="filteredFailures" :loading="loading"
      @update:selectedFilters="selectedFilters = $event" :selectable="true" v-model="selectedItems" return-object
      :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" :items-length="total_items"
      @update:options="pagination = $event" @hoveredRow="hoveredRow = $event;">

      <template v-slot:item.actions="{ item, index }">
        <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item @click="$emit('viewDetails', item.id)" append-icon="mdi-eye">View Details</v-list-item>
          <v-list-item @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu>
      </template>

      <template v-slot:item.id="{ item }">
        <span style="cursor: pointer; border-bottom: 1px dotted;" class="text-secondary font-weight-bold" dense
          @click="$emit('viewDetails', item.id)">
          {{ item.id }}
        </span>
      </template>
      <template v-slot:item.submission_date="{ item }">
        <v-col class="mr-10">
          <span class="text-secondary"
            style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
            {{ new Date(item.submission_date).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            }) }}
            <v-tooltip activator="parent" location="top" location-strategy="connected">
              {{ getRelativeDateTime(item.submission_date) }}
            </v-tooltip>
          </span>
          <div style="font-size: 12px; color:grey">{{ new Date(item.submission_date).toLocaleTimeString([], {
            hour:
              '2-digit', minute: '2-digit', hour12: true
          }) }}</div>
          <span class="text-secondary" style="font-size: 12px; color:grey">{{ item.submission }}</span>
        </v-col>
      </template>

      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableDynamicVehicleItem :vehicle="item.vehicle" v-if="item.vehicle" />
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.issue_id="{ item }">
        <span v-if="item.issue" @click="viewIssue(item.issue_id)" class="text-secondary">
          <IssueMenu :issue="item.issue" />
        </span>
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.inspection_form="{ item }">
        <div v-if="item.inspection_form?.id">
          <span class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;"
            @click="viewInspection(item.inspection_form?.id)">
            #{{ item.inspection_form?.id }}
          </span>
        </div>
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.work_order="{ item }">
        <div v-if="item.issue?.work_order_id">
          <span class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;"
            @click="viewWorkOrder(item.issue?.work_order_id)">
            #{{ item.issue?.work_order_id }}
          </span>
        </div>
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.inspection_form_name="{ item }">
        {{ item.inspection_form?.name }}
      </template>

      <template v-slot:item.stage="{ item }">
        <div v-if="(item.stage || '').toLowerCase() === 'needs action'" class="d-flex">
          <div class="ml-auto text-gray border rounded pa-1 mb-2" style="cursor: pointer; font-size: small"
            @click="ackDialog(item)">
            Acknowledge
          </div>
          <div class="mr-auto">
            <div v-if="!item.issue_id" class="text-primary border rounded pa-1 ml-2"
              style="cursor: pointer; font-size: small" @click="convertToIssue(item)">
              Create&nbsp;Issue
            </div>
          </div>
        </div>
        <span v-else>
          <v-chip class="text-capitalize" density="compact" variant="flat" :color="getStatusColor(item.stage)">{{
            item.stage
          }}</v-chip>
        </span>
      </template>
    </SharedUiServerTable>
  </div>

  <v-dialog v-model="showAknowledgeDialog" max-width="800px">
    <v-card class="grey-background">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Acknowledge Failure</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="showAknowledgeDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-title></v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field variant="solo" flat density="compact" type="date" v-model="Acknowledge_at"
              label="Acknowledge At"></v-text-field>
          </v-col>
          <v-col cols="12">
            <SharedInputTechnicianNameAutoCompleteInput variant="solo" flat density="compact" label="Acknowledge By*"
              v-model="Acknowledge_by" />
          </v-col>
          <v-col cols="12">
            <v-text-field disabled variant="solo" flat density="compact" v-model="Stage" label="Stage"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveNewEntry(localAck)">Save</v-btn>
        <v-btn @click="showAknowledgeDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <IssueEditDialog :modelValue="issueEditDialog" :issue="selectedIssue"
    :vehicleName="(selectedIssue.asset_name as string)" @update:modelValue="issueEditDialog = $event"
    @close="closeIssueEditDialog" @save="saveIssue" />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Failure } from '@/types/maintenance/failure';
import type { filterItem } from '~/types/layout/table';
import type { Issues } from '~/types/maintenance/issue';
import { useRouter } from 'vue-router';
import IssueEditDialog from '@/components/maintenance/issue/issueManagement/IssueEditDialog.vue';
import IssueMenu from '@/components/maintenance/management/workOrder/components/WorkOrderTableIssueMenu.vue';
import moment from 'moment';

const props = defineProps({
  failures: {
    type: Array as PropType<Failure[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['view', 'edit', 'delete', 'convert', 'viewDetails']);

const failureStore = useFailureStore();
const { pagination: failurePagination, total_items, loadingSummary, failureSummary, getFailuresList } = storeToRefs(failureStore);

watch(() => failureSummary.value, (newValue) =>{
  console.log(newValue);
})
const localAck = ref<Partial<Failure>>(JSON.parse(JSON.stringify(props.failures || {})));

const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)

const router = useRouter();
const inspectionFormStore = useInspectionFormStore();
const { forms } = storeToRefs(inspectionFormStore);

const getCurrentDate = () => {
  return new Date().toISOString().slice(0, 10);
}

const selectedIssue = ref<Partial<Issues>>({} as Partial<Issues>);
const issueEditDialog = ref(false);

const closeIssueEditDialog = () => {
  issueEditDialog.value = false;
};

const convertToIssue = (item: any) => {
  console.log(item.vehicle?.name)
  selectedIssue.value = {
    asset_name: item.vehicle?.name,
    reported_date: new Date().toISOString().slice(0, 10),
    failure_id: item.id
  };
  issueEditDialog.value = true;
};

const saveIssue = async (issue: any) => {
  if (issue) {
    failureStore.createIssueFromItemFailure(issue, issue.failure_id)
  }
  issueEditDialog.value = false;
}

const viewIssue = (issueId: number) => {
  router.push(`/maintenance/IssuesManagement/${issueId}`)
};

const viewInspection = (inspectionId: number) => {
  router.push(`/maintenance/InspectionForms/${inspectionId}`)
};


const viewWorkOrder = (workOrderId: number) => {
  router.push(`/maintenance/WorkOrders/${workOrderId}`)
};

const Acknowledge_at = ref(getCurrentDate());
const Acknowledge_by = ref('')
const Stage = ref('Acknowledged')

const tableHeaders = [
  { title: 'Failure ID', key: 'id' },
  { title: 'Date', key: 'submission_date' },
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Inspection Form ID', key: 'inspection_form' },
  { title: 'Inspection Form', key: 'inspection_form_name' },
  { title: 'Issue', key: 'issue_id' },
  // { title: 'Work Order', key: 'work_order' },
  // { title: 'Photos', key: 'item_photos' },
  { title: 'Stage', key: 'stage' },
  { title: '', key: 'actions', sortable: false, width: '200px', align: 'end' },
];

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}


const filterFailure = computed(() => {
  return [
    {
      title: 'Select A Stage',
      key: 'stage',
      items: [
        { text: 'Needs Action', value: 'needs action' },
        { text: 'Open Issue', value: 'open issue' },
        { text: 'Acknowledged', value: 'acknowledged' },
        { text: 'Resolved', value: 'resolved' }
      ],
      width: '300px',
    },
  ] as filterItem[]
})

const getStatusColor = (status: any) => {
  switch ((status || '').toLowerCase()) {
    case 'needs action':
      return 'error';
    case 'open issue':
      return 'secondary';
    case 'acknowledged':
      return 'orange';
    // case 'closed':
    //   return 'grey';
    case 'resolved':
      return 'primary';
  }
}

// const getRelativeDateTime = (dateString: any) => {
//   const now = new Date();
//   const createdAt = new Date(dateString);
//   const diff = now.getTime() - createdAt.getTime();

//   const seconds = Math.floor(diff / 1000);
//   const minutes = Math.floor(seconds / 60);
//   const hours = Math.floor(minutes / 60);
//   const days = Math.floor(hours / 24);
//   const months = Math.floor(days / 30);
//   const years = Math.floor(months / 12);

//   if (years > 0) {
//     return `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 > 1 ? 's' : ''} ago`;
//   } else if (months > 0) {
//     return `${months} month${months > 1 ? 's' : ''} ago`;
//   } else if (days > 0) {
//     return `${days} day${days > 1 ? 's' : ''} ago`;
//   } else if (hours > 0) {
//     return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//   } else if (minutes > 0) {
//     return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
//   } else {
//     return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
//   }
// }

const activeFilter = ref<string>('all')

// const filteredFailures = computed(() => {
//   if (activeFilter.value == 'all') {
//     return props.failures
//   }
//   return props.failures.filter(item => (item.stage || '').toLowerCase() == activeFilter.value)
// })

const filteredFailures = computed(() => {
  if (activeFilter.value == "all") {
    return getFailuresList.value;
  }
  return getFailuresList.value.filter(
    (item) => item.stage == activeFilter.value
  );
});

const showAknowledgeDialog = ref(false);

const ackDialog = (item: any) => {
  localAck.value = item;
  showAknowledgeDialog.value = true;
};

const saveNewEntry = async (item: any) => {
  if (item.id) {
    item.acknowledge_at = Acknowledge_at.value;
    item.acknowledge_by = Acknowledge_by.value;
    item.stage = Stage.value;
    await failureStore.updateFailure(item);
  }
  showAknowledgeDialog.value = false;
};

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const getVehicleName = (vehicleId: number) => {
  const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
  return vehicleName
}

// const getFormName = (formId: any) => {
//   const formName = forms.value.find((form) => form.id === formId)
//   return formName ? formName.name : ''
// }

onMounted(() => {
  failureStore.fetchFailures(searchQuery.value);
  // inspectionFormStore.fetchForms({})
})

const pagination = computed({
  get() {
    return failurePagination.value
  },
  set(value) {
    failureStore.setPagination(value);
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
    payload['filters'].stage = activeFilter.value
  }

  return payload
})


watch(() => selectedFilters.value, () => {
  selectedItems.value = [];
  failureStore.fetchFailures(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    failureStore.fetchFailures(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  failureStore.fetchFailures(searchQuery.value);
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