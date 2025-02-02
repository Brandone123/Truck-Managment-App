<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="purchaseOrderForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="text-primary">Details</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <SharedInputPartSuppliersAutoCompleteInput variant="outlined" flat density="compact"
                        label="Vendor*" :disabled="isUpdating" v-model="localPurchaseOrder.vendor_id"
                        :rules="[validation.required]" color="blue-grey-lighten-2" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <SharedInputPartLocationAutoCompleteInput variant="outlined" flat density="compact"
                        label="Part Location*" v-model="localPurchaseOrder.location_id"
                        :rules="[validation.required]" />

                      <!-- <v-autocomplete variant="outlined"
                        flat density="compact" label="Part Location*" :items="partLocations" item-title="name"
                        item-value="id" v-model="localPurchaseOrder.location_id" :rules="[validation.required]">
                        </v-autocomplete> -->
                    </v-col>
                    <!-- <v-col cols="12" sm="6">
                          <SharedInputTechnicianNameAutoCompleteInput variant="outlined" flat density="compact"
                            label="Created By*" :disabled="isUpdating" v-model="localPurchaseOrder.created_by" 
                            :rules="[validation.required]" color="blue-grey-lighten-2" chips closable-chips/> 
                        </v-col>
                        <v-col cols="12" sm="6">
                          <SharedInputTechnicianNameAutoCompleteInput variant="outlined" flat density="compact"
                            label="Purchased By*" :disabled="isUpdating" v-model="localPurchaseOrder.purchased_by" 
                            :rules="[validation.required]" color="blue-grey-lighten-2" chips closable-chips/>
                        </v-col> -->
                    <!-- <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact"
                            :items="['draft', 'pending, approval', 'rejected', 'approved', 'purchased', 'received, partial', 'received, full', 'closed']"
                            label="Status*" v-model="localPurchaseOrder.status" required
                            :rules="[validation.required]"></v-select>
                        </v-col> -->
                    <v-col cols="12">
                      <SharedInputEmployeeAutoCompleteInput multiple variant="outlined" flat density="compact"
                        label="Add Watchers" v-model="localPurchaseOrder.watcher_ids" chips closable-chips />
                    </v-col>
                    <v-col cols="12">
                      <v-textarea variant="outlined" flat density="compact" label="Description"
                        v-model="localPurchaseOrder.description" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Transaction Details -->
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="text-primary">Transaction details</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select variant="outlined" :items="transactionType" flat density="compact" label="Discount Type"
                        v-model="localPurchaseOrder.discount_type"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field variant="outlined" type="number" flat density="compact" label="Discount Amount"
                        v-model="localPurchaseOrder.discount_amount"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select variant="outlined" :items="transactionType" flat density="compact" label="Tax Type"
                        v-model="localPurchaseOrder.tax_type"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field variant="outlined" type="number" flat density="compact" label="Tax Amount"
                        v-model="localPurchaseOrder.tax_amount"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select variant="outlined" :items="transactionType" flat density="compact" label="Shipping Type"
                        v-model="localPurchaseOrder.shipping_type"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field variant="outlined" type="number" flat density="compact" label="Shipping Amount"
                        v-model="localPurchaseOrder.shipping_amount"></v-text-field>
                    </v-col>

                    <v-col>
                      <v-card-title class="text-primary">Custom Field</v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" flat density="compact" label="For Location"
                              v-model="localCustomField.for_location"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" flat density="compact" label="Invoice #"
                              v-model="localCustomField.invoice_number" :rules="[validation.required]"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-checkbox hide-details color="primary" variant="outlined" flat density="compact"
                              label="Special Ordered Part ?"
                              v-model="localCustomField.special_ordered_part"></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Adding Parts -->
            <v-col>
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col class="d-flex justify-end">
                      <v-btn color="primary" @click="addPart">Add Parts</v-btn>
                      <AddPartDialog :modelValue="localPurchaseOrderDetails" :editing="isEditingPart"
                        :show="showAddPart" :calculateSubtotalPart="calculateSubtotalPart" @close="showAddPart = false"
                        @save="addPurchaseOrderDetails" @update="updatePurchaseOrderDetails" />
                    </v-col>

                    <v-col cols="12">
                      <v-row>
                        <v-col cols="12" sm="5">{{ }}</v-col>
                        <v-col cols="12" sm="2">Qty</v-col>
                        <v-col cols="12" sm="2">Unit Cost</v-col>
                        <v-col cols="12" sm="2">Subtotal</v-col>
                        <v-col cols="12" sm="1"></v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-card-text>
                        <PartItem class="mt-2" v-for="(purchaseDetails, index) in localPurchaseOrderDetailList"
                          :key="index" :purchasePart="purchaseDetails" @:selectedPartLocations="selectedPartLocations"
                          @delete="deletePurchaseDetails(purchaseDetails?.purchase_details)"
                          @edit="editPurchaseDetails(purchaseDetails?.purchase_details)" />
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Custom Fields -->
            <!-- <v-col cols="12" md="6">
              <v-card>

              </v-card>
            </v-col> -->
            <!-- <v-card-text>
                <PurchaseOrderParts :purchaseOrder="localPurchaseOrder" />
              </v-card-text> -->
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>

        <v-spacer></v-spacer>
        <span
          v-if="!['purchased', 'received, partial', 'received, full', 'closed'].includes(localPurchaseOrder.status as string)">
          <v-btn color="secondary" @click="savePurchaseOrder('draft')" density="comfortable">Save As Draft</v-btn>
          <v-btn color="primary" :disabled="noPartsAdded" @click="savePurchaseOrder('approved')" density="comfortable"
            variant="outlined">Save
            And Approve</v-btn>
        </span>
        <v-btn v-else color="primary" @click="savePurchaseOrder" density="comfortable">Save Purchase Order</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { PurchaseCustomField, PurchaseOrder, PurchaseDetails, PurchasePart } from '@/types/maintenance/purchaseOrderTypes';
import { useValidation } from '~/composables/formValidation';
import PartItem from './components/PartItem.vue';
import AddPartOnCreateDialog from './components/AddPartOnCreateDialog.vue';
import AddPartDialog from './components/AddPartDialog.vue';
const props = defineProps({
  modelValue: Boolean,
  purchaseOrder: {
    type: Object as PropType<Partial<PurchaseOrder>>,
    required: true,
  },
});

const transactionType = [
  { value: 'fixed', title: 'Fixed' },
  { value: 'percentage', title: 'Percentage' }
]


const suppliersStore = useSuppliersStore();
const suppliers = computed(() => suppliersStore.suppliers);
const selectedPartLocations = ref<Location[]>([])
const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies } = storeToRefs(partsAndSuppliesStore)

const partLocationStore = usePartLocationStore()
const { partLocations } = storeToRefs(partLocationStore)
const showAddPart = ref(false)

const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList);

const validation = useValidation();

const layoutStore = useLayoutStore();

const emit = defineEmits(['update:modelValue', 'close', 'save']);
const purchaseOrderForm = ref<HTMLFormElement | null>(null)
const localPurchaseOrder = ref<Partial<PurchaseOrder>>(JSON.parse(JSON.stringify(props.purchaseOrder || {})));
// const localPurchasePart = ref<Partial<PurchaseParts>>({});
const localPurchaseOrderDetails = ref<Partial<PurchaseDetails>>();
const localPurchaseOrderDetailList = ref<PurchasePart[]>(JSON.parse(JSON.stringify(props.purchaseOrder.parts || {})))
const localCustomField = ref<Partial<PurchaseCustomField>>(JSON.parse(JSON.stringify(props.purchaseOrder.custom_fields || {})));
const isEditingPart = ref(false)

const title = computed(() => (props.purchaseOrder && props.purchaseOrder.id ? 'Edit Purchase Order' : 'Add Purchase Order'));

const noPartsAdded = computed(() => {
  return localPurchaseOrderDetailList.value.length ? false : true;
})

const addPart = () => {
  isEditingPart.value = false;
  localPurchaseOrderDetails.value = {}
  showAddPart.value = true
};

const addPurchaseOrderDetails = (purchaseOrderDetails: Partial<PurchaseDetails>) => {
  console.log(purchaseOrderDetails)
  const data = { purchase_details: purchaseOrderDetails, part_number: purchaseOrderDetails.part_number }
  localPurchaseOrderDetailList.value.push(data as PurchasePart)
  console.log(localPurchaseOrderDetailList)
}

const updatePurchaseOrderDetails = (purchaseOrderDetails: Partial<PurchaseDetails>) => {
  const index = localPurchaseOrderDetailList.value.findIndex((purchaseDetails: PurchasePart) => purchaseDetails.purchase_details.part_id == purchaseOrderDetails.part_id)
  const data = { purchase_details: purchaseOrderDetails, part_number: purchaseOrderDetails.part_number }
  localPurchaseOrderDetailList.value.splice(index, 1, data as PurchasePart)
}


const deletePurchaseDetails = async (purchaseOrderDetails: Partial<PurchaseDetails>) => {
  const index = localPurchaseOrderDetailList.value.findIndex((purchaseDetails: PurchasePart) => purchaseDetails.purchase_details.id == purchaseOrderDetails.id)
  if (index != -1) {
    const { confirm, cancel } = await layoutStore.showConfirmDialog('Are you sure you want to delete this part item ?')
    if (confirm) {
      localPurchaseOrderDetailList.value.splice(index, 1)
    }

  }
}

const isUpdating = ref(false)

const savePurchaseOrder = async (status?: string) => {
  const formStatus = await purchaseOrderForm.value?.validate() || false

  if (!formStatus.valid) {
    return
  }

  let payload = JSON.parse(JSON.stringify(localPurchaseOrder.value))
  payload.custom_fields = JSON.parse(JSON.stringify(localCustomField.value))
  payload.parts = localPurchaseOrderDetailList.value.map((item: any) => {
    let payload = item.purchase_details
    delete payload.part_number
    return payload
  })

  if (status) {
    payload.status = status
  }

  emit('save', payload);
  emit('update:modelValue', false);
  emit('close');
};


const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const calculateSubtotalPart = (item: any) => {
  const quantity = item.quantity_ordered
  const cost = item.unit_cost

  if (!isNaN(quantity) && !isNaN(cost)) {
    item.subtotal = quantity * cost
    localPurchaseOrderDetails.value.subtotal = parseFloat((quantity * cost).toFixed(2)) || 0

  } else {
    item.subtotal = 0;
  }
};

const editPurchaseDetails = (purchaseDetails: Partial<PurchaseDetails>) => {
  isEditingPart.value = true;
  localPurchaseOrderDetails.value = JSON.parse(JSON.stringify(purchaseDetails))
  showAddPart.value = true
}

watch(
  () => props.purchaseOrder,
  (newPurchaseOrder: any) => {
    localPurchaseOrder.value = JSON.parse(JSON.stringify(newPurchaseOrder))
    localCustomField.value = localPurchaseOrder.value.custom_fields as Partial<PurchaseCustomField> || {}
    localPurchaseOrderDetailList.value = localPurchaseOrder.value.parts as PurchasePart[] || []

  }
);
</script>