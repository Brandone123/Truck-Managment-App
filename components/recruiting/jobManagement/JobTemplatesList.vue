<!-- src/components/recruiting/JobTemplateList.vue -->

<template>
  <SharedUiServerTable :items="jobTemplates" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
    :sticky-top="true" :sticky-top-offset="55" v-model="selectedItems" return-object
    :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event" :items-length="totalJobTemplates" dynamicSearch>

    <template v-slot:item.actions="{ item, index }">
      <!-- <SharedTableActionMenu :hoveredRow="hoveredRow" :index="index">
        <v-list-item small @click="$emit('edit', item)" append-icon="mdi-pencil">Edit</v-list-item>
        <v-list-item small @click="$emit('delete', item.id)" append-icon="mdi-delete">Delete</v-list-item>
      </SharedTableActionMenu> -->

      <div class="d-flex">

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('view', item)" color="primary">mdi-eye</v-icon>
          <v-tooltip activator="parent" location="top">
            View Template
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('edit', item)" color="secondary">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Edit Template
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('delete', item)" color="error">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">
            Delete Template
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('copy', item)" color="grey">mdi-content-copy</v-icon>
          <v-tooltip activator="parent" location="top">
            Copy
          </v-tooltip>
        </span>
      </div>
    </template>

    <template v-slot:item.creator="{ item }">
      <SharedTableDynamicTechnicianItem v-if="item.creator" :technician="item.creator" />
    </template>

    <template v-slot:item.job_type="{ item }">
      <span>{{ item.job_type }}</span>
    </template>

    <template v-slot:item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template v-slot:item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>

    <template v-slot:item.version="{ item }">
      <span>{{ item.version }}</span>
    </template>
  </SharedUiServerTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PropType } from 'vue';
import type { JobTemplate } from '@/types/recruiting/jobManagement';
import { JobManagementStore } from '~/stores/recruiting/jobManagement/jobManagementStore';
import { storeToRefs } from 'pinia';
import moment from 'moment';

const props = defineProps({
  jobTemplates: {
    type: Array as PropType<JobTemplate[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },

});

const emit = defineEmits(['edit', 'delete', 'view', 'copy']);

const selectedItems = ref<Array<any>>([]);

const hoveredRow = ref<number | null>(null);

const selectedFilters = ref<Record<string, any>>({})

const jobManagementStore = JobManagementStore();

const { totalJobTemplates, jobTemplatePagination, jobTemplates } = storeToRefs(jobManagementStore);

const pagination = computed({
  get() {
    return jobTemplatePagination.value
  },
  set(value) {
    jobManagementStore.setJobTemplatePagination(value);
  }
})

const tableHeaders = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Job Type', key: 'job_type', sortable: true },
  // { title: 'Version', key: 'version', sortable: true },
  { title: 'Created By', key: 'creator', sortable: true },
  { title: 'Created At', key: 'created_at', sortable: true },
  { title: 'Updated At', key: 'updated_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px', align: 'end' },
];

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
// Delete functionality handled via emit
const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'Invalid Date'
  }
  return moment(dateString).format('ddd, MMM Do YYYY')
};

defineExpose({
  searchQuery,
  setSelectedItems
})
</script>

<style scoped>
/* Add your styles here */
</style>