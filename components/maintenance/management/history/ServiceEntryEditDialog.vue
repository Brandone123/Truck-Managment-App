<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <div style="position:sticky; top:-15px; z-index: 2;" class="grey-background mx-n6 mt-n4">
          <v-stepper flat v-model="step">
            <v-stepper-header>
              <v-stepper-item color="primary" title="Service Entry Info" :value="1"></v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item color="primary" title="Line Items" :value="2"></v-stepper-item>
            </v-stepper-header>
          </v-stepper>
        </div>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-form ref="serviceEntryForm">
              <v-row class="mt-1">
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col cols="12">
                      <v-card>
                        <v-card-title class="font-weight-bold">Details</v-card-title>
                        <v-card-text>
                          <v-row class="mt-4">
                            <v-col cols="12" sm="6">
                              <v-select variant="outlined" flat density="compact" :items="assetList"
                                v-model="localServiceEntry.vehicle_id" item-title="name" item-value="id"
                                label="Select Vehicle" :rules="[validation.required]"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field variant="outlined" flat density="compact"
                                v-model="localServiceEntry.completed_at" label="Completion Date" type="date"
                                :rules="[validation.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field variant="outlined" flat density="compact"
                                v-model="localServiceEntry.started_at" label="Start Date"
                                type="date"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field variant="outlined" flat density="compact"
                                v-model="localServiceEntry.actual_completion_date" label="Actual Completion Date"
                                type="date" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field variant="outlined" flat density="compact"
                                v-model="localServiceEntry.reference" label="Reference" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-select variant="outlined" flat density="compact" v-model="localServiceEntry.vendor"
                                :items="vendors" label="Vendor" required></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field variant="outlined" flat density="compact" v-model="localServiceEntry.labels"
                                label="Label" required></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field variant="outlined" flat density="compact"
                                v-model="localServiceEntryMeter.meter" label="Odometer (mi)"
                                :rules="[validation.required]"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-select variant="outlined" flat density="compact" v-model="localServiceEntry.status"
                                :items="statuses" label="Status"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-select variant="outlined" flat density="compact" v-model="localServiceEntry.priority"
                                :items="['Schedule', 'Non-Schedule', 'Emergency']" label="Priority"
                                :rules="[validation.required]"></v-select>
                            </v-col>
                            <!-- <v-col cols="12">
                              <v-textarea variant="outlined" flat density="compact"
                                v-model="localServiceEntry.description" label="Description" required></v-textarea>
                            </v-col> -->
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" md="6">
                    <div>
                      <v-card>
                        <v-card-title class="font-weight-bold">Photos</v-card-title>
                        <v-card-text>
                          <v-file-input v-model="localServiceEntry.photos" :show-size="1000" color="primary"
                            label="Pick An Photos" placeholder="Select your photo" prepend-icon="mdi-camera"
                            variant="outlined" density="compact" counter multiple
                            accept="image/png, image/jpeg, image/jpg, image/bmp">
                            <template v-slot:selection="{ fileNames }">
                              <template v-for="(fileName, index) in fileNames" :key="index">
                                <v-chip v-if="index < 2" class="me-2" color="primary" size="small" label>
                                  {{ fileName }}
                                </v-chip>

                                <span v-else-if="index === 2 && localServiceEntry.photos"
                                  class="text-overline text-grey-darken-3 mx-2">
                                  +{{ localServiceEntry.photos.length - 2 }} File(s)
                                </span>
                              </template>
                            </template>
                          </v-file-input>
                        </v-card-text>
                      </v-card>

                      <v-card class="mt-3">
                        <v-card-title class="font-weight-bold">Document</v-card-title>
                        <v-card-text>
                          <v-file-input v-model="localServiceEntry.documents" :show-size="1000" color="primary"
                            label="Upload A Document" placeholder="Select your document" prepend-icon="mdi-paperclip"
                            variant="outlined" density="compact" counter multiple>
                            <template v-slot:selection="{ documentsName }">
                              <template v-for="(document, index) in documentsName" :key="index">
                                <v-chip v-if="index < 2" class="me-2" color="primary" size="small" label>
                                  {{ document }}
                                </v-chip>
                                <span v-else-if="index === 2 && localServiceEntry.documents"
                                  class="text-overline text-grey-darken-3 mx-2">
                                  +{{ localServiceEntry.documents.length - 2 }} File(s)
                                </span>
                              </template>
                            </template>
                          </v-file-input>
                        </v-card-text>
                      </v-card>
                    </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                    <v-card class="mt-2">
                      <div class="d-flex">
                        <v-card-title class="font-weight-bold">Issues</v-card-title>
                        <v-btn color="primary" @click="AddIssue" :disabled="!localServiceEntry.vehicle_id"
                          class="ml-auto mr-2 mt-3" style="cursor: pointer; font-size: small">
                          <v-icon>mdi-plus</v-icon>Add Issue
                        </v-btn>
                      </div>
                      <v-card-text>
                        <ServiceHistoryIssueList :selected="localServiceEntry.issue_ids"
                          :vehicleId="(localServiceEntry.vehicle_id as number)"
                          @onSelection="localServiceEntry.issue_ids = $event" :serviceHistoryId="localServiceEntry.id || -1" />
                      </v-card-text>
                    </v-card>
                  </v-col>
              </v-row>
            </v-form>
          </v-window-item>
          <v-window-item :value="2">
            <v-form ref="serviceEntryForm2">
              <v-row class="mt-1">
                <v-col cols="12">
                  <v-row>
                    <v-col cols="12">
                      <v-card>
                        <v-col cols="12">
                        <v-autocomplete variant="outlined" flat density="compact" :items="serviceTaskList"
                          item-title="name" item-value="id" v-model="localServiceEntryLineItem.service_task_id"
                          label="Search Service Task" @update:modelValue="addServiceTask"></v-autocomplete>
                      </v-col>
                      <v-card-text>
                        <v-row class="mb-1" v-if="localServiceEntry.line_items">
                          <v-col cols="12" sm="5"></v-col>
                          <v-col cols="12" sm="2">Labor</v-col>
                          <v-col cols="12" sm="2">Parts</v-col>
                          <v-col cols="12" sm="2">SubTotal</v-col>
                          <v-col cols="12" sm="1"></v-col>
                        </v-row>
                        <HistoryServiceTaskItem class=" mt-2" v-for="(lineItem, i) in localServiceEntry.line_items"
                          :key="i" :lineItem="lineItem" :getServiceTaskName="getServiceTaskName"
                          :getTechnicianName="getTechnicianName" @delete="deleteLineItem(i)" 
                          :calculateSubtotalItem="calculateSubtotalItem"
                          @onItemInput="onItemInput(lineItem)"/>
                      </v-card-text>

                      <v-row class="mt-8 px-4">
                        <v-col cols="12" md="7">
                          <v-textarea label="Description" variant="outlined"
                            placeholder="Add notes or additional details"
                            v-model="localServiceEntry.description"></v-textarea>
                        </v-col>
                        <v-col cols="12" md="5">
                          <p class="font-weight-bold text-h5 mb-3">Cost Summary</p>
                          <div class="d-flex justify-space-between mb-5">
                            <span>Labor</span>
                            <span>${{ getServiceHistory.labor_subtotal || '0.00' }} </span>
                          </div>
                          <div class="d-flex justify-space-between mb-5">
                            <span>Parts</span>
                            <span>${{ getServiceHistory.parts_subtotal || '0.00' }} </span>
                          </div>
                          <div class="d-flex justify-space-between mb-5">
                            <span>Subtotal</span>
                            <span>${{ getServiceHistory.subtotal || '0.00' }}</span>
                          </div>
                          <v-row>
                            <v-col cols="4" class="pt-0 d-flex align-center">Warranty Credits</v-col>
                            <v-col cols="5" class="pt-0">
                              <v-text-field density="compact" hide-details variant="outlined" type="number"
                                v-model="warranty.amount" @update:modelValue="onWarrantyCreditInput">
                                <template v-slot:prepend>
                                  <v-select
                                    :items="[{ value: 'percentage', symbol: '%' }, { value: 'fixed', symbol: '$' }]"
                                    item-value="value" item-title="symbol" variant="plain" hide-details
                                    density="compact" v-model="warranty.type"
                                    @update:modelValue="onWarrantyCreditInput">
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
                              getServiceHistory.warranty_credits || '0.00' }}</v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" class="pt-0 d-flex align-center">Discount</v-col>
                            <v-col cols="5" class="pt-0">
                              <v-text-field density="compact" hide-details variant="outlined" type="number"
                                v-model="discount.amount" @update:modelValue="onDiscountInput">
                                <template v-slot:prepend>
                                  <v-select
                                    :items="[{ value: 'percentage', symbol: '%' }, { value: 'fixed', symbol: '$' }]"
                                    item-value="value" item-title="symbol" variant="plain" hide-details
                                    density="compact" v-model="discount.type" @update:modelValue="onDiscountInput">
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
                              getServiceHistory.discount || '0.00' }}</v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" class="pt-0 d-flex align-center">Tax</v-col>
                            <v-col cols="5" class="pt-0">
                              <v-text-field density="compact" hide-details variant="outlined" type="number"
                                v-model="tax.amount" @update:modelValue="onTaxInput" min="0">
                                <template v-slot:prepend>
                                  <v-select
                                    :items="[{ value: 'percentage', symbol: '%' }, { value: 'fixed', symbol: '$' }]"
                                    item-value="value" item-title="symbol" variant="plain" hide-details
                                    density="compact" v-model="tax.type" @update:modelValue="onTaxInput">
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
                              ${{ getServiceHistory.tax || '0.00' }}
                            </v-col>
                          </v-row>
                          <v-divider class="my-2"></v-divider>
                          <div class="d-flex justify-space-between mt-4 text-h5">
                            <span>Total</span>
                            <span>${{ getServiceHistory.total_cost || '0.00' }}</span>
                          </div>
                        </v-col>
                      </v-row>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

            </v-form>

          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step > 1" color="primary" @click="step -= 1"><v-icon>mdi-chevron-left</v-icon> Back</v-btn>
        <v-btn v-if="step < 2" color="primary" @click="nextWindow">Next<v-icon>mdi-chevron-right</v-icon> </v-btn>
        <v-btn v-if="step == 2" color="primary" @click="saveServiceEntry">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import type { PropType } from 'vue';
import type { ServiceEntry, MeterServiceHistory, LineItemForServiceHistory } from '@/types/maintenance/serviceHistory';
import { useValidation } from '~/composables/formValidation';
import type { Issues } from '@/types/maintenance/issue';
import ServiceHistoryIssueList from './ServiceHistoryIssueList.vue'
import HistoryServiceTaskItem from './components/HistoryServiceTaskItem.vue'

const props = defineProps({
  modelValue: Boolean,
  serviceEntry: {
    type: Object as PropType<Partial<ServiceEntry>>,
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


const issueStore = useIssueStore();
const issueEditDialog = ref(false);

const selectedIssue = ref<Partial<Issues>>({} as Partial<Issues>);

const closeIssueEditDialog = () => {
  issueEditDialog.value = false;
};

const saveIssue = async (issue: any) => {
  if (issue.id) {
    await issueStore.updateIssue(issue);
  } else {
    await issueStore.createIssue(issue);
  }
  issueEditDialog.value = false;
}
const AddIssue = () => {
  if (!localServiceEntry.value.vehicle_id) {
    useLayoutStore().setStatusMessage('Select First A Vehicle', 'error')
  }
  selectedIssue.value = {} as Partial<Issues>;
  issueEditDialog.value = true;
}

const deleteLineItem = (index: number) => {
  localServiceEntry.value.line_items?.splice(index, 1)
  onDeleteLineItem()
}

const calculateSubtotalItem = (item: any) => {
  const part = item.part_cost
  const labor = item.labor_cost

  if(!isNaN(labor)){
    const payloadLabor = localServiceEntry.value.line_items?.reduce((total, lineItem) => total + lineItem.labor_cost, 0) || 0.00;
    localServiceEntry.value.labor_subtotal = parseFloat(payloadLabor.toFixed(2))
  }  
  if (!isNaN(part)){
    const payloadPart = localServiceEntry.value.line_items?.reduce((total, lineItem) => total + lineItem.part_cost, 0) || 0.00
    localServiceEntry.value.parts_subtotal = parseFloat(payloadPart.toFixed(2))
  } 
   if (!isNaN(part) && !isNaN(labor)) {
    item.subtotal = parseFloat(part) + parseFloat(labor)
    localServiceEntryLineItem.value.subtotal = parseFloat((part + labor).toFixed(2))
    const totalsubtotal = localServiceEntry.value.line_items?.reduce((total, lineItem) => total + lineItem.part_cost, 0) || 0.00
    localServiceEntry.value.subtotal = parseFloat(totalsubtotal.toFixed(2))
  } else {
    item.subtotal = 0;
  }
};

const calculateAllPartsSubtotal = () => {
  const payload = localServiceEntry.value.line_items?.reduce((total, lineItem) => total + lineItem.part_cost, 0) || 0.00
  localServiceEntry.value.parts_subtotal = parseFloat(payload.toFixed(2))
}

const calculateAllLaborSubtotal = () => {
  const payload = localServiceEntry.value.line_items?.reduce((total, lineItem) => total + lineItem.labor_cost, 0) || 0.00;
  localServiceEntry.value.labor_subtotal = parseFloat(payload.toFixed(2))
}

const calculateAllSubtotal = () => {
  const payload = localServiceEntry.value.line_items?.reduce((total, lineItem) => total + lineItem.subtotal, 0) || 0.00;
  localServiceEntry.value.subtotal = parseFloat(payload.toFixed(2))
}

const onItemInput = (lineItem: LineItemForServiceHistory) => {
  lineItem.part_cost = parseFloat(lineItem.part_cost.toFixed(2))
  lineItem.labor_cost = parseFloat(lineItem.labor_cost.toFixed(2))
  if (!lineItem.labor_cost) lineItem.labor_cost = 0
  if (!lineItem.part_cost) lineItem.part_cost = 0
  lineItem.subtotal = parseFloat((lineItem.part_cost + lineItem.labor_cost).toFixed(2))
  calculateAllPartsSubtotal()
  calculateAllLaborSubtotal()
  calculateAllSubtotal()
  calculateWarranty()
  calculateDiscount()
  calculateTax()
  calculateServiceHistoryCost()
}

const onLaborItemInput = (lineItem: LineItemForServiceHistory) => {
  lineItem.labor_cost = parseFloat(lineItem.labor_cost.toFixed(2))
  if (!lineItem.part_cost) lineItem.part_cost = 0
  lineItem.subtotal = parseFloat((lineItem.part_cost + lineItem.labor_cost).toFixed(2))
  calculateAllLaborSubtotal()
  calculateAllSubtotal()
  calculateWarranty()
  calculateDiscount()
  calculateTax()
  calculateServiceHistoryCost()
}

const onDeleteLineItem = () => {
  calculateAllPartsSubtotal()
  calculateAllLaborSubtotal()
  calculateAllSubtotal()
  calculateWarranty()
  calculateDiscount()
  calculateTax()
  calculateServiceHistoryCost()
}

const calculateWarranty = () => {
  switch (warranty.value.type) {
    case 'percentage':
      let payload = ((warranty.value.amount || 0) * (localServiceEntry.value.subtotal || 0)) / 100;
      localServiceEntry.value.warranty_credits = parseFloat(payload.toFixed(2))
      break;
    case 'fixed':
      localServiceEntry.value.warranty_credits = warranty.value.amount || 0
      break;
  }
}

const calculateDiscount = () => {
  switch (discount.value.type) {
    case 'percentage':
      let payload = ((discount.value.amount || 0) * (localServiceEntry.value.subtotal || 0)) / 100;
      localServiceEntry.value.discount = parseFloat(payload.toFixed(2))
      break;
    case 'fixed':
      localServiceEntry.value.discount = discount.value.amount || 0
      break;
  }
}

const calculateTax = () => {
  switch (tax.value.type) {
    case 'percentage':
      let payload = ((tax.value.amount || 0) * ((localServiceEntry.value.subtotal || 0) - (localServiceEntry.value.discount || 0) - (localServiceEntry.value.warranty_credits || 0))) / 100;
      localServiceEntry.value.tax = parseFloat(payload.toFixed(2))
      break;
    case 'fixed':
      localServiceEntry.value.tax = tax.value.amount || 0
      break;
  }
}

const calculateServiceHistoryCost = () => {
  let payload = (localServiceEntry.value.subtotal || 0) - (localServiceEntry.value.tax || 0) - (localServiceEntry.value.discount || 0)
  localServiceEntry.value.total_cost = parseFloat(payload.toFixed(2))
}

const validation = useValidation();
const emit = defineEmits(['update:model-value', 'close', 'save']);
const openPanel = ref<number[]>([0]);
const step = ref(1);
const serviceEntryForm = ref<HTMLFormElement | null>(null)
const serviceEntryForm2 = ref<HTMLFormElement | null>(null)

const workOrderStore = useWorkOrderStore();
const { workOrders } = storeToRefs(workOrderStore)

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

const getServiceTaskName = (serviceTaskId: number) => {
  const taskName = serviceTaskList.value.find(task => task.id == serviceTaskId)
  return taskName ? taskName.name : ''
}

const getTechnicianName = (user_id: any) => {
  const TechnicianName = technicians.value.find((tech) => tech.user_id === user_id)
  return TechnicianName ? TechnicianName.full_name : ''
}

const getServiceHistoryData = (serviceHistory: Partial<ServiceEntry>) => {
  let newData = JSON.parse(JSON.stringify(serviceHistory)) || {}
  newData.issue_ids = newData.issues?.map((item: any) => item.id) || []
  return newData
}

const getServiceHistory = computed(() => {
  return localServiceEntry.value
})

const localServiceEntry = ref<Partial<ServiceEntry>>(getServiceHistoryData(props.serviceEntry));

const localServiceEntryLineItem = ref<Partial<LineItemForServiceHistory>>({});

const localServiceEntryMeter = ref<Partial<MeterServiceHistory>>(JSON.parse(JSON.stringify(props.serviceEntry.meter || {})));

const { modelValue, serviceEntry } = toRefs(props);

watch([modelValue, serviceEntry], ([newModelValue, newServiceEntry]) => {
  if (newModelValue === false) {
    resetForm();
  }

  if (newServiceEntry) {
    localServiceEntry.value = { ...newServiceEntry };
  }
})

const resetForm = () => {
  localServiceEntry.value = {} as Partial<ServiceEntry>
  step.value = 1
}

const title = computed(() => (localServiceEntry.value.id ? 'Edit Service Entry' : 'Create Service Entry'));

const vehicles = [{ label: 'VEH-001', value: '1' }, { label: 'VEH-002', value: '2' }, { label: 'VEH-003', value: '3' }]
const vendors = ['Local Garage', 'Tire Shop']; // Replace with actual vendor data
const statuses = ['Pending', 'In Progress', 'Completed'];

const addServiceTask = () => {
  const selectedService = localServiceEntryLineItem.value.service_task_id;

  if (!selectedService) {
    return;
  }

  if (!localServiceEntry.value.line_items) {
    localServiceEntry.value.line_items = [];
  }

  const existingTaskIndex = localServiceEntry.value.line_items.findIndex(task => task.service_task_id === selectedService);

  if (existingTaskIndex === -1) {

    const newTask: LineItemForServiceHistory = {
      service_task_id: selectedService,
      part_cost: 0.00,
      labor_cost: 0.00,
      subtotal: 0.00,
      notes: null
    };

    localServiceEntry.value.line_items.push(newTask);
  }

  //clear service task selection:
  localServiceEntryLineItem.value = {} as Partial<LineItemForServiceHistory>
};

const removeServiceTask = (index: number) => {
  if (!localServiceEntry.value.service_tasks) {
    localServiceEntry.value.service_tasks = [];
  }
  localServiceEntry.value.service_tasks.splice(index, 1);
};

const calculateSubtotal = (item: any) => {
  const laborCost = parseFloat(item.labor_cost);
  const partCost = parseFloat(item.part_cost);

  if (!isNaN(laborCost) && !isNaN(partCost)) {
    item.subtotal = laborCost + partCost;
  } else {
    item.subtotal = 0;
  }
};

const onDiscountInput = () => {
  calculateDiscount()
  calculateTax()
  calculateServiceHistoryCost()
}

const onWarrantyCreditInput = () => {
  calculateWarranty()
  calculateTax()
  calculateServiceHistoryCost()
}

const onTaxInput = () => {
  calculateTax()
  calculateServiceHistoryCost()
}

const validateForm1 = async () => {
  let formStatus = await serviceEntryForm.value?.validate()
  return formStatus.valid ? true : false
}

const validateForm2 = async () => {
  let formStatus = await serviceEntryForm2.value?.validate()
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

const extractServiceNames = (serviceTaskString: any) => {
  return serviceTaskString.split("|");
}

const serviceTasksList = (tasksString: any) => {
  return tasksString ? tasksString.split('|').map((task: any) => task.trim()) : {};
};

const calculateTotalCost = (items: Array<{ subtotal: any }>) => {
  return parseFloat(items.reduce((total, item) => {
    return total + item.subtotal;
  }, 0).toFixed(2))
};

const calculateGeneralSubtotal = (laborCost: number, partCost: number) => {
  return parseFloat((laborCost + partCost).toFixed(2))
};

const updateModelValue = (value: boolean) => {
  emit('update:model-value', value);
};

const closeDialog = () => {
  emit('update:model-value', false);
  emit('close');
};

const saveServiceEntry = async () => {
  // validate first window
  let validForm1 = await validateForm1()
  if (!validForm1) {
    step.value = 1
    return;
  }

  // validate second window
  let validForm2 = await validateForm2()
  if (!validForm2) {
    return
  }

  emit('save', localServiceEntry.value);
  emit('update:model-value', false);
  emit('close');
};

// reset selected issues when vehicle id changes
watch(() => localServiceEntry.value.vehicle_id, (newVal) => {
  if (newVal != props.serviceEntry.vehicle_id) {
    localServiceEntry.value.issue_ids = []
  } else {
    localServiceEntry.value.issue_ids = (localServiceEntry.value?.issues || []).map(item => item.id) || []
  }
})

onMounted(() => {
  workOrderStore.fetchWorkOrders()
  serviceTaskStore.fetchServiceTasks()
  assetStore.fetchAssets()
})
</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>