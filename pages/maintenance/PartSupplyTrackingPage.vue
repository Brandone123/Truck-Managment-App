<template>
  <div>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h6">Parts and Supplies Tracking</span>
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
        <v-btn color="primary" @click="openAddPartSupplyDialog">Add Part/Supply</v-btn>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-package-variant</v-icon>
              <span>Total Parts</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ partsSummary.totalParts }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-cart-outline</v-icon>
              <span>Total Supplies</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ partsSummary.totalSupplies }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-currency-usd</v-icon>
              <span>Total Value</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ partsSummary.totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <PartsAndSuppliesTable @edit="editPartSupply"
          @delete="deletePartSupply" />
      </v-col>
    </v-row>

    <PartSupplyEditDialog :modelValue="editDialog" :partSupply="selectedPartSupply" @update:modelValue="editDialog = $event" @save="savePartSupply" />
    <DeletePartSupplyDialog :modelValue="deleteDialog" @update:modelValue="deleteDialog = $event" @confirm="confirmDeletePartSupply" />
    <PartsUpload :modelValue="importDialog" @update:modelValue="importDialog = $event" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import PartsAndSuppliesTable from '@/components/maintenance/inventory/parts/PartsAndSuppliesTable.vue';
import PartSupplyEditDialog from '@/components/maintenance/inventory/parts/PartSupplyEditDialog.vue';
import DeletePartSupplyDialog from '@/components/maintenance/inventory/parts/DeletePartSupplyDialog.vue';
import PartsUpload from '@/components/maintenance/inventory/parts/PartsUpload.vue'; // Import the PartsUpload component
import { usePartsAndSuppliesStore } from '@/stores/maintenance/partsAndSupplies';
import type { PartSupply } from '@/types/maintenance/partSupplyTypes';

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partsSummary } = storeToRefs(partsAndSuppliesStore);

const partLocationStore = usePartLocationStore()

const editDialog = ref(false);
const deleteDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedPartSupply = ref<Partial<PartSupply>>({} as Partial<PartSupply>);

onMounted(() => {
  partLocationStore.fetchPartLocations()
  partsAndSuppliesStore.fetchPartSupplies();
});

const openAddPartSupplyDialog = () => {
  selectedPartSupply.value = {} as Partial<PartSupply>;
  editDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const editPartSupply = (partSupply: PartSupply) => {
  selectedPartSupply.value = JSON.parse(JSON.stringify(partSupply));
  editDialog.value = true;
};

const deletePartSupply = (partSupply: PartSupply) => {
  selectedPartSupply.value = partSupply;
  deleteDialog.value = true;
};

const savePartSupply = (partSupply: PartSupply) => {
  let payload = JSON.parse(JSON.stringify(partSupply))
  if (partSupply.id) {
    partsAndSuppliesStore.updatePartSupply(payload);
  } else {
    partsAndSuppliesStore.createPartSupply(payload);
  }
  editDialog.value = false;
};

const confirmDeletePartSupply = () => {
  if (selectedPartSupply.value) {
    partsAndSuppliesStore.deletePartSupply(selectedPartSupply.value.id as number);
  }
  deleteDialog.value = false;
};
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
