<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn @click="addPart" color="primary">Add Part</v-btn>
      <AddPartDialog :modelValue="localPurchaseOrderDetails" :editing="isEditingPart" :show="showAddPart"
        :calculateSubtotalPart="calculateSubtotalPart" @close="showAddPart = false" @save="savePurchaseDetails" />
    </div>
    <template v-if="purchaseOrder.parts?.length">
      <v-card class="mt-3">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="5">{{ }}</v-col>
            <v-col cols="12" sm="2">Qty</v-col>
            <v-col cols="12" sm="2">Unit Cost</v-col>
            <v-col cols="12" sm="2">Subtotal</v-col>
            <v-col cols="12" sm="1"></v-col>
          </v-row>
          <v-divider></v-divider>
        </v-card-text>
        <v-card-text>
          <PartItem class="mt-2" v-for="(purchaseDetails, index) in purchaseOrder.parts" :key="index"
            :purchasePart="purchaseDetails" :selectedPartLocations="selectedPartLocations"
            @delete="deletePurchaseDetails(purchaseDetails.purchase_details)"
            @edit="editPurchaseDetails(purchaseDetails.purchase_details)" />
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { PropType } from 'vue';
import PartItem from './components/PartItem.vue'
import type { Location, } from '~/types/maintenance/partSupplyTypes';
import type { PurchaseOrder, PurchaseDetails } from '~/types/maintenance/purchaseOrderTypes';
import AddPartDialog from './components/AddPartDialog.vue';
const props = defineProps({
  purchaseOrder: {
    type: Object as PropType<Partial<PurchaseOrder>>,
    required: true,
  },
  showSidePanel: {
    type: Boolean,
    required: false,
    default: false
  }

});

const layoutStore = useLayoutStore();

const purchaseOrderStore = usePurchaseOrderStore();
const showAddPart = ref(false)
const isEditingPart = ref(false)
const selectedPartLocations = ref<Location[]>([])
const localPurchaseOrderDetails = ref<Partial<PurchaseDetails>>({});

const addPart = () => {
  localPurchaseOrderDetails.value = {}
  showAddPart.value = true
};

const editPurchaseDetails = (purchaseDetails: Partial<PurchaseDetails>) => {
  localPurchaseOrderDetails.value = JSON.parse(JSON.stringify(purchaseDetails))
  showAddPart.value = true
}

const savePurchaseDetails = async (purchaseDetails: Partial<PurchaseDetails>) => {
  const payload = {
    part_id: purchaseDetails.part_id,
    quantity_ordered: purchaseDetails.quantity_ordered,
    quantity_received: purchaseDetails.quantity_received,
    unit_cost: purchaseDetails.unit_cost,
    subtotal: purchaseDetails.subtotal
  }
  if (purchaseDetails.id) {
    await purchaseOrderStore.updatePartItem(props.purchaseOrder.id as number, payload, purchaseDetails.part_id as number)
  } else {
    await purchaseOrderStore.addPartItem(props.purchaseOrder.id as number, payload)
  }
  await purchaseOrderStore.fetchPurchaseOrdersById(props.purchaseOrder.id as number)
}

const deletePurchaseDetails = async (purchaseDetails: Partial<PurchaseDetails>) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog('Are you sure you want to delete this part item ?')
  if (confirm) {
    await purchaseOrderStore.deletePartItem(props.purchaseOrder.id as number, purchaseDetails.part_id as number)
    await purchaseOrderStore.fetchPurchaseOrdersById(props.purchaseOrder.id as number)
  }
}

const calculateSubtotalPart = (item: any) => {
  const quantity = item.quantity_ordered
  const cost = item.unit_cost

  if (!isNaN(quantity) && !isNaN(cost)) {
    item.subtotal = quantity * cost
    localPurchaseOrderDetails.value.subtotal = parseFloat((quantity * cost).toFixed(2))
  } else {
    item.subtotal = 0;
  }
};

</script>

<style scoped></style>