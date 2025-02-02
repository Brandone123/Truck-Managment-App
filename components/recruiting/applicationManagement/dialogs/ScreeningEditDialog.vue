<!-- src/components/recruiting/applicationManagement/dialogs/ScreeningEditDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar density="compact" color="primary" dark>
        <v-toolbar-title>{{ screening?.id ? 'Edit Screening' : 'Add Screening' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="screeningForm">
          <v-container>
            <v-row>
              <!-- Screening Type -->
              <v-col cols="12" md="6">
                <v-select label="Type" :items="screeningTypes" v-model="currentScreening.type" :rules="[rules.required]"
                  variant="outlined" density="comfortable"></v-select>
              </v-col>

              <!-- Conditional Textarea for 'Other' -->
              <v-col cols="12" md="6" v-if="currentScreening.type === 'Other'">
                <v-text-field label="Specify Other Type" v-model="currentScreening.other_type" :rules="[rules.required]"
                  variant="outlined" density="comfortable"></v-text-field>
              </v-col>

              <!-- Screening Status -->
              <v-col cols="12" md="6">
                <v-select label="Status" :items="statusOptions" v-model="currentScreening.status"
                  :rules="[rules.required]" variant="outlined" density="comfortable"></v-select>
              </v-col>

              <!-- Completed At -->
              <v-col cols="12" md="6">
                <v-text-field v-model="currentScreening.completed_at" label="Completed At" variant="outlined"
                  density="comfortable" type="datetime-local" />
              </v-col>

              <!-- Result Details -->
              <v-col cols="12">
                <v-textarea label="Result Details" v-model="currentScreening.result_details" variant="outlined"
                  density="comfortable"></v-textarea>
              </v-col>

              <v-col cols="12">
                <v-card>
                  <v-card-title class="font-weight-bold d-flex">
                    Documents <span v-if="currentScreening.documents">({{
                      currentScreening.documents?.length
                    }})</span>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="addDocument">
                      <v-icon>mdi-plus</v-icon>
                      <span class="ml-2" style="cursor: pointer;">Add Documents</span>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-list v-if="currentScreening.documents?.length">

                      <template v-for="(document, index) in currentScreening.documents" :key="index">
                        <v-list-item>
                          <v-list-item-title>{{ document.name }}</v-list-item-title>
                          <template v-slot:append>
                            <v-btn variant="text" size="small" color="error" icon="mdi-delete"
                              @click.stop="removeDocument(index)">
                            </v-btn>
                          </template>
                        </v-list-item>
                        <v-divider v-if="index + 1 < currentScreening.documents.length"></v-divider>
                      </template>
                    </v-list>
                    <input ref="documentfile" type="file" multiple accept="application/pdf"
                      @change="storeFile($event, 'documents')" style="display: none;" />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submitForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import type { Screening } from '@/types/recruiting/recruitment';
import { useRoute } from 'vue-router';

const route = useRoute();

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  screening: {
    type: Object as PropType<Partial<Screening>>,
    default: null,
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'close', 'save']);

// Dialog visibility
const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

// Current screening form data
const currentScreening = ref<Partial<Screening>>({ ...props.screening });

// Watch for changes in screening prop to update form data
watch(
  () => props.screening,
  (newScreening) => {
    currentScreening.value = { ...newScreening };
  }
);

const screeningTypes = ['Background Check', 'Credit Check', 'Drug Test', 'Other'];
const statusOptions = ['Pending', 'Passed', 'Failed', 'Rejected'];

const rules = {
  required: (value: any) => !!value || 'Required',
};

// Reference to the form
const screeningForm = ref<HTMLFormElement | null>(null);
const mediaStore = useMediaStore()
const auth = useAuthStore()

async function storeFile(event: any, location: string) {
  const files = (event.target as HTMLFormElement).files as FileList;

  if (files.length === 0) {
    return;
  }

  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const { data, error } = await mediaStore.uploadFile(file);
    if (data) {
      switch (location) {
        case 'documents':
          if (!Array.isArray(currentScreening.value.documents)) {
            currentScreening.value.documents = [];
          }
          // Add file data to documents array
          currentScreening.value.documents.push(data);
          break;
      }
    }
  }

  //clear input value
  if (event.target) {
    (event.target as HTMLFormElement).value = null
  }
}

const documentfile = ref<HTMLInputElement | null>(null);

function addDocument() {
  documentfile.value?.click();
}

function removeDocument(index: number) {
  currentScreening.value.documents?.splice(index, 1);
}

// Submit form
const submitForm = async () => {
  const isValid = await screeningForm.value?.validate();
  if (!isValid) return;

  const screeningData = {
    ...currentScreening.value,
    performed_by: auth.user?.id,
    application_id: parseInt(route.params.applicationId as string, 10)
  };

  // If the type is “Other”, add the data from the `other_type` field.
  if (currentScreening.value.type === 'Other') {
    screeningData.type = currentScreening.value.type;
    screeningData.other_type = currentScreening.value.other_type;
  }

  emit('save', screeningData);
};

// Close dialog
const closeDialog = () => {
  emit('close');
};

</script>

<style scoped>
/* Add your custom styles here */
</style>