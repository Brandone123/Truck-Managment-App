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
                          <SharedInputVehicleAutoCompleteInput variant="outlined" flat density="compact"
                            v-model="localFailure.vehicle_id" label="Select Vehicle" :rules="[validation.required]" />
                        </v-col>
                        <!-- <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localFailure.submission_date"
                            label="Submission Date" type="date"></v-text-field>
                        </v-col> -->
                        <!-- <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" :items="forms"
                            v-model="localFailure.inspection_form_id" item-title="name" item-value="id"
                            label="Select Form" :rules="[validation.required]"></v-select>
                        </v-col> -->
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
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-card>
                    <v-card-title class="font-weight-bold d-flex">
                      Photos <span v-if="localFailure.item_photos">({{ localFailure.item_photos?.length
                        }})</span>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="addPhoto">
                        <v-icon>mdi-plus</v-icon>
                        <span class="ml-2" style="cursor: pointer;">Add Photos</span>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <v-card-text>
                            <v-list v-if="localFailure.photos?.length">
                              <template v-for="(photo, index) in localFailure.photos" :key="index">
                                <v-list-item>
                                  <v-list-item-title>{{ photo.name }}</v-list-item-title>
                                  <template v-slot:append>
                                    <v-btn variant="text" size="small" color="error" icon="mdi-delete"
                                      @click.stop="removePhoto(index)">
                                    </v-btn>
                                  </template>
                                </v-list-item>
                                <v-divider v-if="index + 1 < localFailure.photos.length"></v-divider>
                              </template>
                            </v-list>
                            <input ref="fileInput" type="file" multiple accept="image/*" @change="storeFile($event)"
                              style="display: none;" />
                          </v-card-text>
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

const mediaStore = useMediaStore();

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

const fileInput = ref<HTMLInputElement | null>(null);

function addPhoto() {
  fileInput.value?.click();
}

function removePhoto(index: number) {
  localFailure.value.photos?.splice(index, 1);
}

async function storeFile(event: any) {
  const files = (event.target as HTMLFormElement).files as FileList;

  if (files.length === 0) {
    return;
  }

  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const { data, error } = await mediaStore.uploadFile(file);
    if (data) {
      if (!Array.isArray(localFailure.value.photos)) {
        localFailure.value.photos = [];
      }
      // Add file data to photos array
      localFailure.value.photos.push(data);

    }
  }

  //clear input value
  if (event.target) {
    (event.target as HTMLFormElement).value = null
  }
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

</script>