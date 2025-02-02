<template>
    <v-dialog :model-value="modelValue" max-width="800px" @update:modelValue="updateModelValue" scrollable persistent>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
  
        <v-card-text>
          <v-form ref="partMeasurementUnitsForm">
            <v-row class="mt-2">
                <v-col cols="12" mb="6">
                    <v-text-field variant="outlined" flat density="compact" v-model="currentMeasurementUnits.name" label="Name"
                  :rules="[validation.required]"></v-text-field>
              </v-col>
              <v-col cols="12" mb="6">
                <v-text-field variant="outlined" type="url" flat density="compact" v-model="currentMeasurementUnits.symbol" label="Symbol"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="d-flex justify-space-between">
            <v-btn color="primary" class="text" @click="save">Save</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { defineProps, ref, computed, defineEmits } from "vue";
  import { useValidation } from "~/composables/formValidation";
  import type { PartMeasurementUnits } from "~/types/maintenance/partSupplyTypes";
  const validation = useValidation();
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    partMeasurementUnits: {
      type: Object as PropType<Partial<PartMeasurementUnits>>,
      required: true,
      default: () => ({} as Partial< PartMeasurementUnits>),
    },
  });
  
  const emit = defineEmits(["update:modelValue", "close", "save"]);
  
  const currentMeasurementUnits = ref<Partial<PartMeasurementUnits>>(JSON.parse(JSON.stringify(props.partMeasurementUnits)));
  const  partMeasurementUnitsForm = ref<HTMLFormElement | null>(null);
  
  const title = computed(() =>
  currentMeasurementUnits.value && currentMeasurementUnits.value.name ? "Edit Part Measurement Unit  Details" : "Add Part Measurement Unit"
  );
  
  const closeDialog = () => {
    emit("close");
    emit("update:modelValue", false);
    currentMeasurementUnits.value = {};
  };
  
  const save = async () => {
    const formStatus = await  partMeasurementUnitsForm.value?.validate();
    if (!formStatus.valid) {
      return;
    }    
    emit("save", JSON.parse(JSON.stringify(currentMeasurementUnits.value)));
    emit("close");
  };
  
  const updateModelValue = (value: boolean) => {
    emit("update:modelValue", value);
  };
  
  watch(() => props.partMeasurementUnits, (newValue:Partial<PartMeasurementUnits>) => {
    currentMeasurementUnits.value = (JSON.parse(JSON.stringify(newValue)))
  })
  </script>