<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px">
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="meterHistoryForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-autocomplete v-model="meterHistoryRecord.vehicle_id" item-title="name" item-value="id" variant="solo"
                flat density="compact" required :items="assetList" label="Vehicle"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="meterHistoryRecord.meter_type" variant="solo" flat density="compact" label="Meter Type"
                :items="['primary', 'secondary']">
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="meterHistoryRecord.meter_value" variant="solo" flat density="compact" required
                label="Mileage" type="number">
                <template v-slot:append-inner>
                  <span>mi</span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="meterHistoryRecord.meter_date" variant="solo" flat density="compact" required
                label="Meter Date" type="date">
              </v-text-field>
            </v-col>
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
import { ref, computed, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { storeToRefs } from 'pinia';
import type { MeterHistory } from '@/types/maintenance/meterHistoryTypes';
import { useMeterHistoryStore } from '~/stores/maintenance/meterHistoryStore';

const assetStore = useAssetStore();

const { assetList } = storeToRefs(assetStore)

const props = defineProps({
  modelValue: Boolean,
  asset: {
    type: Object,
    default: () => ({
      void: false,
    } as Partial<MeterHistory>),
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

const meterHistoryForm = ref<HTMLFormElement | null>(null)

const meterHistoryRecord = ref({} as Partial<MeterHistory>);

watch(
  () => props.asset,
  (newAsset) => {
    meterHistoryRecord.value = { ...newAsset } as Partial<MeterHistory>;
  }
);

const title = computed(() => (props.asset && props.asset.id ? 'Edit Meter Entry' : 'Add Meter Entry'));

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
};

const saveAsset = () => {
  emit('save', meterHistoryRecord.value);
  emit('update:modelValue', false);
};
</script>

<style scoped></style>