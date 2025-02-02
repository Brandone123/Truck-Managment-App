<!-- components/accessControl/OverridesTable.vue -->

<template>
  <SharedUiCustomTable class="custom-table" :headers="headers" :items="sortedOverrides" :loading="loadingOverrides"
    :items-per-page="50" @hoveredRow="hoveredRow = $event;" :show-footer-in-head="false">

    <template v-slot:item.actions="{ item }">
      <div class="d-flex">
        <span style="cursor: pointer;">
          <v-icon dense class="mr-2" :color="item.valid ? 'error' : 'secondary'"
            @click="$emit('toggleOverride', item)">{{ item.valid ? 'mdi-cancel' : 'mdi-check' }}</v-icon>
          <v-tooltip activator="parent" location="top">
            {{ item.valid ? 'Cancel Override' : 'Allow Override' }}
          </v-tooltip>
        </span>

        <span style="cursor: pointer;">
          <v-icon dense class="mr-2" @click="$emit('view', item)" color="primary">mdi-eye-check</v-icon>
          <v-tooltip activator="parent" location="top">
            Audit Override
          </v-tooltip>
        </span>

        <!-- <v-icon v-tooltip:top="'Cancel Override'" small class="mr-2" color="red"
          @click="$emit('deleteOverride', item.id)">
          mdi-cancel
        </v-icon> -->
      </div>
    </template>

    <template v-slot:item.employee.full_name="{ item }">
      <SharedTableDynamicTechnicianItem v-if="item.employee" :technician="item.employee" />
      <span v-else>N/A</span>
    </template>

    <template v-slot:item.grantor.full_name="{ item }">
      <SharedTableDynamicTechnicianItem v-if="item.grantor" :technician="item.grantor" />
      <span v-else>N/A</span>
    </template>

    <template v-slot:item.override_type="{ item }">
      <v-text v-if="item.override_type === 'override_deny_dispatch'">Dispatch Override Denied</v-text>
      <v-text v-else-if="item.override_type === 'override_allow_dispatch'">Dispatch Override Allowed</v-text>
      <v-text v-else>N/A"></v-text>
    </template>


    <template v-slot:item.valid="{ item }">
      <v-icon color="green" v-if="item.valid">mdi-check</v-icon>
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
import { useAccessControlStore } from '@/stores/accessControlStore';
import { storeToRefs } from 'pinia';
import moment from 'moment'
import type { OverrideInfo } from '~/types/store/accessControl';

const props = defineProps({
  overrides: {
    type: Array as PropType<OverrideInfo[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});


const emit = defineEmits(['deleteOverride', 'view', 'toggleOverride']);

const accessControlStore = useAccessControlStore();
const { overrides, loadingOverrides } = storeToRefs(accessControlStore);

const hoveredRow = ref<number | null>(null)

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}

// Define table headers
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'User', value: 'employee.full_name', sortable: true },
  { title: 'Override Type', value: 'override_type', sortable: true },
  { title: 'Granted By', value: 'grantor.full_name', sortable: true },
  { title: 'Valid', value: 'valid', sortable: true },
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

const sortedOverrides = computed(() => {
  return (overrides.value || []).sort((a, b) => {
    if (a.created_at! < b.created_at!) return -1;
    if (a.created_at! > b.created_at!) return 1;
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

.v-data-table {
  overflow-x: auto;
}
</style>