<!-- components/policy/ConditionsTable.vue -->

<template>
  <SharedUiCustomTable class="custom-table" :customFilter="customSearch" :headers="headers" :items="sortedConditions"
    :loading="loadingConditions" :items-per-page="50" @hoveredRow="hoveredRow = $event;" :show-footer-in-head="false">
    <template v-slot:item.actions="{ item }">
      <div class="d-flex">
        <v-icon small class="mr-2" color="secondary" @click="$emit('editCondition', item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="error" @click="$emit('deleteCondition', item.id)">
          mdi-delete
        </v-icon>
      </div>
    </template>
    <template v-slot:item.rule="{ item }">
      {{ item.rule?.name || 'N/A' }}
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
const { conditions, loadingConditions } = storeToRefs(policyStore);

const hoveredRow = ref<number | null>(null)

// Define table headers
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Rule', value: 'rule.name', sortable: true },
  { title: 'Name', value: 'name', sortable: true },
  { title: 'Field', value: 'field', sortable: true },
  { title: 'Operator', value: 'operator', sortable: true },
  { title: 'Value', value: 'value', sortable: true },
  { title: 'Resource', value: 'resource', sortable: true },
  { title: 'Created At', value: 'created_at', sortable: true },
  { title: 'Updated At', value: 'updated_at', sortable: true },
  { title: 'Actions', value: 'actions', sortable: false },
];

const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'Invalid Date'
  }
  return moment(dateString).format('ddd, MMM Do YYYY, h:mm A')
};

const sortedConditions = computed(() => {
  return (conditions.value || []).sort((a, b) => {
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
  let fields = ['name', 'value', 'resource', 'value', 'operator', 'field', 'name']
  const hasMatch = fields.some((field) => {
    const fieldValue = item?.raw?.[field];
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
</style>