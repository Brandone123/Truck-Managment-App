<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Part/Supply Details</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text style="" class="pa-0">
        <div class="d-flex" style="height: calc(100vh - (48px + 60px))">
          <div class="flex-grow-1" style="overflow-y: auto;">
            <v-row no-gutters>
              <v-col :cols="showSidePanel ? 12 : 6" class="pa-3">
                <v-card>
                  <v-card-title class="font-weight-bold text-primary">Details</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Status</v-col>
                      <v-col cols="12" md="6" class="text-capitalize">
                        <v-chip density="compact" variant="flat" :color="getStatusColor(purchaseOrder.status)">
                          {{ purchaseOrder.status }}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Part Location</v-col>
                      <v-col cols="12" md="6">{{ getLocationName(purchaseOrder.location_id) }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Vendor</v-col>
                      <v-col cols="12" md="6">
                        <div class="text-secondary">
                          <v-icon>mdi-store</v-icon>
                          <span style="border-bottom: 1px dotted">
                            {{ getVendorName(purchaseOrder.vendor_id) }}
                          </span>
                        </div>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Created by</v-col>
                      <v-col cols="12" md="6">
                        <SharedTableTechnicianItem v-if="purchaseOrder.created_by" :userId="purchaseOrder.created_by" />
                        <span v-else>N/A</span>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Date Created</v-col>
                      <v-col cols="12" md="6">{{ purchaseOrder.created_at?.substring(0, 10) }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Description</v-col>
                      <v-col cols="12" md="6">{{ purchaseOrder.description ? purchaseOrder.description : "N/A"
                        }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Special Ordered Part</v-col>
                      <v-col cols="12" md="6">{{ purchaseOrder.custom_fields.special_ordered_part ? "Yes" : "No"
                        }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">For Location</v-col>
                      <v-col cols="12" md="6">{{ purchaseOrder.custom_fields.for_location || "N/A"
                        }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">INVOICE #</v-col>
                      <v-col cols="12" md="6">{{ purchaseOrder.custom_fields.invoice_number || "N/A"
                        }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Watchers</v-col>
                      <v-col cols="12" md="6">
                        <template v-for="(userId, index) in (purchaseOrder.watchers || [])" :key="index">
                          <SharedTableTechnicianItem :userId="userId" />
                        </template>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col :cols="showSidePanel ? 12 : 6" class="pa-3">
                <v-card>
                  <v-card-title class="font-weight-bold text-primary">Line Items</v-card-title>
                  <v-table>
                    <thead>
                      <tr>
                        <th><strong>Part</strong></th>
                        <th><strong>Qte Ordered</strong></th>
                        <th><strong>Qte Received</strong></th>
                        <th><strong>Unit Cost</strong></th>
                        <th><strong>Subtotal</strong></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="purchaseOrder.parts" v-for="(part, index) in purchaseOrder.parts" :key="index">
                        <td>{{ getPartNumber(part.part_id) }}</td>
                        <td>{{ part.quantity_ordered }}</td>
                        <td>{{ part.quantity_received }}</td>
                        <td>${{ part.unit_cost }}</td>
                        <td>${{ part.subtotal }}</td>
                      </tr>
                      <tr v-else>
                        <td colspan="4">
                          <p class="text-grey text-justify-center" style="font-size: small">
                            No results to show.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <v-col cols="12">
                    <v-table class="grey-background text-right ">
                      <tbody>
                        <tr class="text-h7">
                          <td><strong>SubTotal</strong>
                          </td>
                          <td>
                            <strong>${{ purchaseOrder.subtotal || '0.00' }}</strong>
                          </td>
                        </tr>
                        <tr class="text-h7">
                          <td><strong>Tax({{ purchaseOrder.tax_type == 'percentage' ? purchaseOrder.tax_amount + '%' :
                            'Fixed'
                              }})</strong></td>
                          <td><strong>+${{ purchaseOrder.tax?.amount || '0.00' }}</strong></td>
                        </tr>
                        <tr class="text-h7">
                          <td><strong>Shipping({{ purchaseOrder.tax_type == 'percentage' ? purchaseOrder.tax_amount +
                            '%' : 'Fixed'
                              }})</strong></td>
                          <td><strong>-${{ purchaseOrder.shipping?.amount || '0.00' }}</strong></td>
                        </tr>
                        <tr class="text-h7">
                          <td><strong>Discount({{ purchaseOrder.tax_type == 'percentage' ? purchaseOrder.tax_amount +
                            '%' : 'Fixed'
                              }})</strong></td>
                          <td><strong>-${{ purchaseOrder.discount?.amount || '0.00' }}</strong></td>
                        </tr>
                        <tr class="text-h6">
                          <td><strong>Total Amount</strong></td>
                          <td><strong>${{ purchaseOrder.total_amount }}</strong></td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Side bar componet -->
          <v-expand-x-transition>
            <div v-if="showSidePanel" style="height: calc(100vh - (48px + 60px));width:400px">
              <!-- Side Pannel Window Items -->
              <v-window v-model="currentStep" style="height: calc(100vh - (48px + 60px));">
                <!-- Message Window -->
                <v-window-item :value="1"
                  style="position:relative;overflow-y:auto;height: calc(100vh - (48px + 60px));">
                  <v-sheet flat class="d-flex flex-column fill-height">
                    <v-card-title>Comments</v-card-title>
                    <div class="flex-grow-1">
                      <div v-if="purchaseOrder.comments">
                        <v-list>
                          <v-list-item v-for="(comment, index) in purchaseOrder.comments" :key="index">
                            <div class="d-flex align-center">
                              <div>
                                <span>
                                  <v-avatar size="30" class="rounded-bg bg-grey">
                                    <v-icon dark>mdi-account</v-icon>
                                  </v-avatar>
                                  {{ comment.user }}
                                </span>
                              </div>
                              <div class="ml-auto">
                                <span style="cursor: pointer;" @click="deleteComment(index)">
                                  <v-icon color="red">mdi-delete</v-icon>
                                </span>
                              </div>
                            </div>
                            <v-list-item-title>
                              <v-card-text>
                                <v-list-item-subtitle>{{ comment.date }}</v-list-item-subtitle>
                                <v-list-item-subtitle>
                                  <v-textarea :rows="2" v-model="comment.text" density="compact" variant="outlined"
                                    readonly>

                                  </v-textarea>
                                </v-list-item-subtitle>
                              </v-card-text>
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </div>
                      <div v-else class="text-center">No Comments Yet</div>
                    </div>
                    <div style="position:sticky; bottom: 0;" class="px-2">
                      <v-text-field v-model="newComment" @keydown.enter="saveComment" variant="outlined"
                        placeholder="Add Comment"></v-text-field>
                    </div>
                  </v-sheet>
                </v-window-item>

                <!-- Photo Window -->
                <v-window-item :value="2"
                  style="position:relative;overflow-y:auto;height: calc(100vh - (48px + 60px));">
                  <v-sheet flat class="d-flex flex-column fill-height">
                    <v-card-title>Photos <span v-if="purchaseOrder.photos">({{ purchaseOrder.photos.length
                        }})</span></v-card-title>
                    <div class="flex-grow-1">
                      <v-list v-if="purchaseOrder.photos">
                        <!-- <v-list-subheader>New Photos ({{ purchaseOrder.photos.length }})</v-list-subheader> -->

                        <template v-for="(photo, index) in purchaseOrder.photos" :key="index">
                          <v-list-item class="d-flex align-items-center">
                            <v-img :src="photo.url" :alt="photo.name" class="mb-2" max-width="200"></v-img>
                            <v-list-item-title>{{ photo.name }}</v-list-item-title>
                            <!-- <v-btn text size="small" color="error" icon="mdi-delete" @click="removeNewPhoto(index)">
                            </v-btn> -->
                          </v-list-item>
                          <v-divider v-if="index + 1 < purchaseOrder.photos.length"></v-divider>
                        </template>
                      </v-list>
                      <div class="text-center" v-else>No Images Found</div>
                    </div>
                    <div style="position:sticky; bottom: 0;" class="px-2">
                      <!-- <WorkOrderCamera @savephoto="SavePhotos"/> -->

                      <!-- <v-btn color="primary" class="mb-1">
                        <v-icon>mdi-plus</v-icon>
                        <span class="ml-2" style="cursor: pointer;" @click="addPhoto">Add Photos</span>
                      </v-btn> -->

                      <input ref="fileInput" type="file" multiple accept="image/*" @change="storeNewPhoto"
                        style="display: none;" />
                    </div>
                  </v-sheet>
                </v-window-item>

                <!-- Document Window -->
                <v-window-item :value="3"
                  style="position:relative;overflow-y:auto;height: calc(100vh - (48px + 60px));">
                  <v-sheet flat class="d-flex flex-column fill-height">
                    <v-card-title>Documents</v-card-title>
                    <div class="flex-grow-1">
                      <v-list v-if="purchaseOrder.documents">
                        <v-list-subheader v-if="purchaseOrder.documents.length > 0">New Documents ({{
                          purchaseOrder.documents.length
                        }})</v-list-subheader>

                        <template v-for="(document, index) in purchaseOrder.documents" :key="index">
                          <v-list-item>
                            <v-list-item-title>
                              <a :href="document.url" target="_blank">{{ document.name }}</a>
                            </v-list-item-title>
                            <template v-slot:append>
                              <v-btn text size="small" color="error" icon="mdi-delete"
                                @click="removeNewDocument(index)">
                              </v-btn>
                            </template>
                          </v-list-item>
                          <v-divider v-if="index + 1 < purchaseOrder.documents.length"></v-divider>
                        </template>
                      </v-list>
                      <div v-else class="text-center">No Documents</div>
                    </div>
                    <div style="position:sticky; bottom: 0;" class="px-2">
                      <v-card-text>
                        <!-- <v-btn color="primary" class="mb-1" @click="addDocument">
                          <v-icon>mdi-plus</v-icon>
                          <span class="ml-2" style="cursor: pointer;">Add Documents</span>
                        </v-btn> -->

                        <input ref="documentfile" type="file" multiple
                          accept="application/pdf, application/msword, application/vnd.ms-excel"
                          @change="storeNewDocument" style="display: none;" />
                      </v-card-text>
                    </div>
                  </v-sheet>
                </v-window-item>
              </v-window>
            </div>
          </v-expand-x-transition>
          <v-sheet id="side-panel">
            <div class="d-flex flex-column">

              <!-- Toggle Show/Hide Side Bar -->
              <v-tooltip :text="showSidePanel ? 'Close Sidebar' : 'Open Sidebar'">
                <template v-slot:activator="{ props }">
                  <v-sheet v-bind="props" @click="toggleButtonPress"
                    class="d-flex justify-center align-center side-button">
                    <v-icon size="x-small">{{ showSidePanel ? 'mdi-arrow-expand-right' :
                      'mdi-arrow-expand-left' }}</v-icon>
                  </v-sheet>
                </template>
              </v-tooltip>

              <!-- Toggle Show Comments -->
              <v-tooltip text="Comments">
                <template v-slot:activator="{ props }">
                  <v-sheet @click="toggleSidePanel(1)" :color="currentStep == 1 ? 'primary' : ''" v-bind="props"
                    class="d-flex justify-center align-center side-button" style="height:50px">
                    <v-icon size="x-small">mdi-message-text</v-icon>
                  </v-sheet>
                </template>
              </v-tooltip>

              <v-tooltip text="Photos">
                <template v-slot:activator="{ props }">
                  <v-sheet @click="toggleSidePanel(2)" :color="currentStep == 2 ? 'primary' : ''" v-bind="props"
                    class="d-flex justify-center align-center side-button" style="height:50px">
                    <v-icon size="x-small">mdi-image</v-icon>
                  </v-sheet>

                </template>
              </v-tooltip>

              <v-tooltip text="Documents">
                <template v-slot:activator="{ props }">
                  <v-sheet @click="toggleSidePanel(3)" :color="currentStep == 3 ? 'primary' : ''" v-bind="props"
                    class="d-flex justify-center align-center side-button" style="height:50px">
                    <v-icon size="x-small">mdi-file</v-icon>
                  </v-sheet>
                </template>
              </v-tooltip>

            </div>
          </v-sheet>

        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Close</v-btn>
        <!-- subjected to changes for update PurchaseOrderReport.vue-->
        <PurchaseOrderReport :purchase-order="purchaseOrder" ref="reportComponentRef" />
        <v-btn color="primary" @click="triggerReport">Generate Report </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { PurchaseOrder } from '@/types/maintenance/purchaseOrderTypes';
import PurchaseOrderReport from './components/PurchaseOrderReport.vue';

const props = defineProps({
  modelValue: Boolean,
  purchaseOrder: {
    type: Object as any,
    required: true,
  },
});

const authStore = useAuthStore()

// subjected to changes 
const dialog = ref(false);
const reportComponentRef = ref(null);

const emit = defineEmits(['update:modelValue']);
const close = () => {
  emit('update:modelValue', false);
};

const triggerReport = () => {
  console.log('Purchase orders', props.purchaseOrder)
  console.log('modelvalue orders', props.modelValue)
  if (reportComponentRef.value) {
    reportComponentRef.value.generateReport();
  }


}
// end of changes 

// const emit = defineEmits(['update:modelValue', 'close']);

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const partLocationStore = usePartLocationStore()
const { partLocations } = storeToRefs(partLocationStore)

const suppliersStore = useSuppliersStore();
const suppliers = computed(() => suppliersStore.suppliers);

const techniciansStore = useTechniciansStore();
const { technicians } = storeToRefs(techniciansStore);

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies } = storeToRefs(partsAndSuppliesStore)

const getLocationName = (locationId: number) => {
  return partLocations.value?.find(location => location.id == locationId)?.name
}

const getVendorName = (vendorId: number) => {
  return suppliers.value?.find(vendor => vendor.id == vendorId)?.name
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'closed':
      return 'cyan';
    case 'draft':
      return 'grey';
    case 'approved':
      return 'primary';
    case 'rejected':
      return 'pink';
    case 'received, partial':
      return 'orange';
    case 'rejected, full':
      return 'brown';
    case 'pending, approval':
      return 'yellow';
    case 'purchased':
      return 'secondary';
    default:
      return 'gray'
  }
}

const showSidePanel = ref(false)
const currentStep = ref(0)
const lastStep = ref(0)

const localPurchaseOrder = ref(JSON.parse(JSON.stringify(props.purchaseOrder)))

const toggleButtonPress = () => {
  if (!showSidePanel) {
    currentStep.value = lastStep.value == 0 ? 1 : lastStep.value

  } else {
    lastStep.value = currentStep.value
    currentStep.value = 0
  }
  showSidePanel.value = !showSidePanel.value;
}

const toggleSidePanel = (stepVal: number) => {
  if (currentStep.value == stepVal && showSidePanel.value) {

    lastStep.value = stepVal
    currentStep.value = 0
    showSidePanel.value = false
  } else {
    if (currentStep.value = 0) {
      lastStep.value = stepVal
    }
    lastStep.value = currentStep.value
    currentStep.value = stepVal
    showSidePanel.value = true
  }
}

const auth = useAuthStore()

const comments = ref<{ id: number; text: string; date: string; user: string }[]>([]);
const newComment = ref('');

const saveComment = () => {
  if (newComment.value.trim() !== '') {
    comments.value.push({ id: comments.value.length + 1, text: newComment.value, date: new Date().toLocaleString(), user: (auth.user?.name as string) });
    localPurchaseOrder.value.comments = comments.value
    newComment.value = '';
  }
};

const deleteComment = (index: number) => {
  props.purchaseOrder.comments?.splice(index, 1);
};

const purchaseOrderStore = usePurchaseOrderStore();

const saveFIle = async (purchaseOrderId: number) => {
  await purchaseOrderStore.updatePurchaseOrder({
    id: purchaseOrderId,
    photos: props.purchaseOrder.photos,
    documents: props.purchaseOrder.documents,
    comments: props.purchaseOrder.comments
  } as any);
  emit('update:modelValue', false);
};

const newPhotos = ref<{ name: string; url: string }[]>([]);

function SavePhotos(photo: { name: string, url: string }) {
  newPhotos.value.push(photo);
  props.purchaseOrder.photos = newPhotos.value
}

const fileInput = ref<HTMLInputElement | null>(null);

function addPhoto() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function storeNewPhoto(event: any) {
  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    newPhotos.value.push(files[i])
  }

  event.target.value = null;
}

function removePhoto(index: any) {
  props.purchaseOrder.photos?.splice(index, 1);
}

function removeNewPhoto(index: number) {
  props.purchaseOrder.photos?.splice(index, 1);
}

const documentfile = ref<HTMLInputElement | null>(null);
const newDocuments = ref<{ name: string, url: string }[]>([]);

function addDocument() {
  documentfile.value?.click();
}

function removeNewDocument(index: number) {
  props.purchaseOrder.documents?.splice(index, 1);
}

function storeNewDocument(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newDocuments.value.push({ name: file.name, url: url });
      props.purchaseOrder.documents = newDocuments.value
    }
    (event.target as HTMLInputElement).value = '';
  }
}

const getPartNumber = (partId: number) => {
  return partSupplies.value?.find(part => part.id == partId)?.part_number
}
</script>

<style scoped>
.custom-timeline :deep(.v-timeline--item__body) {
  width: 100%;
}

.side-button {
  height: 50px;
  cursor: pointer;
}

.side-button:hover {
  background-color: #eeeeee;
}

#side-panel {
  height: 100%;
  width: 50px;
  border-left: 1px solid grey;
}
</style>