<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
    style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Service History</span>
      <div>
        <v-menu location="start">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="outlined" color="primary" class="mr-3">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-list density="compact">
            <v-list-item @click="openImportDialog">
              <template v-slot:append>
                <v-icon>mdi-cloud-upload-outline</v-icon>
              </template>
              <v-list-item-title>
                Import
              </v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
              <template v-slot:append>
                <v-icon>mdi-cloud-download-outline</v-icon>
              </template>
              <v-list-item-title>
                Export
              </v-list-item-title>
            </v-list-item>

          </v-list>
        </v-menu>
        <v-btn color="primary" @click="openCreateServiceEntryDialog">Create Service Entry</v-btn>
      </div>
    </div>

    <ServiceEntryDetailsDialog :model-value="serviceEntryDetailsDialog" :serviceEntry="selectedServiceEntry"
      @update:model-value="serviceEntryDetailsDialog = $event" @close="closeServiceEntryDetailsDialog" />
    <ServiceEntryEditDialog :model-value="serviceEntryEditDialog" :serviceEntry="selectedServiceEntry"
      @update:model-value="serviceEntryEditDialog = $event" @close="closeServiceEntryEditDialog" @save="saveServiceEntry" />

    <ServiceHistoryUpload :model-value="importDialog" @update:model-value="importDialog = $event" />

    <v-row class="mt-5">
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-file-document-outline</v-icon>
              <span>Total Service Entries</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ serviceSummary.totalEntries }}</span>
            </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-calendar-clock</v-icon>
              <span>Recent Service Entries</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ serviceSummary.recentEntries }}</span>
            </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-currency-usd</v-icon>
              <span>Cost Summary</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ serviceSummary.totalCost }}</span>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <ServiceEntriesTable :serviceEntries="serviceEntries" :loading="loading" @view="viewServiceEntry" @edit="editServiceEntry" @delete="deleteServiceEntry" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useServiceHistoryStore } from '@/stores/maintenance/useServiceHistoryStore';
import ServiceEntryDetailsDialog from '@/components/maintenance/management/history/ServiceEntryDetailsDialog.vue';
import ServiceEntryEditDialog from '@/components/maintenance/management/history/ServiceEntryEditDialog.vue';
import ServiceEntriesTable from '@/components/maintenance/management/history/ServiceEntriesTable.vue';
import ServiceHistoryUpload from '@/components/maintenance/management/history/ServiceHistoryUpload.vue'; // Import the ServiceHistoryUpload component
import type { ServiceEntry } from '~/types/maintenance/serviceHistory';

const serviceHistoryStore = useServiceHistoryStore();
const { serviceEntries, loading, serviceSummary } = storeToRefs(serviceHistoryStore);

const serviceEntryDetailsDialog = ref(false);
const serviceEntryEditDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedServiceEntry = ref<Partial<ServiceEntry>>({} as Partial<ServiceEntry>);

const openCreateServiceEntryDialog = () => {
  selectedServiceEntry.value = {} as Partial<ServiceEntry>;
  serviceEntryEditDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const viewServiceEntry = (entry: any) => {
  selectedServiceEntry.value = entry;
  serviceEntryDetailsDialog.value = true;
};

const editServiceEntry = (entry: any) => {
  selectedServiceEntry.value = entry;
  serviceEntryEditDialog.value = true;
};

const layoutStore = useLayoutStore()
const deleteServiceEntry = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Proceed to delete this service entry ?")

  if (confirm) {
    await serviceHistoryStore.deleteServiceEntry(id);
  }
};

const closeServiceEntryDetailsDialog = () => {
  serviceEntryDetailsDialog.value = false;
};

const closeServiceEntryEditDialog = () => {
  serviceEntryEditDialog.value = false;
};

const saveServiceEntry = async (entry: any) => {
  if (entry.id) {
    await serviceHistoryStore.updateServiceEntry(entry);
  } else {
    await serviceHistoryStore.createServiceEntry(entry);
  }
  serviceEntryEditDialog.value = false;
};

onMounted(() => {
  serviceHistoryStore.fetchServiceEntries();
});
</script>

<style scoped>
.card-1 {
  border-left: 8px solid #CE0053;
}

.card-2 {
  border-left: 8px solid #1867C0;
}

.card-3 {
  border-left: 8px solid #424656;
}
</style>
