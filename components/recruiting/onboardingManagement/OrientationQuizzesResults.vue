<template>
    <SharedUiServerTable :items="applications" :headers="tableHeaders" :loading="loading" :show-footer-in-head="false"
    :sticky-top="true" v-model="selectedItems" return-object
    :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" @update:options="pagination = $event"
    @hoveredRow="hoveredRow = $event" :items-length="quizResponseTotalItems" dynamicSearch>

      <!-- <template v-slot:item.name="{ item }">
        {{ item.name }}
      </template> -->

      <template v-slot:item.actions="{ item, index }">
        <div class="d-flex">
          <span style="cursor: pointer;">
            <v-icon dense @click="$emit('view', item)" color="primary">mdi-eye</v-icon>
            <v-tooltip activator="parent" location="top">
              View
            </v-tooltip>
          </span>
        </div>
      </template>

      <!-- <template v-slot:item.created_by="{ item }">
        <SharedTableDynamicTechnicianItem v-if="item.creator" :technician="item.creator" />
      </template> -->

      <template v-slot:item.created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>
    </SharedUiServerTable>

</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { OrientationMaterial } from '@/types/recruiting/onboardingOrientation';
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


const tableHeaders = [
  { title: 'Application', key: 'application_id', sortable: true },
  { title: 'Quiz Form', key: 'quiz_form_id', sortable: true },
  { title: 'Quiz Form Version', key: 'quiz_form_version_id', sortable: true },
  { title: 'Score', key: 'score', sortable: true },
  { title: 'Passed', key: 'passed', sortable: true },
  { title: 'Created At', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false},
];

const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const selectedItems = ref<Array<any>>([]);

const hoveredRow = ref<number | null>(null);

const selectedFilters = ref<Record<string, any>>({})
const onboardingOrientationQuizStore = OnboardingOrientationQuizStore();

const { quizResponsePagination, quizResponseTotalItems } = storeToRefs(onboardingOrientationQuizStore);

const pagination = computed({
  get() {
    return quizResponsePagination.value
  },
  set(value) {
    onboardingOrientationQuizStore.setQuizResponsePagination(value);
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

</script>

<style scoped>
/* Add your styles here */
</style>