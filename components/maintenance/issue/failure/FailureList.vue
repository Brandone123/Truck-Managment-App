<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="needs action" class="text-none">
          <span class="mr-1 bg-error" style="width: 8px; height: 8px; border-radius: 50%;"></span> Needs Action
          <v-chip density="compact" class="ml-1 bg-error">{{ needActionCount }}</v-chip></v-tab>
        <v-tab value="open issue" class="text-none">
          <span class="mr-1 bg-secondary" style="width: 8px; height: 8px; border-radius: 50%;"></span> Open Issue
          <v-chip density="compact" class="ml-1 bg-secondary">{{ openIssueCount }}</v-chip></v-tab>
        <v-tab value="acknowledged" class="text-none"><span class="mr-1 bg-orange"
            style="width: 8px; height: 8px; border-radius: 50%;"></span>Acknowledged
          <v-chip density="compact" class="ml-1 bg-orange">{{ ackCount }}</v-chip></v-tab>
        <v-tab value="resolved" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Resolved
          <v-chip density="compact" class="ml-1 bg-primary">{{ resolvedCount }}</v-chip></v-tab>
      </v-tabs>
    </div>
    <SharedUiCustomTable items-per-page="50" :sticky-top="true" :sticky-top-offset="95" show-select
      :show-footer-in-head="false" :headers="tableHeaders" :items="filteredFailures" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" @click="$emit('delete', item.id)">mdi-delete</v-icon>
        <!-- <v-icon class="ml-2" color="secondary" @click="$emit('convert', item)">mdi-file-document</v-icon> -->
      </template>
      <template v-slot:item.created_at="{ item }">
        <v-col class="mr-10">
          <span class="text-secondary"
            style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
            {{ new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            }) }}
            <v-tooltip activator="parent" location="top" location-strategy="connected">
              {{ getRelativeDateTime(item.created_at) }}
            </v-tooltip>
          </span>
          <div style="font-size: 12px; color:grey">{{ new Date(item.created_at).toLocaleTimeString([], {
            hour:
              '2-digit', minute: '2-digit', hour12: true
          }) }}</div>
          <span class="text-secondary" style="font-size: 12px; color:grey">{{ item.submission }}</span>
        </v-col>
      </template>

      <template v-slot:item.vehicle_id="{ item }">
        <SharedTableVehicleItem type="id" :value="item.vehicle_id" />
      </template>
      
      <template v-slot:item.inspection_form_id="{ item }">
        <v-col class="mr-10">
          <span>{{ item.item_name }}</span>
          <div style="font-size: 11px; color:grey; align-items: center;" v-if="getFormName(item.inspection_form_id)">
            <v-icon>mdi-file-document-outline</v-icon>
            {{ getFormName(item.inspection_form_id) }}
          </div>
        </v-col>
      </template>
      <template v-slot:item.stage="{ item }">
        <div v-if="(item.stage || '').toLowerCase() === 'needs action'" class="d-flex">
          <div class="ml-auto text-gray border rounded pa-1 mb-2" style="cursor: pointer; font-size: small"
            @click="ackDialog(item)">
            Acknowledged
          </div>
          <div class="mr-auto">
            <div class="text-primary border rounded pa-1 ml-2" style="cursor: pointer; font-size: small"
              @click="OpenIssueDialog(item)">
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
    </SharedUiCustomTable>
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
            <v-select variant="solo" flat density="compact" :items="users" item-title="label" item-value="value"
              v-model="Acknowledge_by" label="Acknowledge By"></v-select>
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
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { Failure } from '@/types/maintenance/failure';
import type { filterItem } from '~/types/layout/table';
import type { Issues } from '~/types/maintenance/issue';
import { useRouter } from 'vue-router';

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

const emit = defineEmits(['view', 'edit', 'delete', 'convert']);

const localAck = ref<Partial<Failure>>(JSON.parse(JSON.stringify(props.failures || {})));

const router = useRouter();
const inspectionFormStore = useInspectionFormStore();
const { forms } = storeToRefs(inspectionFormStore);

const getCurrentDate = () => {
  return new Date().toISOString().slice(0, 10);
}

const OpenIssueDialog = (item: any) => {
  router.push({
    path: '/maintenance/IssuesManagement', query: {
      vehicleName: getVehicleName(item.vehicle_id)?.name,
      reported_date: new Date().toISOString().slice(0, 10),
      action: 'createIssue'
    }
  })
}

const failureStore = useFailureStore();
const Acknowledge_at = ref(getCurrentDate());
const Acknowledge_by = ref('')
const Stage = ref('Acknowledged')

const tableHeaders = [
  // { title: 'Failure ID', key: 'id' },
  { title: 'Submission Date', key: 'created_at' },
  { title: 'Vehicle', key: 'vehicle_id' },
  { title: 'Item', key: 'inspection_form_id' },
  // { title: 'Item Name', key: 'item_name' },

  // { title: 'Photos', key: 'item_photos' },
  { title: 'Stage', key: 'stage' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const users = [{ label: 'John Doe', value: 1 }, { label: 'Jane Smith', value: 2 }, { label: 'Alice Johnson', value: 3 }];

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

const activeFilter = ref<string>('all')

const filteredFailures = computed(() => {
  if (activeFilter.value == 'all') {
    return props.failures
  }
  return props.failures.filter(item => (item.stage || '').toLowerCase() == activeFilter.value)
})

const needActionCount = computed(() => {
  return props.failures?.filter(item => (item.stage || '').toLowerCase() == 'needs action')?.length || 0
})

const openIssueCount = computed(() => {
  return props.failures?.filter(item => (item.stage || '').toLowerCase() == 'open issue')?.length || 0
})

const ackCount = computed(() => {
  return props.failures?.filter(item => (item.stage || '').toLowerCase() == 'acknowledged')?.length || 0
})

const resolvedCount = computed(() => {
  return props.failures?.filter(item => (item.stage || '').toLowerCase() == 'resolved')?.length || 0
})

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

const getFormName = (formId: any) => {
  const formName = forms.value.find((form) => form.id === formId)
  return formName ? formName.name : ''
}

onMounted(() => {
  inspectionFormStore.fetchForms()
})
</script>