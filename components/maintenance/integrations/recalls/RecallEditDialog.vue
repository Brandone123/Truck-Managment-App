<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px"
    scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ recall?.id ? 'Edit' : 'Add' }} Recall Data</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="recallForm">
          <v-row>
            <v-col cols="12" sm="6">
              <v-autocomplete density="compact" variant="solo" v-model="localRecall.vehicle_id" label="Vehicle"
                item-title="name" item-value="id" :items="assetList" :rules="[validation.required]"
                :custom-filter="customFilter">
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :subtitle="item.raw.id as number" :title="item.raw.name"></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select density="compact" variant="solo" v-model="localRecall.status" :items="statusOptions"
                label="Status" :rules="[validation.required]"></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field density="compact" variant="solo" v-model="localRecall.recall_id" 
                label="Recall ID" :rules="[validation.required]" type="number"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea density="compact" variant="solo" v-model="localRecall.description" label="Description"
                :rules="[validation.required]"></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn  @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveRecall">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { PropType } from 'vue';
import { storeToRefs } from 'pinia';
import type { Recall } from '@/types/maintenance/recallsTypes';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const assetStore = useAssetStore()
const { assetList } = storeToRefs(assetStore)

const props = defineProps({
  modelValue: Boolean,
  recall: {
    type: Object as PropType<Partial<Recall>>,
    default: () => ({} as Partial<Recall>),
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const localRecall = ref(JSON.parse(JSON.stringify(props.recall)));

const recallForm = ref<HTMLFormElement | null>(null)

const statusOptions = ['Open', 'Closed'];

watch(() => props.recall, (newRecall) => {
  localRecall.value = JSON.parse(JSON.stringify(newRecall))
});

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const saveRecall = async () => {
  let formStatus = await recallForm.value?.validate()
  if (!formStatus.valid) {
    return
  }

  emit('save', localRecall.value);
  closeDialog();
};

const customFilter = (value: string, query: string, item: any): boolean => {
  const searchText = query.toLowerCase();
  return item.raw.name.toLowerCase().includes(searchText) || item.raw.id == searchText
};
</script>