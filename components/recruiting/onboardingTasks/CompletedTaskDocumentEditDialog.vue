<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title>{{ document?.id ? 'Edit Completed Document' : 'Add Completed Document' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="documentForm">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  label="Document"
                  :items="documents"
                  item-text="name"
                  item-value="id"
                  v-model="currentDocument.document_id"
                  :rules="[rules.required]"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  label="Status"
                  :items="statusOptions"
                  v-model="currentDocument.status"
                  :rules="[rules.required]"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <!-- Using a native date input field instead of v-date-picker -->
                <v-text-field
                  v-model="currentDocument.completed_at"
                  label="Completed At"
                  type="date"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Signed By"
                  v-model="currentDocument.signed_by"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  label="Signed File"
                  v-model="currentDocument.signed_file"
                  accept=".pdf,.doc,.docx"
                  prepend-icon="mdi-file"
                  :rules="[rules.required]"
                  required
                ></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="Notes"
                  v-model="currentDocument.notes"
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn text @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveDocument">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue';
import type { CompletedDocument } from '@/types/recruiting/onboardingOrientation';
import { OnboardingOrientationDocumentStore } from '~/stores/recruiting/onboardingOrientation/orientationDocumentStore';
import { storeToRefs } from 'pinia';
import { useApiFetch } from '@/composables/useApiFetch'; // Ensure this is defined in your project

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  document: {
    type: Object as PropType<CompletedDocument | null>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentDocument = ref<Partial<CompletedDocument>>({ ...props.document });

const onboardingStore = OnboardingOrientationDocumentStore();
const { orientationDocuments } = storeToRefs(onboardingStore);

// Fetch orientation documents if not already fetched
if (!onboardingStore.orientationDocuments.length) {
  onboardingStore.fetchOrientationDocuments();
}

const statusOptions = ['Pending', 'Completed', 'Signed'];

const rules = {
  required: (value: any) => !!value || 'Required',
};

watch(
  () => props.document,
  (newDocument) => {
    currentDocument.value = { ...newDocument };
  },
  { immediate: true }
);

const documentForm = ref(); // Template ref for the form

const saveDocument = async () => {
  const isValid = await documentForm.value?.validate();
  if (!isValid) return;

  // Handle file upload if necessary
  if (currentDocument.value.signed_file instanceof File) {
    const formData = new FormData();
    formData.append('file', currentDocument.value.signed_file as File);
    // Replace with actual API endpoint
    const { data, error } = await useApiFetch('/api/recruiting/onboarding-orientation-management/upload-signed-file', {
      method: 'POST',
      body: formData,
    });
    if (error.value) {
      console.error('Failed to upload signed file:', error.value);
      return;
    }
    currentDocument.value.signed_file_path = data.value.file_path;
  }

  emit('save', currentDocument.value);
};

const documents = computed(() => orientationDocuments.value);
</script>

<style scoped>
/* Add your styles here */
</style>
