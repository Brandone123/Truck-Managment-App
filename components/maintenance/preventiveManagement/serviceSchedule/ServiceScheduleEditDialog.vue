<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" scrollable width="80vw" height="98vh">
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
                <v-autocomplete variant="solo" flat density="compact" :items="servicePrograms"
                  v-model="localServiceSchedule.program_id" label="Program" item-title="program_name" item-value="id"
                  :rules="[validation.required]">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-autocomplete variant="solo" flat density="compact" :items="filteredAssets"
                  v-model="localServiceSchedule.vehicle_id" label="Vehicle" item-title="name" item-value="id"
                  :rules="[validation.required]">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="(item.raw.id as number)"
                      :title="item.raw.name"></v-list-item>
                  </template>
                  <template v-slot:chip="{ props, item }">
                    <v-chip v-bind="props" :text="item.raw.name" color="primary"></v-chip>
                  </template>
                </v-autocomplete>
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

const assetStore = useAssetStore()
const { assetList } = storeToRefs(assetStore)

const serviceProgramStore = useServiceProgramStore()
const { servicePrograms } = storeToRefs(serviceProgramStore)

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

const localServiceSchedule = ref(JSON.parse(JSON.stringify(props.serviceSchedule)));

const serviceScheduleForm = ref<HTMLFormElement | null>(null)

watch(
  () => props.serviceSchedule,
  (newServiceSchedule) => {
    localServiceSchedule.value = JSON.parse(JSON.stringify(newServiceSchedule))
  }
);

watch(localServiceSchedule.value.program_id, (newVal) => {
  localServiceSchedule.value.vehicle_id = undefined;
})

watch(
  () => props.modelValue,
  (newModelValue) => {
    if (newModelValue == false) {
      resetForm();
    }
  }
)

const title = computed(() => (props.serviceSchedule && props.serviceSchedule.id ? 'Edit Service Schedule' : 'Create Service Schedule'));

const saveServiceSchedule = async () => {
  const formStatus = await serviceScheduleForm.value?.validate()
  if (!formStatus.valid) {
    return
  }

  emit('save', localServiceSchedule.value);
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

const resetForm = () => {
  localServiceSchedule.value = {}
}

const filteredAssets = computed(() => {
  if (localServiceSchedule.value.program_id) {
    let programVehicles = servicePrograms.value.find(program => program.id == localServiceSchedule.value.program_id)?.subscribed_vehicles?.map(vehicle => vehicle.id) || []
    return assetList.value.filter((asset) => programVehicles.includes(asset.id as number))
  }
  return []
})
</script>