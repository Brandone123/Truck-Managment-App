<!-- components/policy/RulesTable.vue -->

<template>
  <SharedUiCustomTable class="custom-table" :customFilter="customSearch" :headers="headers" :items="sortedRules"
    :loading="loadingRules" :items-per-page="50" @hoveredRow="hoveredRow = $event;" :show-footer-in-head="false">
    <template v-slot:item.actions="{ item }">
      <div class="d-flex">
        <v-icon small class="mr-2" color="secondary" @click="$emit('editRule', item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="error" @click="$emit('deleteRule', item.id)">
          mdi-delete
        </v-icon>
      </div>
    </template>
    <template v-slot:item.policy="{ item }">
      {{ item.policy?.policy_name || 'N/A' }}
    </template>

    <template v-slot:item.enabled="{ item }">
      <v-icon color="green" v-if="item.enabled">mdi-check</v-icon>
      <v-icon color="red" v-else>mdi-close</v-icon>
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
import { computed, onMounted } from 'vue';
import { usePolicyStore } from '@/stores/policyStore';
import { storeToRefs } from 'pinia';
import moment from 'moment'

const policyStore = usePolicyStore();
const { rules, loadingRules } = storeToRefs(policyStore);

// Fetch rules on component mount
onMounted(() => {
  policyStore.fetchPolicies()
  policyStore.fetchRules();
});

const hoveredRow = ref<number | null>(null)

// Define table headers
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Policy', value: 'policy.policy_name', sortable: true },
  { title: 'Name', value: 'name', sortable: true },
  { title: 'Description', value: 'description', sortable: true },
  { title: 'Enabled', value: 'enabled', sortable: true },
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

const sortedRules = computed(() => {
  return (rules.value || []).sort((a, b) => {
    let first = (a.name ?? '')?.toLowerCase();
    let second = (b.name ?? '').toLowerCase();
    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
  });
})

const customSearch = (value: any, search: String, item: Record<string, any>) => {
  let searchParam = search?.toLowerCase();
  const policyMatch = item?.raw?.policy?.policy_name?.toLowerCase()?.includes(searchParam) || false;
  let fields = ['name', 'description']
  const hasMatch = fields.some((field) => {
    const fieldValue = item?.raw?.[field];
    const fieldAsString =
      fieldValue !== null && fieldValue !== undefined
        ? String(fieldValue).toLowerCase()
        : "";

    return fieldAsString.includes(searchParam);
  });

  return policyMatch || hasMatch;
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