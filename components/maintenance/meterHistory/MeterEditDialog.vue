<template>
  <v-dialog
    :modelValue="modelValue"
    @update:modelValue="updateModelValue"
    max-width="800px"
  >
    <v-card class="white-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="meterHistoryForm" class="pt-4">
          <v-row>
            <!-- Vehicle Selection -->
            <v-col cols="12" md="12">
                  <SharedInputVehicleAutoCompleteInput 
                  variant="outlined" 
                  flat density="compact"
                  v-model="meterHistoryRecord.vehicle_id" 
                  label="Select Vehicle"
                  :rules="[validation.required]" />

                  <v-select
                    v-model="meterHistoryRecord.meter_type"
                    label="Meter Type*"
                    variant="outlined"
                    flat
                    density="compact"
                    :items="['primary', 'secondary', 'Odometer']"
                  ></v-select>
                  <v-text-field
                    v-model="meterHistoryRecord.meter_value"
                    label="Mileage*"
                    variant="outlined"
                    flat
                    density="compact"
                    type="number"
                    required
                  >
                    <template v-slot:append-inner>
                    </template>
                  </v-text-field>
                  <v-text-field
                    v-model="meterHistoryRecord.meter_date"
                    label="Meter Date*"
                    variant="outlined"
                    flat
                    density="compact"
                    type="date"
                    required
                  ></v-text-field>
            </v-col>
            <!-- Additional Section (if needed) -->
            <!-- <v-col cols="12" md="6">
              <v-card class="p-4 mt-5">
                <v-card-title class="font-weight-bold">Additional Information</v-card-title>
                <v-card-text>
                </v-card-text>
              </v-card>
            </v-col> -->
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveAsset">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { defineProps, defineEmits } from "vue";
import { storeToRefs } from "pinia";
import type { MeterHistory } from "@/types/maintenance/meterHistoryTypes";
import { useMeterHistoryStore } from "~/stores/maintenance/meterHistoryStore";
import { useValidation } from '~/composables/formValidation';

const assetStore = useAssetStore();
const validation = useValidation();

const { assetList } = storeToRefs(assetStore);

const props = defineProps({
  modelValue: Boolean,
  asset: {
    type: Object,
    default: () =>
      ({
        void: false,
      } as Partial<MeterHistory>),
  },
});

const emit = defineEmits(["update:modelValue", "save"]);

const meterHistoryForm = ref<HTMLFormElement | null>(null);

const meterHistoryRecord = ref({} as Partial<MeterHistory>);

watch(
  () => props.asset,
  (newAsset) => {
    meterHistoryRecord.value = { ...newAsset } as Partial<MeterHistory>;
  }
);

const title = computed(() =>
  props.asset && props.asset.id ? "Edit Meter Entry" : "Add Meter Entry"
);

const updateModelValue = (value: boolean) => {
  emit("update:modelValue", value);
};

const closeDialog = () => {
  emit("update:modelValue", false);
};

const saveAsset = () => {
  emit("save", meterHistoryRecord.value);
  emit("update:modelValue", false);
};
</script>

<style scoped></style>
