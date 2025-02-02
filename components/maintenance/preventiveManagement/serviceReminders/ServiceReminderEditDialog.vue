<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="reminderForm">
          <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="12">
                  <!-- <v-card-title class="font-weight-bold">Details</v-card-title> -->
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
                        <SharedInputVehicleAutoCompleteInput variant="outlined" flat density="compact"
                          v-model="localReminder.vehicle_id" label="Select Vehicle" :rules="[validation.required]" />
                      </v-col>
                      <v-col cols="12" md="6" v-if="!serviceReminder.id">
                        <v-text-field variant="outlined" flat density="compact" v-model="localReminder.last_service_date"
                          label="Last Service Date" type="date" :rules="[validation.required]">
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" md="6" v-if="!serviceReminder.id">
                        <v-text-field  variant="outlined" flat density="compact" v-model.number="localReminder.last_service_mileage"
                          label="Last Service Mileage" type="number" :min="0" :rules="[validation.required]">
                          <template v-slot:append-inner>
                            <span>mi</span>
                          </template>
                        </v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <SharedInputServiceTaskAutoCompleteInput variant="outlined" :rules="[validation.required]" flat
                          v-model="localReminder.service_task_id" label="Service Tasks*" />
                      </v-col>
                      <v-col cols="12" md="6">
                        <p class="mb-3">Time Interval*</p>
                        <v-row>
                          <v-col cols="8" class="pr-0">
                            <v-text-field :rules="[validation.required]" type="number" variant="outlined"
                              density="compact" v-model="localReminder.time_interval">
                              <template v-slot:prepend-inner>
                                <span class="text-caption">Every</span>
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="4" class="pl-1">
                            <v-select :rules="[validation.required]" variant="outlined" density="compact"
                              v-model="localReminder.time_interval_duration" :items="timeDuration" item-title="label"
                              item-value="value"></v-select>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" md="6">
                        <p class="mb-3">Time Due Soon Threshold*</p>
                        <v-row>
                          <v-col cols="8" class="pr-0">
                            <v-text-field :rules="[validation.required]" type="number" variant="outlined"
                              density="compact" v-model="localReminder.time_due_soon_threshhold">
                            </v-text-field>
                          </v-col>
                          <v-col cols="4" class="pl-1">
                            <v-select :rules="[validation.required]" variant="outlined" density="compact"
                              v-model="localReminder.time_due_soon_threshhold_duration" :items="timeDuration"
                              item-value="value" item-title="label"></v-select>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field :rules="[validation.required]" type="number"
                          v-model="localReminder.primary_meter_interval" variant="outlined" density="compact"
                          label="Primary meter interval*"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field :rules="[validation.required]" type="number"
                          v-model="localReminder.primary_meter_due_soon_threshhold" variant="outlined" density="compact"
                          label="Primary meter due soom threshbold*">
                        </v-text-field>
                      </v-col>

                      <v-col cols="12">
                        <v-checkbox hide-details v-model="localReminder.notifications" label="Notifications"
                          persistent-hint
                          hint="If ON, and the user has Notification Settings enabled for Service Reminders, the user will receive a notification at 7:00 am once the reminder becomes Due Soon or Overdue, and then weekly until the Reminder is resolved." />
                      </v-col>

                      <v-col cols="12">
                        <SharedInputEmployeeAutoCompleteInput variant="outlined" flat
                          v-model="localReminder.watcher_ids" multiple label="Watchers" chips closable-chips />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveReminder">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import type { ServiceReminder } from '@/types/maintenance/serviceReminders';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: Boolean,
  serviceReminder: {
    type: Object as PropType<Partial<ServiceReminder>>,
    required: true,
  },
});

const validation = useValidation();

const emit = defineEmits(['update:model-value', 'close', 'save']);
const reminderForm = ref<HTMLFormElement | null>(null)

const localReminder = ref<Partial<ServiceReminder>>(JSON.parse(JSON.stringify(props.serviceReminder || {})));

watch(
  () => props.serviceReminder,
  (newServiceReminder) => {
    localReminder.value = { ...newServiceReminder };
    localReminder.value.watcher_ids = newServiceReminder.watchingEmployees?.map(employee => employee.id) ?? []
  }
);

const timeDuration = ref([
  { label: 'day(s)', value: 'days' },
  { label: 'week(s)', value: 'weeks' },
  { label: 'month(s)', value: 'months' },
  { label: 'year(s)', value: 'years' },
])


const title = computed(() => (props.serviceReminder && props.serviceReminder.id ? 'Edit Reminder' : 'Create Reminder'));

const saveReminder = async () => {
  const formStatus = await reminderForm.value?.validate() || false

  if (!formStatus.valid) {
    return
  }

  emit('save', localReminder.value);
  emit('update:model-value', false);
  emit('close');
};

const updateModelValue = (value: boolean) => {
  emit('update:model-value', value);
};

const closeDialog = () => {
  emit('update:model-value', false);
  emit('close');
};

</script>

<style scoped></style>