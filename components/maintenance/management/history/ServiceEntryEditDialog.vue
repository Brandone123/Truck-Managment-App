<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <slot name="prepend"></slot>
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
                          <SharedInputVehicleAutoCompleteInput variant="outlined" flat density="compact"
                            v-model="localServiceEntry.vehicle_id" label="Vehicle*" :rules="[validation.required]"
                            @selection="onVehicleSelection" />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <SharedInputPartSuppliersAutoCompleteInput variant="outlined" flat density="compact"
                            v-model="localServiceEntry.vendor_id" label="Vendor" />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localServiceEntry.reference"
                            label="Reference" required></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                          <v-autocomplete v-model="localServiceEntry.labels" :items="['New', 'in Service']"
                            color="blue-grey-lighten-2" item-title="name" item-value="name" label="Labels" chips
                            multiple variant="outlined" flat density="compact">
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" type="number" flat density="compact"
                            v-model.number="localServiceEntry.odometer" label="Odometer (mi)"
                            :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" v-model="localServiceEntry.status"
                            :items="statuses" label="Status"></v-select>
                        </v-col>
                         <v-col cols="12">
                            <SharedInputEmployeeAutoCompleteInput :fetchData="false" variant="outlined" flat
                              density="compact" label="Add Watchers" :disabled="isUpdating"
                              v-model="localServiceEntry.watcher_ids" multiple />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-text>
                      <v-row class="mt-4">
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" v-model="localServiceEntry.priority"
                            :items="['Schedule', 'Non-Schedule', 'Emergency']" label="Priority"
                            :rules="[validation.required]"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact"
                            v-model="localServiceEntry.completed_at" label="Completion Date" type="date"
                            :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact"
                            v-model="localServiceEntry.actual_start_date" label="Start Date" type="date"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact"
                            v-model="localServiceEntry.actual_completion_date" label="Actual Completion Date"
                            type="date" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea variant="outlined" flat density="compact" v-model="localServiceEntry.description"
                            label="Description" required></v-textarea>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <ServiceHistoryIssueList v-model:issueIds="localServiceEntry.issue_ids"
                :vehicleName="(getVehicleName as any)" :serviceHistoryId="localServiceEntry.id || -1" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveServiceEntry">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import type { PropType } from 'vue';
import type { ServiceHistory } from '@/types/maintenance/serviceHistory';
import { useValidation } from '~/composables/formValidation';
import type { Issues } from '@/types/maintenance/issue';
import ServiceHistoryIssueList from './ServiceHistoryIssueList.vue'

const props = defineProps({
  modelValue: Boolean,
  serviceEntry: {
    type: Object as PropType<Partial<ServiceHistory>>,
    required: true,
  },
});
const issueStore = useIssueStore()

const vehicleName = ref<string | null>(null);

const getVehicleName = computed(() => vehicleName.value)


const validation = useValidation();
const emit = defineEmits(['update:model-value', 'close', 'save']);
const step = ref(1);
const serviceEntryForm = ref<HTMLFormElement | null>(null)
const isUpdating = ref(false)

const firstLoad = ref<boolean>(true);

const getServiceHistoryData = (serviceHistory: Partial<ServiceHistory>) => {
  let newData = JSON.parse(JSON.stringify(serviceHistory)) || {}
  newData.issue_ids = newData.issues?.map((item: any) => item.id) || []
  return newData
}

const localServiceEntry = ref<Partial<ServiceHistory>>(getServiceHistoryData(props.serviceEntry || {}));

const { modelValue, serviceEntry } = toRefs(props);

watch([modelValue, serviceEntry], ([newModelValue, newServiceEntry]) => {
  if (newModelValue === false) {
    resetForm();
  }

  if (newServiceEntry) {
    localServiceEntry.value = { ...newServiceEntry };
  }


  if (props.serviceEntry.vehicle) {
    onVehicleSelection(props.serviceEntry.vehicle)
  }

  if (props.serviceEntry.issues) {
    localServiceEntry.value.issue_ids = localServiceEntry.value?.issues?.map(item => item.id as number) || []
  }
})

const onVehicleSelection = (vehicle: any) => {
  vehicleName.value = vehicle.name
  issueStore.reset()

  // prevent updating odometer when editing and edit dialog is opened
  if (firstLoad.value && localServiceEntry.value.id) {
    firstLoad.value = false;
    return
  }

  localServiceEntry.value.odometer = vehicle.odometer?.meter_value
}

const resetForm = () => {
  localServiceEntry.value = {} as Partial<ServiceHistory>
  issueStore.reset()
  firstLoad.value = true
}
const isServiceReminder = Object.keys(localServiceEntry.value).includes('service_program')
const title = computed(() => (localServiceEntry.value.id ? isServiceReminder ? 'Resolve Service Reminder' : 'Edit Service Entry' : 'Create Service Entry'));

const vendors = ['Local Garage', 'Tire Shop']; // Replace with actual vendor data
const statuses = ['Pending', 'In Progress', 'Completed'];

const validateForm1 = async () => {
  let formStatus = await serviceEntryForm.value?.validate()
  return formStatus.valid ? true : false
}

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
  emit('save', localServiceEntry.value);
  emit('update:model-value', false);
  emit('close');
};

// reset selected issues when vehicle id changes
watch(() => localServiceEntry.value.vehicle_id, (newVal) => {
  if (newVal != props.serviceEntry.vehicle_id) {
    localServiceEntry.value.issue_ids = []
  } else {
    localServiceEntry.value.issue_ids = (localServiceEntry.value?.issues || []).map(item => item.id as number) || []
  }
})

</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>