<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
    style="position:sticky;top: 48px;z-index:2;">
      <span class="text-primary text-h6">Inventory Levels and Reorder Points</span>
      <div>
        <!-- <v-menu location="start">
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
        </v-menu> -->
        <!-- <v-btn color="primary" @click="openAddInventoryItemDialog">Add Inventory Item</v-btn> -->
        <!-- <v-btn color="primary" @click="saveInventoryItems">Save</v-btn> -->
      </div>
    </div>

    <!-- <v-row>
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-package-variant</v-icon>
              <span>Total Inventory Items</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ inventorySummary.totalItems }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-cart-outline</v-icon>
              <span>Total Parts</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ inventorySummary.totalParts }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
          <v-card-text>
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-currency-usd</v-icon>
              <span>Total Bulk Parts</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ inventorySummary.totalBulkParts }}</span>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->

    <v-row>
      <v-card-text>
        <v-col cols="12">
          <InventoryLevelsTable :inventoryItems="inventoryItems" @save="saveInventoryItems"/>
        </v-col>
      </v-card-text>
    </v-row>

    <InventoryDetailsDialog :modelValue="detailsDialog" :inventoryItem="selectedInventoryItem" @update:modelValue="detailsDialog = $event" />
    <InventoryEditDialog :modelValue="editDialog" :inventoryItem="selectedInventoryItem" @update:modelValue="editDialog = $event" @save="saveInventoryItems" />
    <DeleteInventoryItemDialog :modelValue="deleteDialog" @confirm="confirmDeleteInventoryItem" />
    <InventoryUpload :modelValue="importDialog" @update:modelValue="importDialog = $event" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import InventoryLevelsTable from '@/components/maintenance/inventory/levels/InventoryLevelsTable.vue';
import InventoryDetailsDialog from '@/components/maintenance/inventory/levels/InventoryDetailsDialog.vue';
import InventoryEditDialog from '@/components/maintenance/inventory/levels/InventoryEditDialog.vue';
import DeleteInventoryItemDialog from '@/components/maintenance/inventory/levels/DeleteInventoryItemDialog.vue';
import InventoryUpload from '@/components/maintenance/inventory/levels/InventoryUpload.vue'; // Import the InventoryUpload component
import { useInventoryStore } from '@/stores/maintenance/inventoryStore';
import type { InventoryItem } from '@/types/maintenance/inventoryTypes';

const search = ref('');
const detailsDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedInventoryItem = ref<Partial<InventoryItem>>({} as Partial<InventoryItem>);

const inventoryStore = useInventoryStore();
const { inventoryItems, inventorySummary } = storeToRefs(inventoryStore);

const partAndSupplyStore = usePartsAndSuppliesStore()
const partLocationStore = usePartLocationStore()

onMounted(() => {
  partAndSupplyStore.fetchPartSupplies()
  partLocationStore.fetchPartLocations()
  inventoryStore.fetchInventoryItems();
});

const openAddInventoryItemDialog = () => {
  selectedInventoryItem.value = {} as Partial<InventoryItem>;
  editDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const viewInventoryItem = (inventoryItem: InventoryItem) => {
  selectedInventoryItem.value = inventoryItem;
  detailsDialog.value = true;
};

const editInventoryItem = (inventoryItem: InventoryItem) => {
  selectedInventoryItem.value = inventoryItem;
  editDialog.value = true;
};

const deleteInventoryItem = (inventoryItem: InventoryItem) => {
  selectedInventoryItem.value = inventoryItem;
  deleteDialog.value = true;
};

const saveInventoryItems = (inventoryItem: InventoryItem) => {
  if (inventoryItem.id) {
    inventoryStore.updateInventoryItem(inventoryItem);
  }
};

const confirmDeleteInventoryItem = () => {
  if (selectedInventoryItem.value) {
    inventoryStore.deleteInventoryItem(selectedInventoryItem.value.id as number);
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
