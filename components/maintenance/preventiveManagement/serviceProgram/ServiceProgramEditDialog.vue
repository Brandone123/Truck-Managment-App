<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" scrollable fullscreen
    class="mv-0">
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <div style="position:sticky; top:-15px; z-index: 1;" class="grey-background mx-n6 mt-n4">
          <v-stepper flat v-model="step" height="48">
            <v-stepper-header style="height:48px">
              <v-stepper-item color="primary" title="Program Info" :value="1"></v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item color="primary" title="Service Schedules" :value="2"></v-stepper-item>
              <v-divider></v-divider>
              <v-stepper-item color="primary" title="Service Vehicles" :value="3"></v-stepper-item>
            </v-stepper-header>
          </v-stepper>
        </div>
        <v-window v-model="step">
          <v-window-item :value="1">
            <v-form ref="serviceProgramForm">
              <v-row class="mt-4">
                <v-col cols="12" class="py-0">
                  <v-text-field variant="solo" flat density="compact" v-model="localServiceProgram.program_name"
                    label="Program Name*" :rules="[validation.required]"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="py-0">
                  <v-textarea variant="solo" flat density="compact" v-model="localServiceProgram.description"
                    label="Description"></v-textarea>
                </v-col>
                <v-col cols="12" sm="6" class="pt-0">
                  <v-card class="pa-2">
                    <v-radio-group hide-details density="compact" color="primary"
                      v-model="localServiceProgram.primary_meter_utilization" :rules="[validation.required]">
                      <template v-slot:label>
                        <div>
                          <div class="text-caption font-weight-bold">Primary Meter*</div>
                          <div class="text-caption">Select how you measure utilization for this service program.</div>
                        </div>
                      </template>
                      <v-radio value="miles" label="Miles"></v-radio>
                      <v-radio value="kilometers" label="Kilometers"></v-radio>
                      <v-radio value="hours" label="Hours"></v-radio>
                    </v-radio-group>
                  </v-card>
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>
          <v-window-item :value="2">
            <v-form ref="serviceScheduleForm">
              <v-card-text>
                <ServiceProgramSchedule class="mb-3" v-for="(task, index) in localServiceProgram.subscribed_tasks"
                  :key="index" :modelValue="task"
                  :primaryMeterUtilization="(localServiceProgram.primary_meter_utilization as string)"
                  @update:modelValue="updateServiceTask($event, index)" @delete="removeTask" />
                <div class="my-5 d-flex justify-center">
                  <v-btn @click="addTask()" dark color="primary" class="text-none text-capitalize">
                    Add Schedule <v-icon class="ml-1">mdi-plus</v-icon>
                  </v-btn>
                </div>
                <div v-if="!localServiceProgram.subscribed_tasks?.length" class="text-center text-h6">At least one service schedule required</div>
              </v-card-text>
            </v-form>
          </v-window-item>
          <v-window-item :value="3">
            <v-card-text>
              <v-row class="my-3" no-gutters>
                <v-spacer></v-spacer>
                <ServiceProgramAddVehicleDialog :selection="localServiceProgram.subscribed_vehicles"
                  @addVehicle="addServiceVehicle" />
              </v-row>
              <v-table class="rounded">
                <thead>
                  <tr>
                    <th><strong>Vehicle ID</strong></th>
                    <th><strong>Vehicle Name</strong></th>
                    <th><strong>Subscription Date</strong></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="entry in localServiceProgram.subscribed_vehicles">
                    <td>{{ entry.id }}</td>
                    <td>{{ getVehicleName(entry.id) }}</td>
                    <td>{{ entry.subscription_date }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions density="">
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="step > 1" color="primary" @click="step -= 1"><v-icon>mdi-chevron-left</v-icon> Back</v-btn>
        <v-btn v-if="step < 3" color="primary" @click="nextWindow">Next <v-icon>mdi-chevron-right</v-icon></v-btn>
        <v-btn v-if="step === 3" color="primary" variant="text" @click="saveServiceProgram">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { ServiceProgram, ServiceTask } from '@/types/maintenance/ServiceProgram';
import ServiceProgramAddVehicleDialog from './ServiceProgramAddVehicleDialog.vue';
import ServiceProgramSchedule from './components/ServiceProgramSchedule.vue';
import { storeToRefs } from 'pinia';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const serviceTaskStore = useServiceTaskStore()
const { serviceTaskList } = storeToRefs(serviceTaskStore)

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  serviceProgram: {
    type: Object as PropType<Partial<ServiceProgram>>,
    default: () => ({ subscribed_tasks: [], subscribed_vehicles: [] })
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);


const assetStore = useAssetStore()
const { assetList } = storeToRefs(assetStore)

const serviceProgramForm = ref<HTMLFormElement | null>(null);
const serviceScheduleForm = ref<HTMLFormElement | null>(null);
const localServiceProgram = ref<Partial<ServiceProgram>>(JSON.parse(JSON.stringify(props.serviceProgram)));
const step = ref(1);

const getVehicleName = (vehicle_id: number) => {
  return assetList.value.find(asset => asset.id == vehicle_id)?.name
}

watch(
  () => props.serviceProgram,
  (newServiceProgram) => {
    localServiceProgram.value = { ...newServiceProgram };
  }
);

const title = computed(() => (props.serviceProgram && props.serviceProgram.id ? 'Edit Service Program' : 'Create Service Program'));

const validateServiceProgramForm = async () => {
  let formStatus = await serviceProgramForm.value?.validate()
  return formStatus.valid ? true : false
}

const validateServiceScheduleForm = async () => {
  let formStatus = await serviceScheduleForm.value?.validate()
  return formStatus.valid ? true : false
}

const nextWindow = async () => {
  switch (step.value) {
    case 1:
      let valid1 = await validateServiceProgramForm()
      if (valid1) {
        step.value = 2
      }
      break
    case 2:
      let valid2 = await validateServiceScheduleForm()
      if (valid2 && localServiceProgram.value.subscribed_tasks?.length) {
        step.value = 3
      }
      break
    default:
      //do nothing
      break;
  }
}

const addTask = () => {
  if (!localServiceProgram.value.subscribed_tasks) {
    localServiceProgram.value.subscribed_tasks = []
  }
  localServiceProgram.value.subscribed_tasks?.push({
    service_tasks: [],
    time_interval: null,
    time_interval_duration: 'days',
    time_due_soon_threshhold: null,
    time_due_soon_threshhold_duration: 'days',
    primary_meter_interval: null,
    primary_meter_due_soon_threshhold: null,
  });
};

const removeTask = (index: any) => {
  localServiceProgram.value.subscribed_tasks?.splice(index, 1);
};

const updateServiceTask = (newTask: any, index: number) => {
  localServiceProgram.value.subscribed_tasks?.splice(index, 1, newTask)
}

const removeServiceVehicle = (index: number) => {
  localServiceProgram.value.subscribed_vehicles?.splice(index, 1)
}

const addServiceVehicle = (vehicle: any) => {
  if (!localServiceProgram.value.subscribed_vehicles) {
    localServiceProgram.value.subscribed_vehicles = []
  }
  let date = new Date().toISOString().substring(0, 10)
  localServiceProgram.value.subscribed_vehicles.push({ id: vehicle, subscription_date: date })
}

const saveServiceProgram = () => {
  emit('save', localServiceProgram.value);
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


watch(
  () => props.modelValue,
  (newModalValue) => {
    if (newModalValue == false) {
      nextTick(() => {
        resetForm()
      })
    }
  }
)

const resetForm = () => {
  localServiceProgram.value = {
    subscribed_tasks: [],
    subscribed_vehicles: []
  }
  step.value = 1
}
</script>