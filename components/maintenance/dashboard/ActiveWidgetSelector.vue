<template>
  <v-menu location="bottom" max-height="500px" location-strategy="connected" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn class="text-none" color="primary" v-bind="props" variant="outlined" density="comfortable">
        <v-icon>mdi-shape-outline</v-icon>Manage Widgets <v-icon class="ml-2">mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-subheader class="list-title">
        <div class="mb-3">
          <div class="d-flex flex-row align-center justify-space-between">
            <span>
              <span class="text-h6 text-black mr-">Widgets</span>
              <v-chip density="compact">{{ widgetLength }}</v-chip>
            </span>
            <span class="text-primary" style="cursor:pointer;" @click="">Restore Defaults</span>
          </div>
          <div class="px-3">
            <v-switch hide-details density="compact" label="Reorganize Automatically" color="primary"  class="text-black"></v-switch>
          </div>
        </div>

      </v-list-subheader>
      <template v-for="(item, i) in items">
        <v-list-subheader v-if="item.type == 'subheader'" class="text-h6 text-black">{{ item.title }}</v-list-subheader>
        <v-list-item v-else :title="item.title">
          <template v-slot:prepend>
            <v-checkbox v-model="item.active" hide-details density="compact" color="primary"></v-checkbox>
          </template>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const items = ref([
  { type: 'subheader', title: 'Vehicles' },
  { active: true, title: 'Latest Meter Readings' },
  { active: true, title: 'Vehicle Assignments' },
  { active: true, title: 'Vehicle Locations' },
  { active: true, title: 'Vehicle Renewal Reminders' },
  { active: true, title: 'Vehicle Status' },
  { type: 'subheader', title: 'Inspections' },
  { active: true, title: 'Inspection Item Failure Rate' },
  { active: true, title: 'Inspection Submissions' },
  { active: true, title: 'Inspections Summary' },
  { active: true, title: 'Overdue Inspections' },
  { type: 'subheader', title: 'Issues' },
  { active: true, title: 'All Faults' },
  { active: true, title: 'Critical Faults' },
  { active: true, title: 'Open Issues' },
  { active: true, title: 'Time to Resolve' },
  { type: 'subheader', title: 'Service' },
  { active: true, title: 'Active Work Orders' },
  { active: true, title: 'On-Time Service Compliance' },
  { active: true, title: 'Service Reminders' },
  { type: 'subheader', title: 'Maintenance Categorization' },
  { active: true, title: 'Repair Priority Class Trends' },
  { active: true, title: 'Top Category Codes by Usage' },
  { active: true, title: 'Top Reasons for Repair' },
  { active: true, title: 'Top System Codes by Usage' },
  { active: true, title: 'Uncategorized Service Tasks' },
  { type: 'subheader', title: 'Cost' },
  { active: true, title: 'Cost Per Meter' },
  { active: true, title: 'Fuel Costs' },
  { active: true, title: 'Other Costs' },
  { active: true, title: 'Service Costs' },
  { active: true, title: 'Total Costs' },
  { type: 'subheader', title: 'Parts & Inventory' },
  { active: false, title: 'Inventory' },
  { active: false, title: 'Inventory Usage' },
  { active: false, title: 'Inventory Value' },
  { active: false, title: 'Purchase Orders' },
  { type: 'subheader', title: 'Contacts' },
  { active: true, title: 'Contact Renewal Reminders' },
  { type: 'subheader', title: 'Other' },
  { active: true, title: 'Recent Comments' },
]);

const widgetLength = computed(() => {
  return items.value.filter(item => item.type !== 'subheader').length;
})
const selected = ref(null);
</script>

<style scoped>
.list-title :deep(.v-list-subheader__text) {
  width: 100%;
}
</style>