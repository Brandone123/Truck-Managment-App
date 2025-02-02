<template>
  <div>
    <v-dialog v-model="dialog" fullscreen scrollable density="compact">
      <v-card class="grey-background">
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="workOrderForm">
            <v-row class="mt-1">
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12">
                    <v-card>
                      <v-card-title class="font-weight-bold">Details</v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <SharedInputVehicleAutoCompleteInput variant="outlined" flat density="compact"
                              v-model="localWorkOrder.vehicle_id" label="Select Vehicle" :rules="[validation.required]"
                              @selection="onVehicleSelection" />
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-select variant="outlined" flat density="compact" v-model="localWorkOrder.status"
                              :items="statuses" label="Status" item-value="value" item-title="title"
                              :rules="[validation.required]"></v-select>
                          </v-col>
                          <v-col cols="12">
                            <v-select variant="outlined" flat density="compact" v-model="localWorkOrder.priority"
                              :items="repairPriorityClasses" item-value="value" item-title="title"
                              label="Repair Priority Class" :rules="[validation.required]"
                              hint="Repair Priority Class (VMRS Code Key 16) is a simple way to classify whether a service or repair was scheduled, non-scheduled, or an emergency."
                              persistent-hint></v-select>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" flat density="compact"
                              v-model="localWorkOrder.schedule_date" label="Expected Start Date"
                              type="datetime-local"></v-text-field>
                          </v-col>

                          <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" flat density="compact"
                              v-model="localWorkOrder.actual_start_date" label="Actual Start Date"
                              type="datetime-local"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" flat density="compact"
                              v-model="localWorkOrder.expected_completion_date" label="Expected Completion Date"
                              type="datetime-local"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field variant="outlined" flat density="compact"
                              v-model="localWorkOrder.actual_completion_date" label="Actual Completion Date"
                              type="datetime-local"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <SharedInputTechnicianNameAutoCompleteInput variant="outlined" flat density="compact"
                              label="Assigned To*" v-model="localWorkOrder.assigned_to" />
                          </v-col>
                          <v-col cols="12" sm="6">
                            <SharedInputPartSuppliersAutoCompleteInput variant="outlined" flat density="compact"
                              v-model="localWorkOrder.vendor" label="Vendor" />
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-text-field variant="outlined" flat density="compact"
                              v-model="localWorkOrder.invoice_number" label="Invoice Number"
                              type="number"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-text-field variant="outlined" flat density="compact" v-model="localWorkOrder.po_number"
                              label="PO Number" type="number"></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <v-text-field variant="outlined" flat density="compact" v-model="localWorkOrder.odometer"
                              label="Odometer" type="number" :rules="[validation.required]"></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="6">
                <v-card>
                  <v-card-title class="font-weight-bold">Custom Fields</v-card-title>
                  <v-card-text>
                    <v-row>

                      <v-col cols="12" sm="6">
                        <v-text-field variant="outlined" flat density="compact"
                          v-model="localWorkOrderCustomField.tire_dot_number" label="Tire Dot Number"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field variant="outlined" flat density="compact"
                          v-model="localWorkOrderCustomField.truck_number" label="Truck Number"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field variant="outlined" flat density="compact"
                          v-model="localWorkOrderCustomField.trailer_number" label="Trailer Number"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select :items="['Yes', 'No']" variant="outlined" flat density="compact"
                          v-model="localWorkOrderCustomField.charge_back" label="Charge Back ?*"
                          :rules="[validation.required]"></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select :items="['Yes', 'No']" variant="outlined" flat density="compact"
                          v-model="localWorkOrderCustomField.charge_back_issued"
                          label="Charge Back Issued ?"></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field variant="outlined" flat density="compact"
                          v-model="localWorkOrderCustomField.charge_back_to" label="Charge Back To"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field variant="outlined" flat density="compact"
                          v-model="localWorkOrderCustomField.roadcall" label="Road Call ?"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select :items="['Yes', 'No']" variant="outlined" flat density="compact"
                          v-model="localWorkOrderCustomField.afterhours_call" label="After Hours Call ?*"
                          :rules="[validation.required]"></v-select>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12">
                <WorkOrderIssueList v-model:issueIds="localWorkOrder.issue_ids" :vehicleName="(getVehicleName as any)"
                  :workOrderId="localWorkOrder.id || -1" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="dialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="saveWorkOrder">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import type { PropType } from 'vue';
import { useValidation } from '~/composables/formValidation';
import type { WorkOrder, CustomField } from '@/types/maintenance/workOrder';

import { useRouter } from 'vue-router';
import type { Issues } from '@/types/maintenance/issue';
import WorkOrderIssueList from './WorkOrderIssueList.vue'

const router = useRouter();
const issueStore = useIssueStore();

const props = defineProps({
  modelValue: Boolean,
  workOrder: {
    type: Object as PropType<Partial<WorkOrder>>,
    required: true,
  },
  vehicleId: {
    type: Number,
    required: false,
  },
});

const issueEditDialog = ref(false);

const selectedIssue = ref<Partial<Issues>>({} as Partial<Issues>);

const vehicleName = ref<string | null>(null);

const firstLoad = ref<boolean>(true);


const getVehicleName = computed(() => vehicleName.value)

const statuses = computed(() => {
  let payload = [
    { title: 'Open', value: 'open' },
    { title: 'In Progress', value: 'in progress' },
    { title: 'Completed', value: 'completed' },
    { title: 'Draft', value: 'draft' }
  ]
  return payload
});

const repairPriorityClasses = [
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'Non-Scheduled', value: 'non-sheduled' },
  { title: 'Emergency', value: 'emergency' }
]

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const getWorkOrderData = (workOrder: Partial<WorkOrder>) => {
  let newData = JSON.parse(JSON.stringify(workOrder || {})) || {}
  newData.issue_ids = newData.issues?.map((item: any) => item.id) || []
  return newData
}

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const workOrderForm = ref<HTMLFormElement | null>(null)
const validation = useValidation();

const localWorkOrder = ref<Partial<WorkOrder>>(getWorkOrderData(props.workOrder));

const localWorkOrderCustomField = ref<Partial<CustomField>>(JSON.parse(JSON.stringify(props.workOrder.custom_fields || {})));

const isServiceReminder = Object.keys(localWorkOrder.value).includes('service_program')
const title = computed(() => (localWorkOrder.value.id ? isServiceReminder ? " Resolve Service Program" : 'Edit Work Order' : 'Create Work Order'));

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    resetForm();
  }

  else {
    localWorkOrder.value = getWorkOrderData(props.workOrder)
    localWorkOrderCustomField.value = localWorkOrder.value.custom_fields as Partial<CustomField> || {}

    if (router.currentRoute.value.path === '/maintenance/IssuesManagement') {
      localWorkOrder.value.vehicle_id = props.vehicleId
    }

    if (props.workOrder.vehicle) {
      onVehicleSelection(props.workOrder.vehicle)
    }

    if (props.workOrder.issues) {
      localWorkOrder.value.issue_ids = localWorkOrder.value?.issues?.map(item => item.id as number) || []
    }
  }
})

const onVehicleSelection = (vehicle: any) => {
  vehicleName.value = vehicle.name
  issueStore.reset()

  // prevent updating odometer when editing and edit dialog is opened
  if (firstLoad.value && localWorkOrder.value.id) {
    firstLoad.value = false;
    return
  }

  localWorkOrder.value.odometer = vehicle.odometer?.meter_value
}

// reset selected issues when vehicle id changes
watch(() => localWorkOrder.value.vehicle_id, (newVal) => {
  if (newVal != props.workOrder.vehicle_id) {
    localWorkOrder.value.issue_ids = []
  } else {
    localWorkOrder.value.issue_ids = localWorkOrder.value?.issues?.map(item => item.id as number) || []
  }
})

const resetForm = () => {
  nextTick(() => {
    localWorkOrder.value = {} as Partial<WorkOrder>
    vehicleName.value = null
    firstLoad.value = true
  })
}

const saveWorkOrder = async () => {
  let formStatus = await workOrderForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  let payload = JSON.parse(JSON.stringify({ ...localWorkOrder.value, custom_fields: localWorkOrderCustomField.value }))

  emit('save', payload);
  dialog.value = false
};
</script>

<style scoped></style>