<!-- components/policy/PoliciesTable.vue -->

<template>
  <SharedUiCustomTable class="custom-table" :headers="headers" :items="sortedPolicies" :loading="loadingPolicies"
    :items-per-page="50" @hoveredRow="hoveredRow = $event;" :show-footer-in-head="false">
    <template v-slot:item.actions="{ item }">
      <div class="d-flex">
        <v-icon small class="mr-2" color="secondary" @click="$emit('editPolicy', item)">
          mdi-pencil
        </v-icon>
        <v-icon small color="error" @click="$emit('deletePolicy', item.id)">
          mdi-delete
        </v-icon>
        <!-- <span style="cursor: pointer;">
          <v-icon dense class="mr-2" @click="$emit('auditLog', item)" color="primary">mdi-eye-check</v-icon>
          <v-tooltip activator="parent" location="top">
            Audit Policy
          </v-tooltip>
        </span> -->
        <span style="cursor: pointer;">
          <v-icon dense class="mr-2" @click="$emit('detail', item)" color="primary">mdi-eye</v-icon>
          <v-tooltip activator="parent" location="top">
            View Policy Details
          </v-tooltip>
        </span>
      </div>
    </template>
    <template v-slot:item.type="{ item }">
      {{ item.type || 'N/A' }}
    </template>
    <template v-slot:item.enforcement_level="{ item }">
      {{ capitalize(item.enforcement_level) }}
    </template>

    <template v-slot:item.created_at="{ item }">
      {{ formatDate(item.created_at) }}
    </template>

    <template v-slot:item.updated_at="{ item }">
      {{ formatDate(item.updated_at) }}
    </template>

    <template v-slot:item.description="{ item }">
      {{ truncate(item.description, 50) }}
    </template>
  </SharedUiCustomTable>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePolicyStore } from '@/stores/policyStore';
import { storeToRefs } from 'pinia';
import moment from 'moment'
import type { PolicyInfo } from '~/types/store/policy';

const props = defineProps({
  policies: {
    type: Array as PropType<PolicyInfo[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});


const emit = defineEmits(['deletePolicy', 'editPolicy', 'auditLog', 'detail']);

const policyStore = usePolicyStore();
const { policies, loadingPolicies } = storeToRefs(policyStore);

const hoveredRow = ref<number | null>(null)


// Define table headers
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Policy Name', value: 'policy_name', sortable: true },
  { title: 'Type', value: 'type', sortable: true },
  { title: 'Enforcement Level', value: 'enforcement_level', sortable: true },
  { title: 'Description', value: 'description', sortable: true },
  { title: 'Version', value: 'version', sortable: true },
  { title: 'Created At', value: 'created_at' , sortable: true},
  { title: 'Updated At', value: 'updated_at', sortable: true },
  { title: 'Actions', value: 'actions', sortable: false },
];

const sortedPolicies = computed(() => {
  return (policies.value || []).sort((a, b) => {
    let first = (a.policy_name ?? '')?.toLowerCase();
    let second = (b.policy_name ?? '').toLowerCase();
    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
  });
})

// Helper to capitalize text
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'Invalid Date'
  }
  return moment(dateString).format('ddd, MMM Do YYYY');
};

const truncate = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
</script>

<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}
</style>