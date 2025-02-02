<!-- src/components/recruiting/ApplicantsList.vue -->

<template>
  <SharedUiServerTable :items="applicants" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
    :sticky-top="true" :sticky-top-offset="55" v-model="selectedItems" return-object
    :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event" :items-length="totalApplicants" dynamicSearch>

    <template v-slot:item.actions="{ item, index }">
      <div class="d-flex">
        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('view', item)" color="primary">mdi-eye</v-icon>
          <v-tooltip activator="parent" location="top">
            View applicant
          </v-tooltip>
        </span>

        <!-- <span style="cursor: pointer;">
          <v-icon dense @click="$emit('edit', item)" color="secondary">mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Edit applicant
          </v-tooltip>
        </span> -->

        <span style="cursor: pointer;">
          <v-icon dense @click="$emit('delete', item)" color="error">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">
            Delete applicant
          </v-tooltip>
        </span>
      </div>
    </template>

    <template v-slot:item.id="{ item }">
      <span style="cursor: pointer; border-bottom: 1px dotted" class="text-secondary font-weight-bold"
        @click="$emit('view', item)">#{{ item.id }}</span>
    </template>
    <template v-slot:item.email_address="{ item }">
      <span class="text-secondary"
        style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
        {{ item.email_address }}
        </span>
    </template>
  </SharedUiServerTable>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import type { Applicant } from '@/types/recruiting/applicantApplication';
import { ApplicantApplicationStore } from '~/stores/recruiting/applicationManagement/applicantApplicationStore';
import { storeToRefs } from 'pinia';

const props = defineProps({
  applicants: {
    type: Array as PropType<Applicant[]>,
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

const applicantStore = ApplicantApplicationStore();

const { pagination: applicantPagination, totalApplicants } = storeToRefs(applicantStore);

const pagination = computed({
  get() {
    return applicantPagination.value;
  },
  set(value) {
    applicantStore.setPagination(value);
  },
});

const selectedFilters = ref<Record<string, any>>({});

const activeFilter = ref<string>('all');

const tableHeaders = [
  {title: 'ID', key: 'id', sortable: true},
  { title: 'First Name', key: 'first_name', sortable: true },
  { title: 'Middle Name', key: 'middle_name', sortable: true },
  { title: 'Last Name', key: 'last_name', sortable: true },
  { title: 'Email', key: 'email_address', sortable: true },
  { title: 'Primary Phone', key: 'primary_phone', sortable: true },
  // { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false},
];

const searchQuery = computed(() => {
  let payload: Record<string, any> = {
    page: pagination.value.page,
    items_per_page: pagination.value.itemsPerPage,
  };

  if (pagination.value.sortBy.length > 0) {
    payload['sort_by'] = pagination.value.sortBy[0];
  }

  if (Boolean(pagination.value.search)) {
    payload['search'] = pagination.value.search;
  }

  payload['filters'] = {};

  if (Object.keys(selectedFilters.value).length > 0) {
    payload['filters'] = selectedFilters.value;
  }

  return payload;
});

const setSelectedItems = (value: any) => {
  selectedItems.value = value;
};

defineExpose({
  searchQuery,
  setSelectedItems,
});

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
</script>

<style scoped>
/* Add your styles here */
</style>