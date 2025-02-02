<!-- src/components/recruiting/JobList.vue -->

<template>
  <SharedUiServerTable :items="jobs" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
    :sticky-top="true" :sticky-top-offset="55" v-model="selectedItems" return-object
    @update:selectedFilters="selectedFilters = $event" :items-per-page="pagination.itemsPerPage"
    :sort-by="pagination.sortBy" @update:options="pagination = $event" @hoveredRow="hoveredRow = $event"
    :items-length="totalJobs" dynamicSearch>

    <template v-slot:item.actions="{ item, index }">
      <!-- <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
        <v-list-item small @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
        <v-list-item small @click="$emit('view', item)" append-icon="mdi-eye">View</v-list-item>
        <v-list-item small @click="confirmDelete(item)" append-icon="mdi-delete">Delete</v-list-item>
      </SharedTableActionMenu> -->

      <div class="d-flex">

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('view', item)" color="primary">mdi-eye</v-icon>
          <v-tooltip activator="parent" location="top">
            View Details
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('edit', item)" color="secondary">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Edit Job
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="confirmDelete(item)" color="error">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">
            Delete Job
          </v-tooltip>
        </span>
      </div>
    </template>

    <template v-slot:item.creator="{ item }">
      <SharedTableDynamicTechnicianItem v-if="item.creator" :technician="item.creator" />
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip :color="statusColor(item.status)" dark>
        {{ item.status }}
      </v-chip>
    </template>

    <template v-slot:item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template v-slot:item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>

    <template v-slot:item.job_type="{ item }">
      <span>{{ item.job_type }}</span>
    </template>
  </SharedUiServerTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PropType } from 'vue';
import type { Job } from '@/types/recruiting/jobManagement';
import { JobManagementStore } from '~/stores/recruiting/jobManagement/jobManagementStore';
import { storeToRefs } from 'pinia';
import moment from 'moment';

const props = defineProps({
  jobs: {
    type: Array as PropType<Job[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit', 'view', 'update:pagination']);

const selectedItems = ref<Array<any>>([]);

const hoveredRow = ref<number | null>(null);

const selectedFilters = ref<Record<string, string>>({});

const jobManagementStore = JobManagementStore();

const layoutStore = useLayoutStore();

const { totalJobs,  jobManagementPagination, jobs } = storeToRefs(jobManagementStore);

const pagination = computed({
  get() {
    return jobManagementPagination.value
  },
  set(value) {
    jobManagementStore.setJobManagementPagination(value);
  }
})

const tableHeaders = [
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Job Type', key: 'job_type', sortable: true },
  { title: 'Created By', key: 'creator', sortable: true },
  { title: 'Created At', key: 'created_at', sortable: true },
  { title: 'Updated At', key: 'updated_at', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px', align: 'end' },
];

const confirmDelete = async (job: Job) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this job record?`)
  if (confirm) {
    await jobManagementStore.deleteJob(job.id);
  }
};

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
    payload['page'] = 1
  }

  payload['filters'] = {}

  if (Object.keys(selectedFilters.value).length > 0) {
    payload['filters'] = selectedFilters.value
  }

  // if (activeFilter.value != 'all') {
  //   payload['filters'].status = activeFilter.value
  // }

  return payload
})

const setSelectedItems = (value: any) => {
  selectedItems.value = value;
}

defineExpose({
  searchQuery,
  setSelectedItems
})

// Helper to determine chip color based on status
const statusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'green';
    case 'Closed':
      return 'red';
    case 'Pending':
      return 'orange';
    default:
      return 'grey';
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'Invalid Date'
  }
  return moment(dateString).format('ddd, MMM Do YYYY')
};

</script>

<style scoped>
/* Add your styles here */
</style>