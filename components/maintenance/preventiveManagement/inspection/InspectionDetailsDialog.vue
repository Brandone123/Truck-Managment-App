<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Submission #{{ inspection.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="font-weight-bold">Inspection Details</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Vehicle</v-col>
                      <v-col cols="12" md="6">
                        <SharedTableVehicleItem :value="inspection.vehicle_id" type="id" />
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Inspection Form</v-col>
                      <v-col cols="12" md="6">{{ getInspectionFormName(inspection.inspection_form_id as number) }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Started</v-col>
                      <v-col cols="12" md="6">{{ inspection.started_on }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Submitted</v-col>
                      <v-col cols="12" md="6">{{ inspection.submitted_on }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Duration</v-col>
                      <v-col cols="12" md="6"></v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Submitted By</v-col>
                      <v-col cols="12" md="6">{{ inspection.submitted_by_user?.name }}</v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12"></v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="font-weight-bold">Inspection Items</v-card-title>
              <v-card-text>
                <template v-for="(item, i) in inspection.items">
                  <InspectionItem :item="item" />
                  <v-divider class="my-3" v-if="i + 1 < inspection.items.length"></v-divider>
                </template>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Inspection } from '@/types/maintenance/inspection';
import InspectionItem from './components/InspectionItem.vue';

const inspectionFormStore = useInspectionFormStore();
const { forms } = storeToRefs(inspectionFormStore);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  inspection: {
    type: Object as PropType<Inspection>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const step = ref(1)

const close = () => {
  emit('update:modelValue', false);
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const getInspectionFormName = (id: number) => {
  return forms.value.find(form => form.id == id)?.name
}

watch(
  () => props.modelValue,
  (newModalValue) => {
    if (newModalValue == false) {
      step.value = 1
    }
  }
)
</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>