<template>
  <div>
    <div class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
    style="position:sticky;top: 48px;z-index:1;">
      <span class="text-primary text-h6">Supplier Management</span>
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
        <v-btn color="primary" @click="openAddSupplierDialog">Add Supplier</v-btn>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="card-1 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#CE0053">mdi-account-multiple</v-icon>
              <span>Total Suppliers</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ supplierSummary.totalSuppliers }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-2 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#1867C0">mdi-package-variant</v-icon>
              <span>Total Parts Provided</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ supplierSummary.totalPartsProvided }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="card-3 text-center">
          <!-- <v-card-text> -->
            <v-card-title class="justify-space-between">
              <v-icon class="mr-2" color="#424656">mdi-currency-usd</v-icon>
              <span>Total Supplies Provided</span>
            </v-card-title>
            <v-card-text>
              <span class="font-weight-bold text-h6">{{ supplierSummary.totalSuppliesProvided }}</span>
            </v-card-text>
          <!-- </v-card-text> -->
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <SuppliersTable @view="viewSupplier" @edit="editSupplier" @delete="deleteSupplier"/>
      </v-col>
    </v-row>

    <SupplierDetailsDialog :modelValue="detailsDialog" :supplier="selectedSupplier" @update:modelValue="detailsDialog = $event" />
    <SupplierEditDialog :modelValue="editDialog" :supplier="selectedSupplier" @update:modelValue="editDialog = $event" @save="saveSupplier" />
    <DeleteSupplierDialog :modelValue="deleteDialog" @update:modelValue="deleteDialog = $event" @confirm="confirmDeleteSupplier" />
    <SupplierUpload :modelValue="importDialog" @update:modelValue="importDialog = $event" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import SuppliersTable from '@/components/maintenance/inventory/supplier/SuppliersTable.vue';
import SupplierDetailsDialog from '@/components/maintenance/inventory/supplier/SupplierDetailsDialog.vue';
import SupplierEditDialog from '@/components/maintenance/inventory/supplier/SupplierEditDialog.vue';
import DeleteSupplierDialog from '@/components/maintenance/inventory/supplier/DeleteSupplierDialog.vue';
import SupplierUpload from '@/components/maintenance/inventory/supplier/SupplierUpload.vue'; // Import the SupplierUpload component
import { useSuppliersStore } from '@/stores/maintenance/suppliersStore';
import type { Supplier } from '@/types/maintenance/supplierTypes';

const suppliersStore = useSuppliersStore();
const { supplierSummary } = storeToRefs(suppliersStore);

const detailsDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedSupplier = ref<Partial<Supplier>>({ contact_information: {}, classification: {}} as Partial<Supplier>);

onMounted(() => {
  suppliersStore.fetchSuppliers();
});

const openAddSupplierDialog = () => {
  selectedSupplier.value = { contact_information: {}, classification: {}} as Partial<Supplier>;
  editDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const viewSupplier = (supplier: Supplier) => {
  selectedSupplier.value = supplier;
  detailsDialog.value = true;
};

const editSupplier = (supplier: Supplier) => {
  selectedSupplier.value = supplier;
  editDialog.value = true;
};

const deleteSupplier = (supplier: Supplier) => {
  selectedSupplier.value = supplier;
  deleteDialog.value = true;
};

const saveSupplier = (supplier: Supplier) => {
  if (supplier.id) {
    suppliersStore.updateSupplier(supplier);
  } else {
    suppliersStore.createSupplier(supplier);
  }
  editDialog.value = false;
};

const confirmDeleteSupplier = () => {
  if (selectedSupplier.value) {
    suppliersStore.deleteSupplier(selectedSupplier.value.id as number);
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
