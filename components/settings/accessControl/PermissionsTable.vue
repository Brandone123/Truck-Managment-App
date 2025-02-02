<!-- components/accessControl/PermissionsTable.vue -->

<template>
  <SharedUiCustomTable class="custom-table" :headers="headers" :items="sortedPermissions" :loading="loadingPermissions"
    :items-per-page="50" @hoveredRow="hoveredRow = $event;" :show-footer-in-head="false">

    <template v-slot:item.actions="{ item }">
      <div class="d-flex">
        <span style="cursor: pointer;">
          <v-icon small class="mr-2" color="secondary" @click="$emit('editPermission', item)">
            mdi-pencil
          </v-icon>
          <v-tooltip activator="parent" location="top">
            Edit Permission
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon small color="error" @click="$emit('deletePermission', item.id)">
            mdi-delete
          </v-icon>
          <v-tooltip activator="parent" location="top">
            Delete Permission
          </v-tooltip>
        </span>
      </div>

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
import { useAccessControlStore } from '@/stores/accessControlStore';
import { storeToRefs } from 'pinia';
import moment from 'moment'

const accessControlStore = useAccessControlStore();
const policyStore = usePolicyStore();
const { permissions, loadingPermissions } = storeToRefs(accessControlStore);

// Fetch permissions on component mount
onMounted(() => {
  policyStore.fetchActions()
  accessControlStore.fetchPermissions();
});

const hoveredRow = ref<number | null>(null)

// Define table headers
const headers = [
  { title: 'ID', value: 'id', sortable: true, },
  { title: 'Permission Name', value: 'permission_name', sortable: true, },
  { title: 'Action Name', value: 'action.name', sortable: true, },
  { title: 'Description', value: 'description', sortable: true },
  { title: 'Created At', value: 'created_at', sortable: true },
  { title: 'Updated At', value: 'updated_at', sortable: true },
  { title: 'Actions', value: 'actions', sortable: false, width: '100px', align: 'end' },
];

const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'Invalid Date'
  }
  return moment(dateString).format('ddd, MMM Do YYYY')
};

const sortedPermissions = computed(() => {
  return (permissions.value || []).sort((a, b) => {
    let first = (a.permission_name ?? '')?.toLowerCase();
    let second = (b.permission_name ?? '').toLowerCase();
    if (first < second) return -1;
    if (first > second) return 1;
    return 0;
  });
})
</script>

<style scoped>
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) th:last-child),
.custom-table ::v-deep(.v-table__wrapper tr:not(.v-data-table-progress):not(.v-data-table-rows-loading) td:last-child) {
  position: sticky;
  right: 0;
  width: 20px;
}
</style>