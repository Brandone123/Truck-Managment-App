<template>
  <div class="mt-n4">
    <div
      class="d-flex justify-space-between mb-3 pb-1 mx-n5 px-5 pt-4 grey-background"
      style="position: sticky; top: 48px; z-index: 1"
    >
      <span class="text-primary text-h6">Work Orders</span>
      <!-- <WorkOrderPdf /> -->
      <div>
        <v-menu location="start">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="outlined"
              color="primary"
              class="mr-3"
            >
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-list density="compact">
            <v-list-item @click="openImportDialog">
              <template v-slot:append>
                <v-icon>mdi-cloud-upload-outline</v-icon>
              </template>
              <v-list-item-title> Import </v-list-item-title>
            </v-list-item>
            <v-list-item disabled>
              <template v-slot:append>
                <v-icon>mdi-cloud-download-outline</v-icon>
              </template>
              <v-list-item-title> Export </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn color="primary" @click="openCreateWorkOrderDialog"
          >Create Work Order</v-btn
        >
      </div>
    </div>

    <WorkOrderDetailsDialog
      :modelValue="workOrderDetailsDialog"
      :workOrder="selectedWorkOrder"
      @update:modelValue="workOrderDetailsDialog = $event"
      @close="closeWorkOrderDetailsDialog"
    />

    <WorkOrderEditDialog
      :modelValue="workOrderEditDialog"
      :workOrder="selectedWorkOrder"
      :vehicleId="(selectedWorkOrder.vehicle_id as number)"
      @update:modelValue="workOrderEditDialog = $event"
      @close="closeWorkOrderEditDialog"
      @save="saveWorkOrder"
    />

    <WorkOrderUpload
      :modelValue="importDialog"
      @update:modelValue="importDialog = $event"
    />

    <v-row class="mt-5">
      <v-col cols="12" md="3">
        <v-card class="card-1 text-center">
          <!-- <v-card-text> -->
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#CE0053"
              >mdi-file-document-outline</v-icon
            >
            <span>Work Orders</span>
          </v-card-title>
          <v-card-text>
            <span class="font-weight-bold text-h6">
              {{ workOrderSummary.total }}</span
            >
            <!-- <div>
                <span>Total Work Orders</span>
              </div>
            </v-card-text> -->
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-2 text-center">
          <!-- <v-card-text> -->
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#1867C0"
              >mdi-check-circle-outline</v-icon
            >
            <span>Open Work</span>
          </v-card-title>
          <v-card-text>
            <span class="font-weight-bold text-h6">{{
              workOrderSummary.open
            }}</span>
            <!-- <div>
                <span>Open Work Orders</span>
              </div>
            </v-card-text> -->
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-3 text-center">
          <!-- <v-card-text> -->
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#424656"
              >mdi-check-circle-outline</v-icon
            >
            <span>Completed</span>
          </v-card-title>
          <v-card-text>
            <span class="font-weight-bold text-h6">
              {{ workOrderSummary.completed }}</span
            >
            <!-- <div>
                <span>Completed Work Orders</span>
              </div>
            </v-card-text> -->
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="card-4 text-center">
          <!-- <v-card-text> -->
          <v-card-title class="justify-space-between">
            <v-icon class="mr-2" color="#a4d0ee">mdi-progress-clock</v-icon>
            <span>In-Progress</span>
          </v-card-title>
          <v-card-text>
            <span class="font-weight-bold text-h6">{{
              workOrderSummary.inProgress
            }}</span>
            <!-- <div>
                <span>In-Progress Work Orders</span>
              </div>
            </v-card-text> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <WorkOrdersList
          :workOrders="workOrders"
          :loading="loading"
          @view="viewWorkOrder"
          @edit="editWorkOrder"
          @delete="deleteWorkOrder"
          @export="exportWorkOrders"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useWorkOrderStore } from "@/stores/maintenance/workOrder";
import { storeToRefs } from "pinia";
import WorkOrderDetailsDialog from "@/components/maintenance/management/workOrder/WorkOrderDetailsDialog.vue";
import WorkOrderEditDialog from "@/components/maintenance/management/workOrder/WorkOrderEditDialog.vue";
import WorkOrdersList from "@/components/maintenance/management/workOrder/WorkOrdersList.vue";
import WorkOrderUpload from "@/components/maintenance/management/workOrder/WorkOrderUpload.vue"; // Import the WorkOrderUpload component
import type { WorkOrder } from "~/types/maintenance/workOrder";
import { useScrollDirection } from "@/composables/useScrollDirection";
import { usePartLocationStore } from "#imports";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();

const { scrollDirection } = useScrollDirection();
const layoutStore = useLayoutStore();

const workOrderStore = useWorkOrderStore();
const { workOrders, loading, workOrderSummary } = storeToRefs(workOrderStore);

const partsAndSuppliesStore = usePartsAndSuppliesStore();

const employeeStore = useEmployeeStore();

const issueStore = useIssueStore();
const assetStore = useAssetStore();
const serviceTaskStore = useServiceTaskStore();
const partLocationStore = usePartLocationStore();

const workOrderDetailsDialog = ref(false);
const workOrderEditDialog = ref(false);
const importDialog = ref(false); // Add importDialog ref
const selectedWorkOrder = ref<Partial<WorkOrder>>({
  status: "open",
  discount_type: "percentage",
  discount_amount: 0,
  tax_type: "percentage",
  tax_amount: 0,
  warranty_credits_type: "percentage",
  warranty_credits_amount: 0,
  line_items: [],
  photos: [],
  documents: [],
  total_cost: 0,
  discount: 0,
  tax: 0,
  subtotal: 0,
  parts_subtotal: 0,
  labor_subtotal: 0,
} as Partial<WorkOrder>);

const openCreateWorkOrderDialog = () => {
  selectedWorkOrder.value = {
    status: "open",
    discount_type: "percentage",
    discount_amount: 0,
    tax_type: "percentage",
    tax_amount: 0,
    warranty_credits_type: "percentage",
    warranty_credits_amount: 0,
    line_items: [],
    photos: [],
    documents: [],
    total_cost: 0,
    discount: 0,
    tax: 0,
    subtotal: 0,
    parts_subtotal: 0,
    labor_subtotal: 0,
  } as Partial<WorkOrder>;
  workOrderEditDialog.value = true;
};

const openImportDialog = () => {
  importDialog.value = true; // Open the import dialog
};

const viewWorkOrder = (workOrder: any) => {
  selectedWorkOrder.value = workOrder;
  workOrderDetailsDialog.value = true;
};

const editWorkOrder = (workOrder: any) => {
  selectedWorkOrder.value = workOrder;
  workOrderEditDialog.value = true;
};

const deleteWorkOrder = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(
    "Proceed to delete work order ?"
  );

  if (confirm) {
    await workOrderStore.deleteWorkOrder(id);
  }
};

const closeWorkOrderDetailsDialog = () => {
  workOrderDetailsDialog.value = false;
};

const closeWorkOrderEditDialog = () => {
  workOrderEditDialog.value = false;
};

const saveWorkOrder = async (workOrder: any) => {
  if (workOrder.id) {
    await workOrderStore.updateWorkOrder(workOrder);
  } else {
    await workOrderStore.createWorkOrder(workOrder);
  }
  workOrderEditDialog.value = false;
};

const exportWorkOrders = () => {
  workOrderStore.exportWorkOrders();
};

// workOrderStore.fetchWorkOrders();
// workOrderStore.fetchNotifications();

onMounted(() => {
  switch (route.query.action) {
    case "createWorkOrder":
      console.log(route.query.vehicleName);
      if (selectedWorkOrder.value) {
        selectedWorkOrder.value = {
          vehicle_id: route.query.vehicleName as any,
          schedule_date: route.query.reported_date as string,
          status: route.query.status as string,
        };
      }
      workOrderEditDialog.value = true;
      break;
    default:
      break;
  }
});

onMounted(() => {
  assetStore.fetchAssets();
  employeeStore.fetchEmployeeList();
  issueStore.fetchIssues();
  serviceTaskStore.fetchServiceTasks();
  partLocationStore.fetchPartLocations();
  partsAndSuppliesStore.fetchPartSupplies();
  workOrderStore.fetchWorkOrders();
});
</script>

<style scoped>
.card-1 {
  border-left: 8px solid #ce0053;
}

.card-2 {
  border-left: 8px solid #1867c0;
}

.card-3 {
  border-left: 8px solid #424656;
}

.card-4 {
  border-left: 8px solid #a4d0ee;
}
</style>
