<!-- src/components/recruiting/ApplicationsList.vue -->

<template>
  <SharedUiServerTable :items="applications" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
    :sticky-top="true" :sticky-top-offset="55" v-model="selectedItems" return-object
    :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event;" :items-length="totalApplications" dynamicSearch>

    <template v-slot:item.actions="{ item, index }">
      <div class="d-flex">
        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('view', item)" color="primary">mdi-eye</v-icon>
          <v-tooltip activator="parent" location="top">
            View application
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('edit', item)" color="secondary">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Edit Status
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('delete', item)" color="error">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">
            Delete applicantion
          </v-tooltip>
        </span>
      </div>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip :color="applicationStatusColor(item.status)" density="compact" variant="flat">
        {{ item.status }}
      </v-chip>
    </template>
    <template v-slot:item.submitted_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>
    <template v-slot:item.applicant="{ item }">
      {{ item.applicant?.first_name }}
      {{ item.applicant?.last_name }}
    </template>
    <template v-slot:item.id="{ item }">
      <span style="cursor: pointer; border-bottom: 1px dotted"
      class="text-secondary font-weight-bold" @click="$emit('view', item)">#{{ item.id }}</span>
    </template>
  </SharedUiServerTable>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Application } from '@/types/recruiting/applicantApplication';

const props = defineProps({
  applications: {
    type: Array as PropType<Application[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['view', 'edit', 'delete', 'update:pagination']);

const selectedItems = ref<Array<any>>([]);

const hoveredRow = ref<number | null>(null);

const selectedFilters = ref<Record<string, any>>({})

const applicantStore = ApplicantApplicationStore();

const { pagination: applicantionPagination, totalApplications, applications } = storeToRefs(applicantStore);

const pagination = computed({
  get() {
    return applicantionPagination.value
  },
  set(value) {
    applicantStore.setPagination(value);
  }
})

const tableHeaders = [
  { title: 'Application ID', key: 'id', sortable: true },
  { title: 'Applicant', key: 'applicant', sortable: true },
  { title: 'Job', key: 'job.title', sortable: true },
  { title: 'Submission Source', key: 'submission_source', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Submitted At', key: 'submitted_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px' },
];

const applicationStatusColor = (status: string) => {
  switch (status) {
    case 'Received':
      return 'secondary';
    case 'Under Review':
      return 'orange';
    case 'Interview Scheduled':
      return 'purple';
    case 'Rejected':
      return 'red';
    case 'Hire':
      return 'primary';
    case 'Offer':
      return 'yellow';
    default:
      return 'grey';
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

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleString();
};

</script>

<style scoped>
/* Add your styles here */
</style>