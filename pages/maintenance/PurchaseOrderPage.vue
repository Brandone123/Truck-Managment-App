<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
      style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Purchase Orders</span>
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
        <v-btn color="primary" @click="openAddPurchaseOrderDialog">Add Purhase Order</v-btn>
      </div>
    </div>

    <!-- <v-row>
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
    </v-row> -->

    <v-row>
      <v-col cols="12">
        <PurchaseOrdersTable @view="viewPurchaseOrder" @edit="editPurchaseOrder" @delete="deletePurchaseOrder" />
      </v-col>
    </v-row>

    <PurchaseOrderDetailsDialog :modelValue="detailsDialog" :purchaseOrder="selectedPurchaseOrder"
      @update:modelValue="detailsDialog = $event" />
    <PurchaseOrderEditDialog :modelValue="editDialog" :purchaseOrder="selectedPurchaseOrder"
      @update:modelValue="editDialog = $event" @save="savePartSupply" />
    <DeletePurchaseOrderDialog :modelValue="deleteDialog" @update:modelValue="deleteDialog = $event"
      @confirm="confirmDeletePartSupply" />
    <PurchaseOrdersUpload :modelValue="importDialog" @update:modelValue="importDialog = $event" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import PurchaseOrdersTable from '@/components/maintenance/inventory/purchaseOrders/PurchaseOrderTable.vue';
import PurchaseOrderDetailsDialog from '@/components/maintenance/inventory/purchaseOrders/PurchaseOrderDetailsDialog.vue';
import PurchaseOrderEditDialog from '@/components/maintenance/inventory/purchaseOrders/PurchaseOrderEditDialog.vue';
import DeletePurchaseOrderDialog from '@/components/maintenance/inventory/purchaseOrders/DeletePurchaseOrderDialog.vue';
import PurchaseOrdersUpload from '@/components/maintenance/inventory/purchaseOrders/PurchaseOrdersUpload.vue'; // Import the PartsUpload component
import type { PurchaseOrder } from '@/types/maintenance/purchaseOrderTypes';

const purchaseOrderStore = usePurchaseOrderStore();
const { purchaseOrderList } = storeToRefs(purchaseOrderStore);

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const partLocationStore = usePartLocationStore()
const suppliersStore = useSuppliersStore();

const employeeStore = useEmployeeStore();

const search = ref('');
const detailsDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedPurchaseOrder = ref<Partial<PurchaseOrder>>({
  discount: 0,
  discount_type: 'percentage',
  discount_amount: 0,

  tax: 0,
  tax_type: 'percentage',
  tax_amount: 0,

  shipping: 0,
  shipping_type: 'percentage',
  shipping_amount: 0,
  total_amount: 0,
  parts: [],
} as Partial<PurchaseOrder>);



onMounted(() => {
  employeeStore.fetchEmployeeList()
  partLocationStore.fetchPartLocations()
  partsAndSuppliesStore.fetchPartSupplies()
  suppliersStore.fetchSuppliers()
  purchaseOrderStore.fetchPurchaseOrders();
});

const openAddPurchaseOrderDialog = () => {
  selectedPurchaseOrder.value = {
    discount: 0,
    discount_type: 'percentage',
    discount_amount: 0,

    tax: 0,
    tax_type: 'percentage',
    tax_amount: 0,

    shipping: 0,
    shipping_type: 'percentage',
    shipping_amount: 0,
    total_amount: 0,
    parts: [],
  } as Partial<PurchaseOrder>;
  editDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const viewPurchaseOrder = (purchaseOrder: PurchaseOrder) => {
  selectedPurchaseOrder.value = purchaseOrder;
  detailsDialog.value = true;
};

const editPurchaseOrder = (purchaseOrder: PurchaseOrder) => {
  selectedPurchaseOrder.value = { ...purchaseOrder };
  editDialog.value = true;
};

const deletePurchaseOrder = (purchaseOrder: PurchaseOrder) => {
  selectedPurchaseOrder.value = purchaseOrder;
  deleteDialog.value = true;
};

const savePartSupply = (purchaseOrder: PurchaseOrder) => {
  if (purchaseOrder.id) {
    purchaseOrderStore.updatePurchaseOrder(purchaseOrder);
  } else {
    purchaseOrderStore.createPurchaseOrder(purchaseOrder);
  }
  editDialog.value = false;
};

const confirmDeletePartSupply = () => {
  if (selectedPurchaseOrder.value) {
    purchaseOrderStore.deletePurchaseOrder(selectedPurchaseOrder.value.id as number);
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
