<template>
  <div>
    <ServiceEntryEditDialog v-model="serviceEntryDialog" :serviceEntry="serviceEntry" @save="saveServiceEntry">
      <!-- <template v-slot:prepend>
      </template> -->
    </ServiceEntryEditDialog>


    <v-dialog v-model="dialog" max-width="800px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>Add To Service History</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-form ref="serviceReminderResolveForm">
            <v-col cols="12">
              <v-card-text class="justify-start align-start">
                <v-row>
                  <v-col cols="4">Vehicle</v-col>
                  <v-col cols="8">
                    <SharedTableDynamicVehicleItem :vehicle="serviceReminder.vehicle" />
                  </v-col>
                </v-row>
                <v-divider class="my-2"></v-divider>
                <v-row class="my-5">
                  <v-col cols="4">Service Reminder</v-col>
                  <v-col cols="8">
                    <v-card flat class="border pa-1" style="max-height: 200px; overflow-y: auto;">
                      <div style="position:sticky;top:0;z-index:1;">
                        <v-chip density="comfortable" class="bg-grey mr-2">1</v-chip>
                        <span>Service Entry Will be Added</span>
                        <v-divider class="my-2"></v-divider>
                      </div>
                      <v-row class="align-center">
                        <!-- <v-col cols="1">
                          <v-checkbox color="primary" hide-details></v-checkbox>
                        </v-col> -->
                        <v-col>
                          <div>
                            <span class="text-secondary font-weight-bold" style="display: block">{{
                              serviceReminder?.service_task
                                ? serviceReminder?.service_task.name
                                : "---"
                            }}</span>
                            <span style="display: block">
                              Every {{ serviceReminder?.time_interval }}
                              {{
                                serviceReminder?.time_due_soon_threshhold_duration
                              }}</span>
                            <span v-if="serviceReminder?.time_due_soon_threshhold" color="orange"
                              style="display: block; color: orange">
                              Due Soon threshold:
                              <span style="border-bottom: 1px dotted">
                                {{
                                  `${serviceReminder?.time_due_soon_threshhold}
                                ${serviceReminder?.time_due_soon_threshhold_duration}`
                                }}
                              </span>
                            </span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
                <v-divider class="my-2"></v-divider>
                <v-row class="my-5">
                  <v-col cols="4">Service Entry</v-col>
                  <v-col cols="8">
                    <v-radio-group v-model="serviceReminderType">
                      <v-radio color="secondary" label="Add to New Service Entry" value="new"></v-radio>
                      <v-radio color="secondary" label="Add to Existing Service Entry" value="existing"></v-radio>
                    </v-radio-group>
                    <SharedInputServiceHistoryAutoCompleteInput v-if="serviceReminderType == 'existing'"
                      variant="outlined" density="comfortable" :vehicleId="props.serviceReminder.vehicle_id"
                      label="Please Select" v-model="localReminderSchedule.service_history_id"
                      :rules="[validation.required]" />
                  </v-col>
                </v-row>
                <!-- <v-row>
                <v-col>Select Service History</v-col>
                <v-col>
 
                </v-col>
              </v-row> -->
              </v-card-text>
            </v-col>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="saveReminder">Continue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import type { PropType } from "vue";
import type { ServiceReminder, ServiceReminderSchedule } from "@/types/maintenance/serviceReminders";
import { useValidation } from "~/composables/formValidation";
import ServiceEntryEditDialog from "~/components/maintenance/management/history/ServiceEntryEditDialog.vue";
import type { ServiceHistory } from "~/types/maintenance/serviceHistory";
import { useRouter } from "vue-router";

const validation = useValidation();

const props = defineProps({
  modelValue: Boolean,
  serviceReminder: {
    type: Object as PropType<Partial<ServiceReminder>>,
    default: {} as PropType<Partial<ServiceReminder>>,
    required: true,
  },
});

const router = useRouter();

const emit = defineEmits([
  "update:modelValue",
  "save",
]);

const serviceEntryDialog = ref<boolean>(false);
const serviceEntry = ref<Partial<ServiceHistory>>({ vehicle_id: props.serviceReminder.vehicle_id })

const serviceReminderType = ref<string>('existing');

const serviceReminderResolveForm = ref<HTMLFormElement | null>(null);

const serviceEntryItem = ref({
  newServiceEntryCheckbox: false,
  existingServiceEntryCheckbox: false,
  selectedEntryOption: null,
});

const serviceHistoryStore = useServiceHistoryStore();
const { serviceEntries } = storeToRefs(serviceHistoryStore);

const localReminderSchedule = ref<Partial<ServiceReminderSchedule>>({});

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

watch(
  () => dialog.value, (newVal) => {
    if (newVal) {
      localReminderSchedule.value = JSON.parse(JSON.stringify(props.serviceReminder?.next_due_schedule ?? {}));
      serviceEntry.value.vehicle_id = props.serviceReminder?.vehicle_id
    } else {
      localReminderSchedule.value = {}
      serviceEntry.value = {}
    }
  }
);

const saveReminder = async () => {
  const formStatus = await serviceReminderResolveForm.value?.validate();

  if (!formStatus.valid) {
    return;
  }

  if (serviceReminderType.value == 'new') {
    localReminderSchedule.value.service_history_id = undefined
    serviceEntryDialog.value = true
  }
  else {
    let payload = JSON.parse(JSON.stringify(localReminderSchedule.value))
    payload.service_history = undefined;
    emit("save", payload);
    dialog.value = false
  }
};

const saveServiceEntry = async (serviceEntry: any) => {
  let payload = {
    ...localReminderSchedule.value,
    service_history: serviceEntry
  }

  emit("save", payload);
  dialog.value = false
}

</script>

<style scoped></style>
