<template>
  <div class="documents-view">
    <!-- Folders Section -->
    <!-- <div class="folders">
      <h3>Folders</h3>
      <div class="folder-grid">
        <v-card v-for="folder in folders" :key="folder.id" class="folder-card" @click="$emit('open-folder', folder)">
          <v-card-title>
            <v-icon class="mr-2" color="primary">mdi-folder-outline</v-icon>
            {{ folder.name }}
          </v-card-title>
          <v-card-text>
            <small>{{ folder.children ? folder.children.length : 0 }} Files</small>
          </v-card-text>
        </v-card>
      </div>
    </div> -->

    <!-- Recent Section -->
    <!-- <div class="recent">
      <h3>Recent</h3>
      <v-row>
        <v-col v-for="file in recentFiles" :key="file.id" cols="12" md="3">
          <v-card class="recent-card" @click="$emit('view', file)">
            <v-card-title>
              <v-icon v-if="file.document_type === 'file'" color="secondary">mdi-file-outline</v-icon>
              <v-icon v-else color="primary">mdi-folder</v-icon>
              {{ file.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ file.created_at ? formatDate(file.created_at) : 'N/A' }} - {{ file.document_type }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row> -->
    <!-- <v-list>
        <v-list-item v-for="file in recentFiles" :key="file.id" @click="$emit('view', file)">
          <v-list-item-avatar>
            <v-icon v-if="file.document_type === 'file'">mdi-file</v-icon>
            <v-icon v-else>mdi-folder</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ file.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ file.created_at ? formatDate(file.created_at) : 'N/A' }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-divider></v-divider>
        </v-list-item>
      </v-list> -->
    <!-- </div> -->

    <!-- All Files Section -->
    <SharedUiServerTable :items="documents" :headers="tableHeaders" :loading="loading" :sticky-top-offset="55"
      v-model="selectedItems" :sticky-top="true" return-object :show-footer-in-head="false"
      :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
      @hoveredRow="hoveredRow = $event" :items-length="total_items" dynamicSearch>

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

      <template v-slot:item.created_by="{ item }">
        <SharedTableDynamicTechnicianItem v-if="item.creator" :technician="item.creator" />
        <span v-else>N/A</span>
      </template>

      <template v-slot:item.is_fillable_pdf="{ item }">
        <v-icon color="green" v-if="item.is_fillable_pdf">mdi-check</v-icon>
        <v-icon color="red" v-else>mdi-close</v-icon>
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
import { OnboardingOrientationDocumentStore } from '~/stores/recruiting/onboardingOrientation/orientationDocumentStore';
import { storeToRefs } from 'pinia';
import type { OrientationDocument } from '@/types/recruiting/onboardingOrientation';
import moment from 'moment';


const props = defineProps({
  documents: {
    type: Array as PropType<OrientationDocument[]>,
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

const onboardingStore = OnboardingOrientationDocumentStore();
const { pagination: orientationDocumentsPagination, recentFiles, folders, total_items } = storeToRefs(onboardingStore);

const pagination = computed({
  get() {
    return orientationDocumentsPagination.value;
  },
  set(value) {
    onboardingStore.setPagination(value);
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
