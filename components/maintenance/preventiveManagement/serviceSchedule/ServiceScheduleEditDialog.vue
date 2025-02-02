<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" scrollable max-width="800px">
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="text-center">
        <v-form ref="serviceScheduleForm">
          <div class="d-flex justify-center">
            <v-row>
              <v-col cols="12" class="pb-0">
                <v-autocomplete :loading="loadingServicePrograms" variant="solo" flat density="compact"
                  :items="servicePrograms" v-model="localServiceSchedule.program_id" label="Program"
                  item-title="program_name" item-value="id" :rules="[validation.required]">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-autocomplete :readonly="loadingVehicles" :disabled="!localServiceSchedule.program_id"
                  :loading="loadingVehicles" variant="solo" flat density="compact" :items="vehicles"
                  v-model="localServiceSchedule.vehicle_id" label="Vehicle" item-title="name" item-value="id"
                  :rules="[validation.required]">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="item.raw.name">
                      <v-list-item-subtitle>
                        ID: {{ item.raw.id }} - Last Service: {{ getLastServiceDate(item.raw.id) }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </template>
                  <template v-slot:chip="{ props, item }">
                    <v-chip v-bind="props" :text="item.raw.name" color="primary"></v-chip>
                  </template>
                </v-autocomplete>


                <!-- <SharedInputVehicleAutoCompleteInput variant="solo" flat density="compact"
                  v-model="localServiceSchedule.vehicle_id" label="Select Vehicle" multiple
                  :rules="[validation.required]" /> -->
              </v-col>
              <v-col cols="12" sm="6" class="pb-0">
                <v-text-field variant="solo" flat density="compact" v-model="localServiceSchedule.due_date"
                  label="Due Date" type="date" :rules="[validation.required]"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="pb-0">
                <v-select variant="solo" flat density="compact" v-model="localServiceSchedule.status"
                  :items="['Upcoming', 'Overdue', 'Completed']" label="Status"
                  :rules="[validation.required]"></v-select>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveServiceSchedule">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { ServiceSchedule } from '@/types/maintenance/serviceSchedule';
import { storeToRefs } from 'pinia';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  serviceSchedule: {
    type: Object as PropType<Partial<ServiceSchedule>>,
    default: () => ({} as Partial<ServiceSchedule>)
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);


const commonListStore = useMaintenanceCommonListStore()

const { loadingVehicles, loadingServicePrograms } = storeToRefs(commonListStore);

const vehicles = computed(() => {
  return commonListStore.getVehicles
})

const servicePrograms = computed(() => {
  return commonListStore.getServicePrograms
})

onMounted(() => {
  commonListStore.fetchList('service-programs', {
    relations: [['vehicles',]]
  })
})

const localServiceSchedule = ref({ ...props.serviceSchedule });

const serviceScheduleForm = ref<HTMLFormElement | null>(null);

const selectedProgramVehicles = computed(() => {
  if (localServiceSchedule.value.program_id) {
    return servicePrograms.value?.find(program => program.id == localServiceSchedule.value.program_id)?.vehicles?.map(vehicle => vehicle.id) || []
  }
  return []
})

watch(() => selectedProgramVehicles.value, (val) => {
  if (localServiceSchedule.value.program_id && props.modelValue) {
    if (!localServiceSchedule.value.id) {
      localServiceSchedule.value.vehicle_id = undefined;
    }
    commonListStore.fetchList('vehicles', {
      filters: {
        id: {
          not_in: localServiceSchedule.value.id ?
            selectedProgramVehicles.value.filter(vehicle_id => vehicle_id != localServiceSchedule.value.vehicle_id)
            : selectedProgramVehicles.value
        }
      }
    })
  }
})

watch(
  () => props.serviceSchedule,
  (newServiceSchedule) => {
    localServiceSchedule.value = { ...newServiceSchedule };
  }
);

watch(
  () => props.modelValue,
  (newModelValue) => {
    if (!newModelValue) {
      resetForm();
    }
  }
);

const title = computed(() => (props.serviceSchedule && props.serviceSchedule.id ? 'Edit Service Schedule' : 'Create Service Schedule'));

const saveServiceSchedule = async () => {
  const formStatus = await serviceScheduleForm.value?.validate();
  if (!formStatus?.valid) {
    return;
  }

  emit('save', localServiceSchedule.value);
  emit('update:modelValue', false);
  emit('close');
  resetForm();
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
  resetForm();
};

const resetForm = () => {
  localServiceSchedule.value = { ...props.serviceSchedule };
};

const getLastServiceDate = (vehicleId: number) => {
  // to do 
};
</script>