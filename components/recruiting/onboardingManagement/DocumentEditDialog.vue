<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
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
              <v-col cols="12" md="8" v-if="!currentDocument.id">
                <v-select label="Name" item-title="title" item-value="value" :items="documentTypes"
                  v-model="currentDocument.type" :rules="[validation.required]" variant="outlined" flat
                  density="compact"></v-select>
              </v-col>

              <v-col cols="12" md="4" class="pt-0">
                <v-checkbox :disabled="currentDocument.type != 'file'" color="primary" variant="outlined" flat
                  density="compact" v-model="currentDocument.is_fillable_pdf" label="Filable PDF"></v-checkbox>
              </v-col>

              <v-col cols="12">
                <v-text-field label="Name" variant="outlined" density="comfortable" flat v-model="currentDocument.name"
                  :validation="[validation.required]" required></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea label="Description" variant="outlined" density="comfortable" flat
                  v-model="currentDocument.description" :validation="[validation.required]" required></v-textarea>
              </v-col>

              <v-col cols="12" v-if="currentDocument.type == 'file'">
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

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  document: {
    type: Object as PropType<Partial<OrientationDocument>>,
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

const currentDocument = ref<Partial<OrientationDocument>>({ ...props.document });
const documentForm = ref<HTMLFormElement | null>(null);

const fileInputRef = ref<HTMLInputElement | null>(null);

const documentTypes = ref([
  { title: 'File', value: 'file' },
  { title: 'Folder', value: 'folder' }
])

watch(
  () => props.document,
  (newDocument) => {
    currentDocument.value = { ...newDocument };
  }
);

const saveDocument = async () => {
  const isValid = await documentForm.value?.validate();
  if (!isValid.valid) return;

  // Prepare the document data
  const documentData: Partial<OrientationDocument> = {
    ...currentDocument.value,
    src: currentDocument.value.type == 'file' ? currentDocument.value.src : null,
    key: currentDocument.value.type == 'file' ? currentDocument.value.key : null
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

watch(() => currentDocument.value.type, (val) => {
  if (val != 'file') {
    currentDocument.value.is_fillable_pdf = false
  }
})

</script>

<style scoped>
/* Add your styles here */
</style>
