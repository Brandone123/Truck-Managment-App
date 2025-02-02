<template>
  <v-row>
    <v-col :cols="showSidePanel ? 12 : 6">
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
            <v-col cols="12" md="6">{{ purchaseOrder.location?.name }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Vendor</v-col>
            <v-col cols="12" md="6">
              <div class="text-secondary">
                <v-icon>mdi-store</v-icon>
                <span style="border-bottom: 1px dotted">
                  {{ purchaseOrder.vendor?.name }}
                </span>
              </div>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Created by</v-col>
            <v-col cols="12" md="6">
              <SharedTableDynamicTechnicianItem v-if="purchaseOrder.created_by"
                :technician="purchaseOrder.created_by_user" />
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
            <v-col cols="12" md="6">{{ purchaseOrder.custom_fields && purchaseOrder.custom_fields.special_ordered_part ?
              "Yes" : "No"
              }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">For Location</v-col>
            <v-col cols="12" md="6">{{ purchaseOrder.custom_fields && purchaseOrder.custom_fields.for_location || "N/A"
              }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">INVOICE #</v-col>
            <v-col cols="12" md="6">{{ purchaseOrder.custom_fields && purchaseOrder.custom_fields.invoice_number ||
              "N/A"
              }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Watchers</v-col>
            <v-col cols="12" md="6">
              <template v-for="(watcher, index) in (purchaseOrder.watching_employees || [])" :key="index">
                <SharedTableDynamicTechnicianItem v-if="watcher" :technician="watcher" />
              </template>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="showSidePanel ? 12 : 6">
      <v-card>
        <v-card-title class="font-weight-bold text-primary">Purchase Summary</v-card-title>
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
              <td>{{ part.part_number }}</td>
              <td>{{ part.purchase_details.quantity_ordered }}</td>
              <td>{{ part.purchase_details.quantity_received }}</td>
              <td>{{ formatCurrency(part.purchase_details.unit_cost) }} </td>
              <td>{{ formatCurrency(part.purchase_details.subtotal) }}</td>
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
                <td><strong>Discount({{ purchaseOrder.discount_type == 'percentage' ? purchaseOrder.discount_amount +
                  '%' : 'Fixed'
                    }})</strong></td>
                <td><strong>-${{ purchaseOrder.discount || '0.00' }}</strong></td>
              </tr>
              <tr class="text-h7">
                <td><strong>Tax({{ purchaseOrder.tax_type == 'percentage' ? purchaseOrder.tax_amount + '%' :
                  'Fixed'
                    }})</strong></td>
                <td><strong>+${{ purchaseOrder.tax || '0.00' }}</strong></td>
              </tr>
              <tr class="text-h7">
                <td><strong>Shipping({{ purchaseOrder.shipping_type == 'percentage' ? purchaseOrder.shipping_amount +
                  '%' : 'Fixed'
                    }})</strong></td>
                <td><strong>-${{ purchaseOrder.shipping || '0.00' }}</strong></td>
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
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { formatCurrency } from '~/composables/currencyUtils'


const props = defineProps({
  modelValue: Boolean,
  purchaseOrder: {
    type: Object as any,
    required: true,
  },
  showSidePanel: {
    type: Boolean,
    required: false,
    default: false
  }
});


const emit = defineEmits(['update:modelValue']);

const partLocationStore = usePartLocationStore()
const { partLocations } = storeToRefs(partLocationStore)

const suppliersStore = useSuppliersStore();
const suppliers = computed(() => suppliersStore.suppliers);

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