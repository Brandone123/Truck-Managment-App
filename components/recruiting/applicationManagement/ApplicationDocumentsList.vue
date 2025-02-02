<template>
  <div class="documents-view">

    <!-- All Files Section -->
    <SharedUiServerTable :items="documents" :headers="tableHeaders" :loading="loading" :sticky-top-offset="55"
      v-model="selectedItems" :sticky-top="true" return-object :show-footer-in-head="false"
      :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
      @hoveredRow="hoveredRow = $event" :items-length="totalApplicationDocuments" dynamicSearch>

      <template v-slot:item.actions="{ item, index }">
        <div class="d-flex">
          <span style="cursor: pointer;">
            <v-icon dense @click="$emit('edit', item)" color="primary">mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="top">
              Edit Document
            </v-tooltip>
          </span>

          <span style="cursor: pointer;">
            <v-icon dense @click="$emit('delete', item.id)" color="red">mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">
              Delete Document
            </v-tooltip>
          </span>

          <span style="cursor: pointer;">
            <v-icon dense @click="$emit('view', item)" color="secondary">mdi-eye</v-icon>
            <v-tooltip activator="parent" location="top">
              View Posting
            </v-tooltip>
          </span>
        </div>
      </template>

      <template v-slot:item.uploaded_by="{ item }">
        <SharedTableDynamicTechnicianItem v-if="item.uploader" :technician="item.uploader" />
        <span v-else>N/A</span>
      </template>


      <!-- <template v-slot:item.document_type="{ item }">
        <v-chip :color="documentTypesColor(item.document_type)">
          {{ item.document_type.toUpperCase() }}
        </v-chip>
      </template> -->

      <template v-slot:item.created_at="{ item }">
        <span v-if="item.created_at">{{ formatDate(item.created_at) }}</span>
        <span v-else>N/A</span>
      </template>
    </SharedUiServerTable>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import type { OrientationDocument } from '@/types/recruiting/onboardingOrientation';
import moment from 'moment';
import type { ApplicationDocument } from '~/types/recruiting/applicantApplication';


const props = defineProps({
  documents: {
    type: Array as PropType<ApplicationDocument[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const hoveredRow = ref<number | null>(null);
const selectedItems = ref<Array<any>>([]);

const selectedFilters = ref<Record<string, any>>({})

const applicationStore = ApplicantApplicationStore();
const { totalApplicationDocuments, pagination: applicationDocumentsPagination } = storeToRefs(applicationStore);

const pagination = computed({
  get() {
    return applicationDocumentsPagination.value;
  },
  set(value) {
    applicationStore.setPagination(value);
  }
});

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

const emit = defineEmits(['view', 'edit', 'delete', 'update:pagination', 'new', 'filter', 'sort', 'open-folder']);

const tableHeaders = [
  { title: 'Name', key: 'name', sortable: true },
  // { title: 'Type', key: 'document_type', sortable: true },
  { title: 'Description', key: 'description', sortable: true },
  { title: 'Created By', key: 'created_by', sortable: true },
  { title: 'Created At', key: 'created_at', sortable: true },
  { title: 'Fillable', key: 'is_fillable_pdf', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '150px' },
];

const formatDate = (dateString: string) => {
  return moment(dateString).format('dddd, MMM Do YYYY');
};

const documentTypesColor = (type: string) => {
  switch (type) {
    case 'file':
      return 'primary';
    case 'folder':
      return 'secondary';
    default:
      return 'grey';
  }
};


const viewDocument = (id: number) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl
  const link = `${apiUrl}/recruiting/job-posting/${id}`;
  window.open(link, '_blank');
}
</script>

<style scoped>
.documents-view {
  padding: 16px;
}

.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.folder-card {
  cursor: pointer;
}

.recent {
  margin-top: 32px;
  margin-bottom: 16px;
}

.recent-card {
  cursor: pointer;
}
</style>
