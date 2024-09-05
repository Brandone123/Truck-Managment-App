<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Issue Management</span>
      <v-btn color="primary" @click="openAddIssueDialog">Add Issue</v-btn>
    </div>

    <OverviewComponent />

    <IssueDetailsDialog :modelValue="issueDetailsDialog" :issue="selectedIssue"
      @update:modelValue="issueDetailsDialog = $event" />
    <AddEditIssueDialog :modelValue="addEditIssueDialog" :issue="selectedIssue"
      @update:modelValue="addEditIssueDialog = $event" @save="saveIssue" />
    <DeleteConfirmationDialog :modelValue="deleteIssueDialog" @confirm="deleteIssue"
      @update:modelValue="deleteIssueDialog = $event" />

    <SharedUiCustomTable :filters="filtersIssues" :showFooterInHead="false" :headers="issueHeaders" :items="issueList"
      :loading="loadingIssues">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="viewIssueDetails(item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" dense @click="editIssue(item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" dense @click="confirmDeleteIssue(item.id)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip class="text-capitalize" :color="getStatusClass(item.status)" size="small">
          {{ item.status }}
        </v-chip>
      </template>
    </SharedUiCustomTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
// import { useIssueStore } from '@/stores/maintenance/issueStore';
import IssueDetailsDialog from '@/components/maintenance/issue/management/IssueDetailsDialog.vue';
import AddEditIssueDialog from '@/components/maintenance/issue/management/AddEditIssueDialog.vue';
import DeleteConfirmationDialog from '@/components/maintenance/issue/management/DeleteConfirmationDialog.vue';
import OverviewComponent from '@/components/maintenance/issue/management/OverviewComponent.vue';
import type { filterItem } from '~/types/layout/table';

const store = useIssueStore();
const { issueList, loading: loadingIssues } = storeToRefs(store);

const search = ref('');
const filterType = ref('');
const issuePage = ref(1);
const itemsPerPage = ref(10);

const typeOptions = ['Open', 'In Progress', 'Resolved'];

const filtersIssues = ref<filterItem[]>([]);

const issueDetailsDialog = ref(false);
const addEditIssueDialog = ref(false);
const deleteIssueDialog = ref(false);

const selectedIssue = ref({
  id: null,
  vehicle_id: null,
  vehicle_name: '',
  description: '',
  reported_date: '',
  status: '',
  priority: '',
  notes: '',
  attachments: [],
});

const openAddIssueDialog = () => {
  selectedIssue.value = {
    id: null,
    vehicle_id: null,
    vehicle_name: '',
    description: '',
    reported_date: '',
    status: '',
    priority: '',
    notes: '',
    attachments: [],
  };
  addEditIssueDialog.value = true;
};

const viewIssueDetails = (issue: any) => {
  selectedIssue.value = issue;
  issueDetailsDialog.value = true;
};

const editIssue = (issue: any) => {
  selectedIssue.value = issue;
  addEditIssueDialog.value = true;
};

const confirmDeleteIssue = (id: any) => {
  selectedIssue.value = { ...id };
  deleteIssueDialog.value = true;
};

const deleteIssue = async () => {
  if (selectedIssue.value?.id) {
    await store.deleteIssue(selectedIssue.value.id);
    deleteIssueDialog.value = false;
  }
};

const saveIssue = async (issue: any) => {
  if (issue.id) {
    await store.updateIssue(issue);
  } else {
    await store.createIssue(issue);
  }
  addEditIssueDialog.value = false;
};

// const filteredIssues = computed(() => {
//   return issueList.value
//     .filter(issue => issue.vehicle_name.toLowerCase().includes(search.value.toLowerCase()) || issue.id.toString().includes(search.value.toLowerCase()))
//     .filter(issue => !filterType.value || issue.status === filterType.value)
//     .slice((issuePage.value - 1) * itemsPerPage.value, issuePage.value * itemsPerPage.value);
// });

const issueHeaders = [
  { title: 'Issue ID', key: 'id' },
  // { title: 'Vehicle/Equipment ID', key: 'vehicle_id' },
  { title: 'Vehicle/Equipment Name', key: 'vehicle_name' },
  { title: 'Issue Description', key: 'description' },
  { title: 'Reported Date', key: 'reported_date' },
  { title: 'Status', key: 'status' },
  { title: 'Priority', key: 'priority' },
  { title: 'Actions', key: 'actions' },
];

const getStatusClass = (status: any) => {
  switch ((status || '')?.toLowerCase()) {
    case "resolved":
      return 'green';
    case "open":
      return 'primary';
    case "in progress":
      return 'error'
  }
}

function initializeFilters() {
  filtersIssues.value = [
    {
      title: 'Filter by Issue Priority',
      key: 'priority',
      items: ['Low', 'Medium', 'High'],
      width: '300px',
    },
  ];
}

onMounted(() => {
  store.fetchIssues();
});

watchEffect(() => {
  if (issueList.value) {
    initializeFilters();
  }
});
</script>

<style scoped></style>