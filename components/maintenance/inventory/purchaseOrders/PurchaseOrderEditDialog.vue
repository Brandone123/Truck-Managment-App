<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div style="position:sticky; top:-15px; z-index: 2;" class="grey-background mx-n6 mt-n4">
        <v-stepper flat v-model="step">
          <v-stepper-header>
            <v-stepper-item color="primary" title="Purchase Order Info" :value="1"></v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item color="primary" title="Line Items" :value="2"></v-stepper-item>
          </v-stepper-header>
        </v-stepper>
      </div>
      <v-card-text>
        <v-form ref="purchaseOrderForm">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card>
                    <v-card-title class="text-primary">Details</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-autocomplete variant="outlined" flat density="compact" label="Select Vendor*"
                            :items="suppliers" item-title="name" item-value="id" v-model="localPurchaseOrder.vendor_id"
                            :rules="[validation.required]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-autocomplete variant="outlined" flat density="compact" label="Select Location*"
                            :items="partLocations" item-title="name" item-value="id"
                            v-model="localPurchaseOrder.location_id" :rules="[validation.required]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" label="Purchased Date"
                            type="datetime-local" v-model="localPurchaseOrder.purchased_at" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-autocomplete variant="outlined" flat density="compact" label="Created By*"
                            :items="technicians" item-title="full_name" item-value="user_id"
                            v-model="localPurchaseOrder.created_by" :rules="[validation.required]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-autocomplete variant="outlined" flat density="compact" label="Purchased By*"
                            :items="technicians" item-title="full_name" item-value="user_id"
                            v-model="localPurchaseOrder.purchased_by" :rules="[validation.required]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact"
                            :items="['draft', 'pending, approval', 'rejected', 'approved', 'purchased', 'received, partial', 'received, full', 'closed']"
                            label="Status*" v-model="localPurchaseOrder.status" required
                            :rules="[validation.required]"></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete v-model="localPurchaseOrder.watchers" :disabled="isUpdating"
                            :items="technicians" color="blue-grey-lighten-2" item-title="full_name" item-value="user_id"
                            label="Add Watchers" chips closable-chips multiple density="compact" variant="outlined">
                            <template v-slot:chip="{ props, item }">
                              <v-chip v-bind="props" :prepend-avatar="getAvatarIcon(item.raw.full_name, 24, 18)"
                                :text="item.raw.full_name"></v-chip>
                            </template>

                            <template v-slot:item="{ props, item }">
                              <v-list-item v-bind="props" :prepend-avatar="getAvatarIcon(item.raw.full_name, 32, 24)"
                                :subtitle="item.raw.job_title as string" :title="item.raw.full_name"></v-list-item>
                            </template>
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-row>
                    <v-col cols="12">
                      <v-card>
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
                              <v-checkbox  hide-details color="primary" variant="outlined" flat density="compact" label="Special Ordered Part ?"
                                v-model="localCustomField.special_ordered_part"></v-checkbox>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <v-row>
                <v-col>
                  <v-card>
                    <v-card-title class="text-primary">Parts</v-card-title>
                    <v-card-text>
                      <v-row>
                        <!-- purchase order dropdown -->
                        <v-col cols="12">
                            <v-autocomplete variant="outlined" flat density="compact" :items="partSupplies"
                            @update:modelValue="addPart(localPurchasePart.part_id)" item-title="part_number" item-value="id" v-model="localPurchasePart.part_id"
                                label="Select A Part*">
                                <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props" :title="item.raw.part_number" style="width:100%;">
                                        <template v-slot:prepend>
                                            <v-icon>mdi-package-variant-closed</v-icon>
                                        </template>
                                        <v-list-item-subtitle>
                                            <v-tooltip text="Manufacturer Part Number">
                                                <template v-slot:activator="{ props }">
                                                    <span v-bind="props"
                                                        style="font-size: 12px;border-bottom: 1px dotted;">{{
                                                            item.raw.manufacturer_part_number
                                                        }}</span>
                                                </template>
                                            </v-tooltip>
                                            <span class="mx-1">.</span>
                                            <span style="font-size: 12px;text-overflow:ellipsis;">{{
                                                item.raw.description }}</span>
                                        </v-list-item-subtitle>
                                        <template v-slot:append>
                                            <span class="text-caption text-grey">{{
                                                getTotalQuantity(item.raw.locations) }} </span>
                                        </template>

                                    </v-list-item>
                                </template>
                            </v-autocomplete>
                        </v-col>

                        <v-card-text v-if="localPurchasePart">
                          <v-row>
                            <v-col cols="12" sm="5"></v-col>
                            <v-col cols="12" sm="2">Qty</v-col>
                            <v-col cols="12" sm="2">Unit Cost</v-col>
                            <v-col cols="12" sm="2">Subtotal</v-col>
                            <v-col cols="12" sm="1"></v-col>
                          </v-row>
                          <div>
                            <PartItem class="mt-2" v-for="(partItem, indexPart) in localPurchaseOrder.parts"
                              :key="indexPart" :partItem="partItem" :getPartNumber="getPartNumber"
                              :calculateSubtotalPart="calculateSubtotalPart"
                              :getSelectedPartLocations="getSelectedPartLocations"
                              @onEdit="editPart(partItem, indexPart)" @onInput="onPartItemInput()" />
                          </div>
                        </v-card-text>
                      </v-row>

                      <v-row class="mt-8 px-4">
                        <v-col cols="12" md="7">
                          <v-textarea label="Description" variant="outlined"
                            placeholder="Add notes or additional details"
                            v-model="localPurchaseOrder.description"></v-textarea>
                        </v-col>
                        <v-col cols="12" md="5">
                          <p class="font-weight-bold text-h5 mb-3">Cost Summary</p>
                          <div class="d-flex justify-space-between mb-5">
                            <span>Subtotal</span>
                            <span>${{ localPurchaseOrder.subtotal || '0.00' }}</span>
                          </div>
                          <v-row>
                            <v-col cols="4" class="pt-0 d-flex align-center">Shipping</v-col>
                            <v-col cols="5" class="pt-0">
                              <v-text-field density="compact" hide-details variant="outlined" type="number"
                                v-model.number="localPurchaseOrder.shipping_amount"
                                @update:modelValue="onShippingInput">
                                <template v-slot:prepend>
                                  <v-select
                                    :items="[{ value: 'percentage', symbol: '%' }, { value: 'fixed', symbol: '$' }]"
                                    item-value="value" item-title="symbol" variant="plain" hide-details
                                    density="compact" v-model="localPurchaseOrder.shipping_type"
                                    @update:modelValue="onShippingInput">
                                    <template v-slot:item="{ props, item }">
                                      <v-list-item v-bind="props" title="">
                                        <v-list-item-title>
                                          <div class="d-flex justify-space-between">
                                            <span>{{ item.raw.value }} </span>
                                            <span class="ml-4">{{ item.raw.symbol }}</span>
                                          </div>
                                        </v-list-item-title>
                                      </v-list-item>
                                    </template>
                                  </v-select>
                                </template>
                              </v-text-field>
                            </v-col>
                            <v-col cols="3" class="pt-0 d-flex justify-end align-center"> ${{
                              localPurchaseOrder.shipping_amount || '0.00' }}</v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" class="pt-0 d-flex align-center">Discount</v-col>
                            <v-col cols="5" class="pt-0">
                              <v-text-field density="compact" hide-details variant="outlined" type="number"
                                v-model.number="localPurchaseOrder.discount_amount"
                                @update:modelValue="onDiscountInput">
                                <template v-slot:prepend>
                                  <v-select
                                    :items="[{ value: 'percentage', symbol: '%' }, { value: 'fixed', symbol: '$' }]"
                                    item-value="value" item-title="symbol" variant="plain" hide-details
                                    density="compact" v-model="localPurchaseOrder.discount_type"
                                    @update:modelValue="onDiscountInput">
                                    <template v-slot:item="{ props, item }">
                                      <v-list-item v-bind="props" title="">
                                        <v-list-item-title>
                                          <div class="d-flex justify-space-between">
                                            <span>{{ item.raw.value }} </span>
                                            <span class="ml-4">{{ item.raw.symbol }}</span>
                                          </div>
                                        </v-list-item-title>
                                      </v-list-item>
                                    </template>
                                  </v-select>
                                </template>
                              </v-text-field>
                            </v-col>
                            <v-col cols="3" class="pt-0 d-flex justify-end align-center">- ${{
                              localPurchaseOrder.discount_amount || '0.00' }}</v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" class="pt-0 d-flex align-center">Tax</v-col>
                            <v-col cols="5" class="pt-0">
                              <v-text-field density="compact" hide-details variant="outlined" type="number"
                                v-model.number="localPurchaseOrder.tax_amount" @update:modelValue="onTaxInput" min="0">
                                <template v-slot:prepend>
                                  <v-select
                                    :items="[{ value: 'percentage', symbol: '%' }, { value: 'fixed', symbol: '$' }]"
                                    item-value="value" item-title="symbol" variant="plain" hide-details
                                    density="compact" v-model="localPurchaseOrder.tax_type"
                                    @update:modelValue="onTaxInput">
                                    <template v-slot:item="{ props, item }">
                                      <v-list-item v-bind="props" title="">
                                        <v-list-item-title>
                                          <div class="d-flex justify-space-between">
                                            <span>{{ item.raw.value }} </span>
                                            <span class="ml-4">{{ item.raw.symbol }}</span>
                                          </div>
                                        </v-list-item-title>
                                      </v-list-item>
                                    </template>
                                  </v-select>
                                </template>
                              </v-text-field>
                            </v-col>
                            <v-col cols="3" class="pt-0 d-flex justify-end align-center">
                              ${{ localPurchaseOrder.tax_amount || '0.00' }}
                            </v-col>
                          </v-row>
                          <v-divider class="my-2"></v-divider>
                          <div class="d-flex justify-space-between mt-4 text-h5">
                            <span>Total</span>
                            <span>${{ getPurchaseOrder.total_amount || '0.00' }}</span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Add Part Dialog -->
              <AddPartDialog :modelValue="localPurchasePart" :editing="isEditingPart" :show="showAddPart"
                :calculateSubtotalPart="calculateSubtotalPart" @close="showAddPart = false" @save="savePart"
                @update="savePartUpdate" />
            </v-window-item>
          </v-window>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step > 1" color="primary" @click="step -= 1"><v-icon>mdi-chevron-left</v-icon> Back</v-btn>
        <v-btn v-if="step < 2" color="primary" @click="nextWindow">Next<v-icon>mdi-chevron-right</v-icon> </v-btn>
        <v-btn v-if="step == 2" color="primary" @click="savePurchaseOrder">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { PurchaseOrder, PurchaseCustomField, PurchaseParts } from '@/types/maintenance/purchaseOrderTypes';
import { useValidation } from '~/composables/formValidation';
import PartItem from './components/PartItem.vue';
import AddPartDialog from './components/AddPartDialog.vue'

const props = defineProps({
  modelValue: Boolean,
  purchaseOrder: {
    type: Object as PropType<Partial<PurchaseOrder>>,
    required: true,
  },
});

const warranty = ref({
  type: 'percentage',  // or 'fixed'
  amount: 0,
})

const discount = ref({
  type: 'percentage',  // or 'fixed'
  amount: 0,
})

const tax = ref({
  type: 'percentage',  // or 'fixed'
  amount: 0,
})

const step = ref(1)

const purchaseOrderForm2 = ref<HTMLFormElement | null>(null)

const validateForm1 = async () => {
  let formStatus = await purchaseOrderForm.value?.validate()
  return formStatus.valid ? true : false
}

const nextWindow = async () => {
  switch (step.value) {
    case 1:
      let valid = await validateForm1()
      if (valid) {
        step.value = 2
      }
      break
    default:
      //do nothing
      break;
  }
}

const getTotalQuantity = (locations: any) => {
    return locations.reduce((acc: number, location: any) => {
        acc += (location?.quantity || 0);
        return acc;
    }, 0);
}

const calculateShipping = () => {
  switch (localPurchaseOrder.value.shipping_type) {
    case 'percentage':
      let payload = ((localPurchaseOrder.value.shipping_amount || 0) * (localPurchaseOrder.value.subtotal || 0)) / 100;
      localPurchaseOrder.value.shipping = parseFloat(payload.toFixed(2))
      break;
    case 'fixed':
      localPurchaseOrder.value.shipping = localPurchaseOrder.value.shipping_amount || 0
      break;
  }
}

const calculateDiscount = () => {
  switch (localPurchaseOrder.value.discount_type) {
    case 'percentage':
      let payload = ((localPurchaseOrder.value.discount_amount || 0) * (localPurchaseOrder.value.subtotal || 0)) / 100;
      localPurchaseOrder.value.discount = parseFloat(payload.toFixed(2))
      break;
    case 'fixed':
      localPurchaseOrder.value.discount = localPurchaseOrder.value.discount_amount || 0
      break;
  }
}

const calculateTax = () => {
  switch (localPurchaseOrder.value.tax_type) {
    case 'percentage':
      //formula: tax = subtotal - discount * 100%
      let payload = ((localPurchaseOrder.value.tax_amount || 0) * ((localPurchaseOrder.value.subtotal || 0) - (localPurchaseOrder.value.discount || 0))) / 100;
      localPurchaseOrder.value.tax = parseFloat(payload.toFixed(2))
      break;
    case 'fixed':
      localPurchaseOrder.value.tax = localPurchaseOrder.value.tax_amount || 0
      break;
  }
}

const calculatePurchaseCost = () => {
  let payload = (localPurchaseOrder.value.subtotal || 0) - (localPurchaseOrder.value.discount || 0) + (localPurchaseOrder.value.shipping || 0) + (localPurchaseOrder.value.tax || 0) 
  localPurchaseOrder.value.total_amount = parseFloat(payload.toFixed(2))
}

const suppliersStore = useSuppliersStore();
const suppliers = computed(() => suppliersStore.suppliers);

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies } = storeToRefs(partsAndSuppliesStore) 

const partLocationStore = usePartLocationStore()
const { partLocations } = storeToRefs(partLocationStore)

const validation = useValidation();
const emit = defineEmits(['update:modelValue', 'close', 'save']);
const purchaseOrderForm = ref<HTMLFormElement | null>(null)
const localPurchaseOrder = ref<Partial<PurchaseOrder>>(JSON.parse(JSON.stringify(props.purchaseOrder || {})));

const localCustomField = ref<Partial<PurchaseCustomField>>(JSON.parse(JSON.stringify(props.purchaseOrder.custom_fields || {})));

const localPurchasePart = ref<Partial<PurchaseParts>>({});

const title = computed(() => (props.purchaseOrder && props.purchaseOrder.id ? 'Edit Purchase Order' : 'Add Purchase Order'));

const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList);

const isUpdating = ref(false)

function getAvatarIcon(label: any, size: any, circleSize: any) {

  // Générer les initiales à partir du label
  const words = Boolean(label) ? label.split(' ') : ['N', 'A'];
  const initials = words.map((word: string) => word.charAt(0).toUpperCase());

  // Créer un canvas et un contexte 2D
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  // Générer une couleur unique pour l'avatar
  const colorHash = ( Boolean(label) ? label.split('') : ['N', 'A']).reduce((acc: number, char: string) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
  const color = `#${(colorHash & 0xFFFFFF).toString(16).padStart(6, '0')}`;

  // Dessiner le fond avec la couleur unique
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, circleSize / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Dessiner les initiales en blanc
  ctx.font = `${(circleSize * 0.6)}px Arial`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials.slice(0, 2).join(''), size / 2, size / 2);

  return canvas.toDataURL();

}

const onDiscountInput = () => {
  calculateDiscount()
  calculateTax()
  calculatePurchaseCost()
}

const onShippingInput = () => {
  calculateShipping()
  calculateTax()
  calculatePurchaseCost()
}

const onTaxInput = () => {
  calculateTax()
  calculatePurchaseCost()
}

watch(
  () => props.purchaseOrder,
  (newPurchaseOrder) => {
    localPurchaseOrder.value = JSON.parse(JSON.stringify(newPurchaseOrder))
    localCustomField.value = localPurchaseOrder.value.custom_fields as Partial<PurchaseCustomField> || {}
  }
);

watch(()=>props.modelValue,newVal =>{
  if(newVal == false){
    resetForm()
  }
})

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const resetForm = () => {
  localPurchaseOrder.value = {} as Partial<PurchaseOrder>
  step.value = 1
}

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const showAddPart = ref(false)
const isEditingPart = ref(false)
const editPartIndex = ref(-1)

const addPart = (partId: any) => {
  localPurchasePart.value = JSON.parse(JSON.stringify({} as Partial<PurchaseParts>))
  localPurchasePart.value.part_id = partId
  localPurchasePart.value.quantity_ordered = 0 //set default quantity to 0
  localPurchasePart.value.quantity_received = 0
  localPurchasePart.value.subtotal = 0.00

  isEditingPart.value = false
  showAddPart.value = true
  editPartIndex.value = -1
};

const editPart = (part: PurchaseParts, partIndex: number) => {
  localPurchasePart.value = JSON.parse(JSON.stringify(part))
  isEditingPart.value = true
  showAddPart.value = true
  editPartIndex.value = partIndex
}

const getPartNumber = (partId: number) => {
  return partSupplies.value?.find(part => part.id == partId)?.part_number
}

const getSelectedPartLocations = (selectedPart: string) => {
  return partSupplies.value.find(part => part.part_number == selectedPart)?.locations || []
}

const calculateSubtotalPart = (item: any) => {
  const quantity = item.quantity_ordered
  const cost = item.unit_cost

  if (!isNaN(quantity) && !isNaN(cost)) {
    item.subtotal = quantity * cost
    localPurchasePart.value.subtotal = parseFloat((quantity * cost).toFixed(2))
  } else {
    item.subtotal = 0;
  }
};

const calculateAllSubtotal = () => {
  const payload = localPurchaseOrder.value.parts?.reduce((total, lineItem) => total + lineItem.subtotal, 0) || 0.00;
  localPurchaseOrder.value.subtotal = parseFloat(payload.toFixed(2))
}

const onPartItemInput = () => {
  calculateAllSubtotal()
  calculateShipping()
  calculateDiscount()
  calculateTax()
  calculatePurchaseCost()
}


function calculateTotalCost(parts: PurchaseParts[]) {
  return parts.reduce((total, part) => total + part.subtotal, 0);
}

const savePart = (Part: PurchaseParts) => {
  if (!localPurchaseOrder.value.parts) {
    localPurchaseOrder.value.parts = [];
  }

  const partItem = { ...Part };

  const partIndex = localPurchaseOrder.value.parts.findIndex(
    part => part.part_id === partItem.part_id
  );

  // Créer une nouvelle pièce
  if (partIndex === -1) {
    localPurchaseOrder.value.parts.push(partItem);
  }
  // Mettre à jour une pièce existante
  else {
    localPurchaseOrder.value.parts[partIndex] = partItem;
  }

  // Mettre à jour le coût total
  localPurchaseOrder.value.subtotal = calculateTotalCost(localPurchaseOrder.value.parts);
  localPurchaseOrder.value.total_amount = localPurchaseOrder.value.subtotal + (localPurchaseOrder.value.shipping || 0) + (localPurchaseOrder.value.tax || 0) - (localPurchaseOrder.value.discount || 0);

  localPurchasePart.value = JSON.parse(JSON.stringify({} as Partial<PurchaseParts>));
  showAddPart.value = false;
  isEditingPart.value = false;
  editPartIndex.value = -1;
};

const savePartUpdate = (Part: PurchaseParts) => {
  if (!localPurchaseOrder.value.parts) {
    localPurchaseOrder.value.parts = [];
  }

  const partIndex = localPurchaseOrder.value.parts.findIndex(
    part => part.part_id === Part.part_id
  );

  if (partIndex !== -1) {
    localPurchaseOrder.value.parts[partIndex] = Part;

    // Mettre à jour le coût total
    localPurchaseOrder.value.subtotal = calculateTotalCost(localPurchaseOrder.value.parts);
    localPurchaseOrder.value.total_amount = localPurchaseOrder.value.subtotal + (localPurchaseOrder.value.shipping || 0) + (localPurchaseOrder.value.tax || 0) - (localPurchaseOrder.value.discount || 0);
  } else {
    console.error('Impossible de trouver la pièce à mettre à jour.');
  }

  localPurchasePart.value = JSON.parse(JSON.stringify({} as Partial<PurchaseParts>));
  showAddPart.value = false;
  isEditingPart.value = false;
  editPartIndex.value = -1;
};

const savePurchaseOrder = async () => {
  const formStatus = await purchaseOrderForm.value?.validate() || false

  if (!formStatus.valid) {
    return
  }

  let payload = JSON.parse(JSON.stringify(localPurchaseOrder.value))
  payload.custom_fields = JSON.parse(JSON.stringify(localCustomField.value))

  emit('save', payload);
  emit('update:modelValue', false);
  emit('close');
};

const getPurchaseOrder = computed(() => {
  return localPurchaseOrder.value
})

// onMounted(() => {
//   suppliersStore.fetchSuppliers()
//   partsAndSuppliesStore.fetchPartSupplies()
//   techniciansStore.fetchTechnicians()
// })
</script>