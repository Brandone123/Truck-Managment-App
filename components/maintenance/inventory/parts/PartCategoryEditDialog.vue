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
          <v-form ref="partCategoryForm">
            <v-row class="mt-2">
              <v-col cols="12">
                <v-text-field variant="outlined" flat density="compact" v-model="currentPartCategory.name" label="Name"
                  :rules="[validation.required]"></v-text-field>
              </v-col>
              <v-col class="pt-0" cols="12">
                <v-textarea variant="outlined" flat density="compact" v-model="currentPartCategory.description"
                  label="description"></v-textarea>
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
  import type { PartCategory } from "~/types/maintenance/partSupplyTypes";
  const validation = useValidation();
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    partCategory: {
      type: Object as PropType<Partial<PartCategory>>,
      required: true,
      default: () => ({} as Partial<PartCategory>),
    },
  });
  
  const emit = defineEmits(["update:modelValue", "close", "save"]);
  
  const currentPartCategory = ref<Partial<PartCategory>>(JSON.parse(JSON.stringify(props.partCategory)));
  const partCategoryForm = ref<HTMLFormElement | null>(null);
  
  const title = computed(() =>
    currentPartCategory.value && currentPartCategory.value.name ? "Edit Part Category" : "Add Part Category"
  );
  
  
  const closeDialog = () => {
    emit("close");
    emit("update:modelValue", false);
    currentPartCategory.value = {};
  };
  
  const save = async () => {
    const formStatus = await partCategoryForm.value?.validate();
    if (!formStatus.valid) {
      return;
    }
    emit("save", JSON.parse(JSON.stringify(currentPartCategory.value)));
    emit("close");
  };
  
  const updateModelValue = (value: boolean) => {
    emit("update:modelValue", value);
  };
  
  watch(() => props.partCategory, (newValue:Partial<PartCategory>) => {    
    currentPartCategory.value = JSON.parse(JSON.stringify(newValue))
  })
  </script>