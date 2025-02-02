<!-- components/accessControl/RolesTable.vue -->

<template>
  <SharedUiCustomTable class="custom-table" :headers="headers" :items="sortedRoles" :loading="loadingRoles"
    :items-per-page="50" @hoveredRow="hoveredRow = $event;" :show-footer-in-head="false">

    <template v-slot:item.actions="{ item }">
      <div class="d-flex">
        <span style="cursor: pointer;">
          <v-icon dense class="mr-2" color="secondary" @click="$emit('editRole', item)"> mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="top">
            Edit Role
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense class="mr-2" color="error" @click="$emit('deleteRole', item.id)">mdi-delete</v-icon>
          <v-tooltip activator="parent" location="top">
            Delete Role
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
const { roles, loadingRoles } = storeToRefs(accessControlStore);

// Fetch roles on component mount
onMounted(() => {
  accessControlStore.fetchRoles();
});

const hoveredRow = ref<number | null>(null)

// Define table headers
const headers = [
  { title: 'ID', value: 'id', sortable: true, },
  { title: 'Name', value: 'name', sortable: true },
  { title: 'Description', value: 'description', sortable: true },
  { title: 'Created At', value: 'created_at', sortable: true },
  { title: 'Updated At', value: 'updated_at', sortable: true },
  { title: 'Actions', value: 'actions', sortable: false, width: '100px', align: 'end' },
];

const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'Invalid Date'
  }
  return moment(dateString).format('ddd, MMM Do YYYY, h:mm A')
};

const sortedRoles = computed(() => {
  return (roles.value || []).sort((a, b) => {
    let first = (a.name ?? '')?.toLowerCase();
    let second = (b.name ?? '').toLowerCase();
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