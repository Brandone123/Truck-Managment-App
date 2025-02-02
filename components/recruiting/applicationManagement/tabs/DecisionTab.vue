<!-- src/components/recruiting/applicationManagement/tabs/DecisionTab.vue -->
<template>
  <div>
    <div class="d-flex">
      <div class="ml-auto mb-2">
        <v-btn color="primary" @click="openAddDecisionDialog">Add Decision</v-btn>
      </div>
    </div>

    <!-- Decision Edit/Create Dialog -->
    <DecisionEditDialog :modelValue="decisionDialog" :decision="selectedDecision"
      @update:modelValue="decisionDialog = $event" @close="closeDecisionDialog" @save="saveDecision" />

    <!-- Decisions Data Table -->
    <SharedUiServerTable :sticky-top="true" :sticky-top-offset="95" :show-footer-in-head="false" 
      :headers="decisionHeaders" :items="decisions" :loading="loadingDecisions"
      :items-per-page="pagination.itemsPerPage" :sort-by="pagination.sortBy" :items-length="total_items" v-model="selectedItems"
      @hoveredRow="hoveredRow = $event;" @update:options="pagination = $event"
      @update:selectedFilters="selectedFilters = $event" dynamicSearch>
      <template v-slot:item.actions="{ item }">
        <v-icon small color="secondary" class="mr-2" @click="editDecision(item)">mdi-pencil</v-icon>
        <v-icon small color="red" @click="deleteDecision(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.decision_type="{ item }">
      <v-chip :color="getStatusColor(item.decision_type)" density="compact" variant="flat">
        {{ item.decision_type }}
      </v-chip>
    </template>
    <template v-slot:item.decided_by="{ item }">
      <SharedTableDynamicTechnicianItem v-if="item.decider" :technician="item.decider" />
    </template>
    </SharedUiServerTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRecruitmentStore } from '~/stores/recruiting/applicationManagement/recruitmentStore';
import DecisionEditDialog from '@/components/recruiting/applicationManagement/dialogs/DecisionEditDialog.vue';
import type { ApplicationDetails } from '@/types/recruiting/recruitment';
import type { Decision } from '@/types/recruiting/recruitment';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
  applicationDetails: {
    type: Object as PropType<Partial<ApplicationDetails>>,
    required: true,
  }
});

const recruitmentStore = useRecruitmentStore();

const allDecisions = computed(() => recruitmentStore.decisions);
const loadingDecisions = computed(() => recruitmentStore.loadingDecisions);
const { pagination: decisionPagination, total_items } = storeToRefs(recruitmentStore)

const decisions = computed(() => {
  return allDecisions.value.filter(decision => decision.application_id === parseInt(route.params.applicationId as string, 10));
});

const decisionDialog = ref(false);
const selectedDecision = ref<Partial<Decision> | null>(null);

const openAddDecisionDialog = () => {
  selectedDecision.value = null;
  decisionDialog.value = true;
};

const editDecision = (decision: Decision) => {
  selectedDecision.value = decision;
  decisionDialog.value = true;
};

const closeDecisionDialog = () => {
  decisionDialog.value = false;
};

const saveDecision = async (decision: Partial<Decision>) => {
  decisionDialog.value = false;
  if (decision.id) {
    await recruitmentStore.updateDecision(decision.id, decision);
  } else {
    await recruitmentStore.createDecision(decision);
  }
  await recruitmentStore.fetchDecisions();
};

const layoutStore = useLayoutStore();
const deleteDecision = async (decision: Decision) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(`Are you sure you want to delete this decision ?`)
  if (confirm) {
    await recruitmentStore.deleteDecision(decision.id);
    await recruitmentStore.fetchDecisions();
  }
}

// Fetch decisions on component mount
onMounted(() => {
  recruitmentStore.fetchDecisions();
});

// Table Headers
const decisionHeaders = [
  { title: 'Status', value: 'decision_type' },
  { title: 'Reason', value: 'reason' },
  { title: 'Decided By', value: 'decided_by' },
  { title: 'Decided At', value: 'decided_at' },
  { title: 'Actions', value: 'actions', sortable: false },
];

const getStatusColor = (type: string) => {
  switch (type) {
    case 'Approve':
      return 'primary';
    case 'Reject':
      return 'red';
    default:
      return 'grey';
  }
};

const activeFilter = ref<string>('all')
const selectedItems = ref<Array<any>>([])
const selectedFilters = ref<Record<string, string>>({})
const hoveredRow = ref<number | null>(null)

onMounted(() => {
  recruitmentStore.fetchDecisions(searchQuery.value);
})

const pagination = computed({
  get() {
    return decisionPagination.value
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
  recruitmentStore.fetchDecisions(searchQuery.value);
}, { deep: true })

watch(() => pagination.value, (newVal, oldVal) => {
  if (!_isEqual(newVal, oldVal)) {
    selectedItems.value = [];
    recruitmentStore.fetchDecisions(searchQuery.value);
  }
}, { deep: true })

watch(() => activeFilter.value, () => {
  selectedItems.value = [];
  recruitmentStore.fetchDecisions(searchQuery.value);
})
</script>

<style scoped>
/* Add your styles here */
</style>