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
        <v-form ref="failureFormForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold">Details</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" :items="assetList"
                            v-model="localFailure.vehicle_id" item-title="name" item-value="id" label="Select Vehicle"
                            :rules="[validation.required]"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localFailure.submission_date"
                            label="Submission Date" type="date"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" :items="forms"
                            v-model="localFailure.inspection_form_id" item-title="name" item-value="id"
                            label="Select Form" :rules="[validation.required]"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localFailure.item_name"
                            label="Item Name" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" v-model="localFailure.stage"
                            :items="stages" label="Stage" item-value="value" item-title="text"></v-select>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                  <v-card class="mt-3">
                    <v-card-title class="font-weight-bold">Photos</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <v-file-input v-model="localFailure.item_photos" :show-size="1000" color="primary"
                            label="Pick An Photos" placeholder="Select your photo" prepend-icon="mdi-camera"
                            variant="outlined" density="compact" counter multiple
                            accept="image/png, image/jpeg, image/jpg, image/bmp">
                            <template v-slot:selection="{ fileNames }">
                              <template v-for="(fileName, index) in fileNames" :key="index">
                                <v-chip v-if="index < 2" class="me-2" color="primary" size="small" label>
                                  {{ fileName }}
                                </v-chip>

                                <span v-else-if="index === 2 && localFailure.item_photos"
                                  class="text-overline text-grey-darken-3 mx-2">
                                  +{{ localFailure.item_photos.length - 2 }} File(s)
                                </span>
                              </template>
                            </template>
                          </v-file-input>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="font-weight-bold">Comment</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea variant="outlined" flat density="compact" v-model="localFailure.item_comments"
                        label="Comments" required></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveFailure">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { Failure } from '@/types/maintenance/failure';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  failure: {
    type: Object as PropType<Partial<Failure>>,
    required: true,
  },
});

const validation = useValidation();
const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const inspectionFormStore = useInspectionFormStore();
const { forms } = storeToRefs(inspectionFormStore);

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const localFailure = ref<Partial<Failure>>(JSON.parse(JSON.stringify(props.failure || { item_photos: [] })));

const stages = [
  { text: 'Needs Action', value: 'needs action' },
  { text: 'Open Issue', value: 'open issue' },
  { text: 'Acknowledged', value: 'acknowledged' },
  { text: 'Resolved', value: 'resolved' }
];

watch(
  () => props.failure,
  (newFailure) => {
    localFailure.value = { ...newFailure };
  }
);

const title = computed(() => (props.failure && props.failure.id ? 'Edit Failure' : 'Report Failure'));

const failureFormForm = ref<HTMLFormElement | null>(null)

const validateForm = async () => {
  let formStatus = await failureFormForm.value?.validate()
  return formStatus.valid ? true : false
}


const saveFailure = async () => {
  // validate first window
  let validForm1 = await validateForm()
  if (!validForm1) {
    return;
  }

  emit('save', { ...localFailure.value, item_photos: localFailure.value.item_photos?.map((photo) => photo) });
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

const severities = ['Minor', 'Major', 'Critical'];

onMounted(() => {
  assetStore.fetchAssets();
  inspectionFormStore.fetchForms()
})
</script>