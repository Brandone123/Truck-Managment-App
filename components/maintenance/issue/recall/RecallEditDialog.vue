<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="recallForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold">Details</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <!-- <v-select variant="outlined" flat density="compact" :items="assetList" v-model="localRecall.vehicle_id"
                            item-title="name" item-value="id" label="Select Vehicle" :rules="[validation.required]"></v-select> -->
                          <SharedInputVehicleAutoCompleteInput variant="outlined" flat density="compact"
                            v-model="localRecall.vehicle_id" label="Select Vehicle" :rules="[validation.required]" />
                        </v-col>
                        <!-- <v-col cols="12" sm="4">
                          <v-text-field variant="outlined" flat density="compact" v-model="localRecall.date"
                            label="Date of Recall" type="date" :rules="[validation.required]"></v-text-field>
                        </v-col> -->
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localRecall.issued_date"
                            label="Issued Date" type="date"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localRecall.manufacturer"
                            label="Manufacturer" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact"
                            v-model="localRecall.nhtsa_campaign_number" label="NHTSA Campaign Number"
                            required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" v-model="localRecall.status"
                            :items="statuses" label="Status" item-value="value" item-title="title"
                            :rules="[validation.required]"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localRecall.recall_year"
                            label="Recall Year" type="month"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localRecall.recall_make"
                            label="Recall Make" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localRecall.recall_model"
                            label="Recall Model" required></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-textarea variant="outlined" flat density="compact" v-model="localRecall.notes"
                            label="Notes" required></v-textarea>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea variant="outlined" flat density="compact" v-model="localRecall.safety_risk"
                        label="Safety Risk" :rows="3"></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea variant="outlined" flat density="compact" v-model="localRecall.remedy" label="Remedy"
                        :rows="3"></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea variant="outlined" flat density="compact" v-model="localRecall.summary"
                        label="Summary" :rules="[validation.required]"></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveRecall">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { Recall } from '@/types/maintenance/recall';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  recall: {
    type: Object as PropType<Recall>,
    required: true,
  },
});

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const validation = useValidation();
const emit = defineEmits(['update:modelValue', 'close', 'save']);

const localRecall = ref<Partial<Recall>>(JSON.parse(JSON.stringify(props.recall || {})));

watch(
  () => props.recall,
  (newRecall) => {
    localRecall.value = { ...newRecall };
  }
);

const title = computed(() => (props.recall && props.recall.id ? 'Edit Recall' : 'Report Recall'));

const recallForm = ref<HTMLFormElement | null>(null)

const validateForm1 = async () => {
  let formStatus = await recallForm.value?.validate()
  return formStatus.valid ? true : false
}

const saveRecall = async () => {
  // validate first window
  let validForm1 = await validateForm1()
  if (!validForm1) {
    return;
  }

  emit('save', localRecall.value);
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

const statuses = [
  { title: 'Pending', value: 'pending' },
  { title: 'Open', value: 'open' },
  { title: 'Needs Action', value: 'needs action' },
  { title: 'Resolved', value: 'resolved' },
  { title: 'Acknowledged', value: 'acknowledged' }];

onMounted(() => {
  // assetStore.fetchAssets();
})

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (!props.recall || !props.recall.id) {
      localRecall.value.date = new Date().toISOString().slice(0, 10);
      localRecall.value.status = 'open'
    }

  }
})
</script>

<style scoped></style>