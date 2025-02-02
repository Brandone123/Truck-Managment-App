<!-- src/components/recruiting/applicationManagement/dialogs/ReferenceEditDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ reference?.id ? 'Edit Reference' : 'Add Reference' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="referenceForm">
          <v-container>
            <v-row>
              <!-- Reference Type -->
              <v-col cols="12" md="6">
                <v-select label="Reference Type" :items="referenceTypes" v-model="currentReference.reference_type"
                  :rules="[rules.required]" variant="outlined" density="comfortable"></v-select>
              </v-col>

              <!-- Reference Contact -->
              <v-col cols="12" md="6">
                <v-text-field label="Reference Contact" v-model="currentReference.reference_contact"
                  :rules="[rules.required]" variant="outlined" density="comfortable"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="Email" v-model="currentReference.reference_email"
                  :rules="[rules.required]" variant="outlined" density="comfortable"></v-text-field>
              </v-col>

              <!-- Status -->
              <v-col cols="12" md="6">
                <v-select label="Status" :items="statusOptions" v-model="currentReference.status"
                  :rules="[rules.required]" variant="outlined" density="comfortable"></v-select>
              </v-col>

              <!-- Requested At -->
              <!-- <v-col cols="12" md="6">
                <v-text-field v-model="currentReference.requested_at" label="Requested At" variant="outlined"
                  density="comfortable" type="datetime-local" />
              </v-col> -->

              <!-- Completed At -->
              <!-- <v-col cols="12" md="6">
                <v-text-field v-model="currentReference.completed_at" label="Completed At" variant="outlined"
                  density="comfortable" type="datetime-local" />
              </v-col> -->

              <!-- Reference Feedback -->
              <!-- <v-col cols="12">
                <v-textarea label="Reference Feedback" v-model="currentReference.reference_feedback" variant="outlined"
                  density="comfortable"></v-textarea>
              </v-col> -->

              <v-col cols="12">
                <v-card>
                  <v-card-title class="font-weight-bold d-flex">
                    Documents <span v-if="currentReference.documents">({{
                      currentReference.documents?.length
                    }})</span>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="addDocument">
                      <v-icon>mdi-plus</v-icon>
                      <span class="ml-2" style="cursor: pointer;">Add Documents</span>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-list v-if="currentReference.documents?.length">

                      <template v-for="(document, index) in currentReference.documents" :key="index">
                        <v-list-item>
                          <v-list-item-title>{{ document.name }}</v-list-item-title>
                          <template v-slot:append>
                            <v-btn variant="text" size="small" color="error" icon="mdi-delete"
                              @click.stop="removeDocument(index)">
                            </v-btn>
                          </template>
                        </v-list-item>
                        <v-divider v-if="index + 1 < currentReference.documents.length"></v-divider>
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
import type { Reference } from '@/types/recruiting/recruitment';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  reference: {
    type: Object as PropType<Partial<Reference>>,
    default: null,
  },
});

// Emits
const emit = defineEmits(['update:modelValue', 'close', 'save']);

// Dialog visibility
const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

// Current reference form data
const currentReference = ref<Partial<Reference>>({ ...props.reference });

// Watch for changes in reference prop to update form data
watch(
  () => props.reference,
  (newReference) => {
    currentReference.value = { ...newReference };
  }
);

// Example reference types; replace with dynamic data from the store
const referenceTypes = ['Professional', 'Personal', 'Academic'];

// Example status options
const statusOptions = ['Pending', 'Completed', 'Rejected'];

const rules = {
  required: (value: any) => !!value || 'Required',
};

// Reference to the form
const referenceForm = ref<HTMLFormElement | null>(null);
const mediaStore = useMediaStore()

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
          if (!Array.isArray(currentReference.value.documents)) {
            currentReference.value.documents = [];
          }
          // Add file data to documents array
          currentReference.value.documents.push(data);
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
  currentReference.value.documents?.splice(index, 1);
}

// Submit form
const submitForm = async () => {
  const isValid = await referenceForm.value?.validate();
  if (!isValid) return;

  if(currentReference.value.status == 'Completed' || currentReference.value.status == 'Rejected'){
    currentReference.value.completed_at = new Date().toISOString().slice(0, 19)
  }

  emit('save', {
    ...currentReference.value,
    application_id: parseInt(route.params.applicationId as string, 10),
  });
};

// Close dialog
const closeDialog = () => {
  emit('close');
};
</script>

<style scoped>
/* Add your custom styles here */
</style>