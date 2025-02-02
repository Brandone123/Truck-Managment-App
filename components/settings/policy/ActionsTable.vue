<!-- components/policy/ActionsTable.vue -->

<template>
  <SharedUiCustomTable class="custom-table" :customFilter="customSearch" :headers="headers" :items="sortedActions"
    :loading="loadingActions" :items-per-page="50" @hoveredRow="hoveredRow = $event;" :show-footer-in-head="false">
    <template v-slot:item.actions="{ item }">
      <div class="d-flex">
        <v-icon small class="mr-2" color="secondary" @click="$emit('editAction', item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="error" @click="$emit('deleteAction', item.id)">
          mdi-delete
        </v-icon>
      </div>
    </template>
    <template v-slot:item.rule="{ item }">
      {{ item.rule?.name }}
    </template>
    <template v-slot:item.action_type="{ item }">
      {{ formatActionType(item.action_type) }}
    </template>
    <template v-slot:item.parameters="{ item }">
      <pre>{{ formatParameters(item.parameters) }}</pre>
    </template>

    <template v-slot:item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template v-slot:item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>
  </SharedUiCustomTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePolicyStore } from '@/stores/policyStore';
import { storeToRefs } from 'pinia';
import moment from 'moment'

const policyStore = usePolicyStore();
const { actions, loadingActions } = storeToRefs(policyStore);

const hoveredRow = ref<number | null>(null)

// Define table headers
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Name', value: 'name', sortable: true },
  { title: 'Rule', value: 'rule.name', sortable: true },
  { title: 'Domain', value: 'domain', sortable: true },
  { title: 'Action Type', value: 'action_type', sortable: true },
  // { title: 'Parameters', value: 'parameters' },
  { title: 'Description', value: 'description', sortable: true },
  { title: 'Created At', value: 'created_at', sortable: true },
  { title: 'Updated At', value: 'updated_at', sortable: true },
  { title: 'Actions', value: 'actions', sortable: false },
];

// Helper to format action type
const formatActionType = (type: string) => {
  switch (type) {
    case 'send_notification':
      return 'Send Notification';
    case 'block_action':
      return 'Block Action';
    case 'log_event':
      return 'Log Event';
    default:
      return type;
  }
};

// Helper to format parameters
const formatParameters = (params: Record<string, any> | null) => {
  return params ? JSON.stringify(params, null, 2) : 'N/A';
};

const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'Invalid Date'
  }
  return moment(dateString).format('ddd, MMM Do YYYY')
};

const sortedActions = computed(() => {
  return (actions.value || []).sort((a, b) => {
    let first = (a.name ?? '')?.toLowerCase();
    let second = (b.name ?? '').toLowerCase();
    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
  });
})


const customSearch = (value: any, search: String, item: Record<string, any>) => {
  let searchParam = search?.toLowerCase();
  const ruleMatch = item?.raw?.rule?.name?.toLowerCase()?.includes(searchParam) || false;

  let fields = ['name', 'domain', 'action_type', 'description']

  const hasMatch = fields.some((field) => {
    let fieldValue = '';
    if (field == 'action_type') {
      fieldValue = formatActionType(item?.raw?.[field])
    } else {
      fieldValue = item?.raw?.[field];
    }

    const fieldAsString =
      fieldValue !== null && fieldValue !== undefined
        ? String(fieldValue).toLowerCase()
        : "";

    return fieldAsString.includes(searchParam);
  });

  return ruleMatch || hasMatch;
}
</script>

<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}
</style>