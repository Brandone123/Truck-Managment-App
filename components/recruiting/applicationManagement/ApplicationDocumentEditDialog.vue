<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title>{{ document?.id ? 'Edit Document' : 'Add Document' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="documentForm">
          <v-container>
            <v-row>

              <!-- <v-col cols="12" md="6">
                <v-select label="Document Type" variant="outlined" density="comfortable" flat :items="documentTypes"
                  v-model="currentDocument.document_type" :validation="[validation.required]" required></v-select>
              </v-col> -->

              <!-- <v-col cols="12" md="6">
                <v-text-field label="Name" variant="outlined" density="comfortable" flat v-model="currentDocument.name"
                  :validation="[validation.required]" required></v-text-field>
              </v-col> -->

              <v-col cols="12" md="6">
                <ApplicationAutocompleteInput v-model="currentDocument.application_id" variant="outlined"
                  density="compact" :clearable="true" />
              </v-col>

              <v-col cols="12" md="6">
                <DocumentsAutoCompleteInput label="Documents" v-model="currentDocument.document_id" variant="outlined"
                  density="compact" :clearable="true" />
              </v-col>

              <!-- <v-col cols="12" md="6">
                <v-checkbox color="primary" variant="outlined" flat density="compact"
                  v-model="currentDocument.is_fillable_pdf" label="Filable PDF"></v-checkbox>
              </v-col> -->

              <!-- <v-col cols="12" class="pt-0">
                <v-textarea label="Description" variant="outlined" density="comfortable" flat
                  v-model="currentDocument.description" :validation="[validation.required]" required></v-textarea>
              </v-col> -->

              <!-- <v-col cols="12" md="6">
                <DocumentsAutoCompleteInput v-model="currentDocument.parent_id" item-value="id" label="Parent Folder"
                  hide-no-data hide-selected variant="outlined" flat density="compact" clearable
                  @selection="setAlternativeData" />
              </v-col> -->

              <!-- <v-col cols="12">
                <v-card>
                  <v-card-title class="font-weight-bold d-flex">
                    Documents <span v-if="currentDocument.documents">({{
                      currentDocument.documents?.length
                      }})</span>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="addDocument">
                      <v-icon>mdi-plus</v-icon>
                      <span class="ml-2" style="cursor: pointer;">Add Documents</span>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-list v-if="currentDocument.documents?.length">

                      <template v-for="(document, index) in currentDocument.documents" :key="index">
                        <v-list-item>
                          <v-list-item-title>{{ document.name }}</v-list-item-title>
                          <template v-slot:append>
                            <v-btn variant="text" size="small" color="error" icon="mdi-delete"
                              @click.stop="removeDocument(index)">
                            </v-btn>
                          </template>
</v-list-item>
<v-divider v-if="index + 1 < currentDocument.documents.length"></v-divider>
</template>
</v-list>
<input ref="documentfile" type="file" multiple accept="application/pdf, application/msword, text/plain"
  @change="storeFile($event, 'documents')" style="display: none;" />
</v-card-text>
</v-card>
</v-col> -->

              <v-col cols="12" class="pt-0">
                <v-btn v-if="!currentDocument.src && !currentDocument.key" color="primary" density="comfortable"
                  @click="triggerFileInput">Upload
                  File</v-btn>
                <div class="d-flex" v-else>
                  <span class="mr-2"> <v-icon color="primary">mdi-check</v-icon> File Attached</span>
                  <v-btn color="primary" @click="triggerFileInput" density="comfortable" class="text-none">
                    <template class></template>Change
                    File</v-btn>
                </div>
                <input type="file" ref="fileInputRef" style="display: none" @change="handleFileChange" accept="*" />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveDocument">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, computed } from 'vue';
import type { OrientationDocument } from '@/types/recruiting/onboardingOrientation';
import { storeToRefs } from 'pinia';
import DocumentsAutoCompleteInput from '../onboardingManagement/components/DocumentsAutoCompleteInput.vue';
import type { ApplicationDocument } from '~/types/recruiting/applicantApplication';
import ApplicationAutocompleteInput from './components/ApplicationAutocompleteInput.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  document: {
    type: Object as PropType<Partial<ApplicationDocument>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const validation = useValidation();

const mediaStore = useMediaStore();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentDocument = ref<Partial<ApplicationDocument>>({ ...props.document });
const documentForm = ref<HTMLFormElement | null>(null);

const fileInputRef = ref<HTMLInputElement | null>(null);

const documentfile = ref<HTMLInputElement | null>(null);

watch(
  () => props.document,
  (newDocument) => {
    currentDocument.value = { ...newDocument };
  }
);


const file = ref<File | null>(null);

const applicationStore = ApplicantApplicationStore();
const { applicationDocuments } = storeToRefs(applicationStore);


const documentTypes = ref([
  'file',
  'folder',
  // Extend as needed
]);


const saveDocument = async () => {
  const isValid = await documentForm.value?.validate();
  if (!isValid.valid) return;

  // Prepare the document data
  const documentData: Partial<ApplicationDocument> = {
    ...currentDocument.value,
    document_id: currentDocument.value.document_id?.id || currentDocument.value.document_id
  };

  emit('save', documentData);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (event: any) => {
  const target = event.target as HTMLInputElement;

  if (target.files) {
    const files = Array.from(target.files);

    for (const file of files) {
      const { data, error } = await mediaStore.uploadFile(file);
      if (data) {
        currentDocument.value.src = data.src;
        currentDocument.value.key = data.key;
      }
    }
  }

  // Clear input value
  target.value = '';
}

</script>

<style scoped>
/* Add your styles here */
</style>
