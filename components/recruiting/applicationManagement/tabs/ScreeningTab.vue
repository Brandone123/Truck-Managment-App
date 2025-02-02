<!-- src/components/recruiting/applicationManagement/tabs/ScreeningTab.vue -->

<template>
  <div>
    <div class="d-flex">
      <div class="ml-auto mb-2">
        <v-btn color="primary" @click="openAddScreeningDialog">Add Screening</v-btn>
      </div>
    </div>

    <!-- Screening Edit/Create Dialog -->
    <ScreeningEditDialog :modelValue="screeningDialog" :screening="selectedScreening"
      @update:modelValue="screeningDialog = $event" @close="closeScreeningDialog" @save="saveScreening" />

    <!-- Screenings Data Table -->
    <SharedUiServerTable :sticky-top="true" :sticky-top-offset="95" :show-footer-in-head="false"
      :headers="screeningHeaders" :items="screenings" :loading="loadingScreenings" dynamicSearch
      :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" :items-length="total_items"
      v-model="selectedItems" @hoveredRow="hoveredRow = $event;" @update:options="pagination = $event"
      @update:selectedFilters="selectedFilters = $event" show-expand v-model:expanded="expandedRows">
      <template v-slot:item.actions="{ item }">
        <v-icon small color="secondary" class="mr-2" @click="editScreening(item)">mdi-pencil</v-icon>
        <v-icon small color="red" @click="deleteScreening(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip density="compact" variant="flat" :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
      </template>
      <template v-slot:item.documentStatus="{ item }">
        <v-icon small :color="item.documents && item.documents.length > 0 ? 'primary' : 'grey'" class="mr-2">
          {{ item.documents && item.documents.length > 0 ? 'mdi-file-check-outline' : 'mdi-file-remove-outline' }}
        </v-icon>
      </template>

      <!-- Conditionally show the Expand button -->
      <!-- <template v-slot:[`item.data-table-expand`]="{ item }">
        <template v-if="item.documents && item.documents.length > 0">
          <v-btn icon>
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
      </template> -->

      <template v-slot:expanded-row="{ columns, item, index, isExpanded }">
        <tr>
          <td :colspan="columns.length" style="height:100px;">
            <v-card flat>
              <v-card-text>
                <div v-if="item.documents && item.documents.length > 0">
                  <template v-for="(document, index) in item.documents" :key="index">
                    <v-list-item class="mb-2" style="border-radius:10px;">
                      <v-icon color="secondary">mdi-paperclip</v-icon>
                      <a :href="document.src" class="truncate"
                        style="width: calc(100% - 40px); text-decoration:none; border-bottom: 1px dotted; "
                        target="_blank">{{
                          document.name
                        }}</a>
                      <template v-slot:append>
                        <v-menu>
                          <template v-slot:activator="{ props: menu }">
                            <v-tooltip location="top">
                              <template v-slot:activator="{ props: tooltip }">
                                <v-hover>
                                  <template v-slot:default="{ isHovering, props: hover }">
                                    <v-card class=" ml-3 custom-button d-flex justify-center align-center"
                                      :variant="isHovering ? 'tonal' : 'flat'" density="compact" flat
                                      v-bind="mergeProps(menu, tooltip, hover)">
                                      <v-icon size="small">mdi-dots-horizontal</v-icon>
                                    </v-card>
                                  </template>
                                </v-hover>
                              </template>
                              <span>More Actions</span>
                            </v-tooltip>
                          </template>
                          <v-list density="compact">
                            <v-list-item append-icon="mdi-delete"
                              @click="deleteDocument(item, index)">Delete</v-list-item>
                          </v-list>
                        </v-menu>
                      </template>
                    </v-list-item>
                  </template>

                </div>
                <div v-else>
                  <p class="text-center text-grey">No documents available for this screening.</p>
                </div>
              </v-card-text>
            </v-card>
          </td>
        </tr>
      </template>
    </SharedUiServerTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, mergeProps } from 'vue';
import { useRecruitmentStore } from '~/stores/recruiting/applicationManagement/recruitmentStore';
import ScreeningEditDialog from '@/components/recruiting/applicationManagement/dialogs/ScreeningEditDialog.vue';
import type { Screening } from '@/types/recruiting/recruitment';
import type { ApplicationDetails } from '@/types/recruiting/recruitment';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
  applicationDetails: {
    type: Object as PropType<Partial<ApplicationDetails>>,
    required: true,
  }
});

const layoutStore = useLayoutStore();

const emit = defineEmits(['uploadDocuments', 'deleteDocument']);

const recruitmentStore = useRecruitmentStore();
const { pagination: screeningPagination, total_items } = storeToRefs(recruitmentStore)
const allScreenings = computed(() => recruitmentStore.screenings);
const loadingScreenings = computed(() => recruitmentStore.loadingScreenings);

const screenings = computed(() => {
  return allScreenings.value.filter(screening => screening.application_id === parseInt(route.params.applicationId as string, 10));
});

const screeningDialog = ref(false);
const selectedScreening = ref<Partial<Screening> | null>(null);

const openAddScreeningDialog = () => {
  selectedScreening.value = null;
  screeningDialog.value = true;
};

const editScreening = (screening: Screening) => {
  selectedScreening.value = screening;
  screeningDialog.value = true;
};

const closeScreeningDialog = () => {
  screeningDialog.value = false;
};

const saveScreening = async (screening: Partial<Screening>) => {
  screeningDialog.value = false;
  if (screening.id) {
    await recruitmentStore.updateScreening(screening.id, screening);
  } else {
    await recruitmentStore.createScreening(screening);
  }
  await recruitmentStore.fetchScreenings();
};

const deleteScreening = async (screening: Screening) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this screening ?`)
  if (confirm) {
    await recruitmentStore.deleteScreening(screening.id);
    await recruitmentStore.fetchScreenings();
  }
}

// Table Headers
const screeningHeaders = [
  { title: 'Type', value: 'type' },
  { title: 'Status', value: 'status' },
  { title: 'Result Details', value: 'result_details' },
  { title: 'Completed At', value: 'completed_at' },
  { title: 'Actions', value: 'actions', sortable: false },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'secondary';
    case 'Passed':
      return 'primary';
    case 'Failed':
      return 'red';
    case 'Rejected':
      return 'orange';
    default:
      return 'grey';
  }
};

const expandedRows = ref([])

function findNewArrayIndex(arr1: any[], arr2: any[]) {
  for (let i = 0; i < arr1.length; i++) {
    if (!arr2.includes(arr1[i])) {
      return screenings.value.indexOf(arr1[i])
    }
  }
  return -1
}

watch(expandedRows, (newVal, oldVal) => {
  if (newVal.length > oldVal.length) {
    let index = findNewArrayIndex(newVal, oldVal)
  }
})


const deleteDocument = async (item: Screening, index: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this document ?`)
  
  if (confirm) {
    const filterref = screenings.value.find(screening => screening.id === item.id)
    filterref?.documents?.splice(index, 1)
    await recruitmentStore.updateScreening(item.id, item);
    await recruitmentStore.fetchScreenings(searchQuery.value);
  }
}


const activeFilter = ref<string>('all')
const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)

onMounted(() => {
  recruitmentStore.fetchScreenings(searchQuery.value);
})

const pagination = computed({
  get() {
    return screeningPagination.value
  },
  set(value) {
    recruitmentStore.setPagination(value);
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
  recruitmentStore.fetchScreenings(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    recruitmentStore.fetchScreenings(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  recruitmentStore.fetchScreenings(searchQuery.value);
})
</script>

<style scoped>
/* Add your styles here */
</style>