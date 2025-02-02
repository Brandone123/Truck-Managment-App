<!-- src/components/recruiting/JobPostingList.vue -->

<template>
  <SharedUiServerTable :items="jobPostings" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
    :sticky-top="true" :sticky-top-offset="55" v-model="selectedItems" return-object
    :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event" :items-length="totalJobPostings" dynamicSearch>

    <template v-slot:item.job="{item}">
      {{item.job?.title}}
    </template>

    <template v-slot:item.actions="{ item, index }">
      <!-- <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
          <v-list-item small @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
          <v-list-item small @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
        </SharedTableActionMenu> -->

      <div class="d-flex">
        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('edit', item)" color="primary">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Edit Posting
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('delete', item.id)" color="red">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">
            Delete Posting
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="viewJobPosting(item.id)" color="secondary">mdi-arrow-right</v-icon>
          <v-tooltip activator="parent" location="top">
            View Posting
          </v-tooltip>
        </span>



        
      </div>
    </template>

    <template v-slot:item.status="{ item }">
      <v-chip :color="statusColor(item.status)" dark>
        {{ item.status }}
      </v-chip>
    </template>

    <template v-slot:item.platform="{ item }">
      <span>{{ item.platform }}</span>
    </template>

    <template v-slot:item.posted_at="{ item }">
      {{ formatDate(item.posted_at) }}
    </template>
  </SharedUiServerTable>
</template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { PropType } from 'vue';
  import type { JobPosting } from '@/types/recruiting/jobManagement';
  import { JobManagementStore } from '~/stores/recruiting/jobManagement/jobManagementStore';
  import { storeToRefs } from 'pinia';
  import moment from 'moment';
  
  const props = defineProps({
    jobPostings: {
      type: Array as PropType<JobPosting[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'Invalid Date'
    }
    return moment(dateString).format('ddd, MMM Do YYYY')
  };
  
  const emit = defineEmits(['edit', 'delete']);

  const jobManagementStore = JobManagementStore()
  
  const { totalJobPostings, pagination: jobManagementPagination, total_pages  } = storeToRefs(jobManagementStore);
  
  const tableHeaders = [
    { title: 'Platform', key: 'platform', sortable: true },
    { title: 'Job', key: 'job', sortable: true },
    { title: 'Posting URL', key: 'posting_url', sortable: false },
    { title: 'Posted At', key: 'posted_at', sortable: true },
    { title: 'Status', key: 'status', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false, width: '100px', align: 'end' },
  ];
  
  const selectedItems = ref<Array<any>>([]);
  
  const hoveredRow = ref<number | null>(null);
  const selectedFilters = ref<Record<string, any>>({})

  const pagination = computed({
    get() {
      return jobManagementPagination.value
    },
    set(value) {
      jobManagementStore.setPagination(value);
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
      case 'Active':
        return 'green';
      case 'Inactive':
        return 'red';
      default:
        return 'grey';
    }
  };

  const viewJobPosting = (id : number) => {
    const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl
  const link = `${apiUrl}/recruiting/job-posting/${id}`;
  window.open(link, '_blank');
  }
  
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  