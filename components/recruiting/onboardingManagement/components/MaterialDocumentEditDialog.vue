<template>
    <v-dialog v-model="dialog" max-width="600px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ document?.material_id ? 'Edit Document' : 'Add Document' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
  
        <v-card-text>
          <v-form ref="documentForm">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <DocumentsAutoCompleteInput v-model="currentDocument.document_id"
                    item-value="id" variant="outlined" density="comfortable" label="Select Document" 
                    color="primary" :rules="[rules.required]" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
  
        <v-divider></v-divider>
  
        <v-card-actions>
          <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveQuiz">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  
  <script setup lang="ts">
  import { defineProps, ref, watch, computed } from 'vue';
  import type { OrientationMaterialDocument, OrientationMaterial } from '@/types/recruiting/onboardingOrientation';
  import { OnboardingOrientationDocumentStore } from '~/stores/recruiting/onboardingOrientation/orientationDocumentStore';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
import DocumentsAutoCompleteInput from './DocumentsAutoCompleteInput.vue';
  
  const route = useRoute();
  
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    document: {
      type: Object as PropType<OrientationMaterialDocument | null>,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'close', 'save']);
  
  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
  
  const materialId = parseInt(route.params.materialId as string, 10)
  
  const currentDocument = ref<Partial<OrientationMaterialDocument>>({ ...props.document });

  const documentForm = ref<HTMLFormElement | null>(null);
  
  const orientationStore = OnboardingOrientationDocumentStore();
 
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
  
  const saveQuiz = async () => {
    if (!documentForm.value) {
      console.error('Form reference is not defined');
      return;
    }
  
    const isValid = await documentForm.value.validate();
    if (!isValid) return;
  
    const quizData: Partial<OrientationMaterialDocument> = {
      ...currentDocument.value,
      material_id: materialId,
    };
  
    emit('save', quizData);
  };
  
  onMounted(() => {
    orientationStore.fetchOrientationDocuments({});
  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>