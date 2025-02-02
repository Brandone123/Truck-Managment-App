<template>
  <v-dialog v-model="dialog" max-width="600px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ applicantDocument?.id ? 'Edit Document Category' : 'Add Document Category'
          }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="applicantDocumentForm">
          <v-row>
            <v-col cols="12">
              <v-text-field label="Name*" variant="outlined" density="comfortable" flat
                v-model="currentApplicantDocument.name" :validation="[validation.required]" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea two-inline label="Description*" variant="outlined" density="comfortable" flat
                v-model="currentApplicantDocument.description" :validation="[validation.required]"
                required></v-textarea>
            </v-col>

            <v-col cols="12">
              <v-autocomplete two-inline label="Template" variant="outlined" density="comfortable" flat
                v-model="currentApplicantDocument.template_id" item-value="id" item-title="name"
                :items="orientationDocumentsFlatList" clearable>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :title="item.raw.name" style="width:600px;">
                    <!-- select dropdown icon -->
                    <template v-slot:prepend>
                      <v-icon :color="getFileIconAndColor(item.raw.src).color">{{ getFileIconAndColor(item.raw.src).icon
                        }}</v-icon>
                    </template>
                    <!-- section that inclides the dialog box -->
                    <v-list-item-subtitle>
                      <span style="font-size: 12px;text-overflow:ellipsis;">{{
                        item.raw.description }}</span>
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
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
import { defineProps, ref, watch, computed, onMounted } from 'vue';
import type { ApplicantDocument } from '@/types/recruiting/applicantApplication';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { getFileIconAndColor } from '~/composables/fileManipulation';
import { useValidation } from '@/composables/formValidation.ts'

const validation = useValidation();
const route = useRoute();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  applicantDocument: {
    type: Object as PropType<Partial<ApplicantDocument>>,
    required: true,
  },
});

const defaultDocumentStore = DefaultDocumentStore();
const { orientationDocumentsFlatList, loading } = storeToRefs(defaultDocumentStore);


const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});


const currentApplicantDocument = ref<Partial<ApplicantDocument>>({ ...props.applicantDocument });
const applicantDocumentForm = ref<HTMLFormElement | null>(null);

watch(
  () => props.applicantDocument,
  (applicantDocument) => {
    currentApplicantDocument.value = { ...applicantDocument };
  },
  { immediate: true }
);

const saveQuiz = async () => {
  const formStatus = await applicantDocumentForm.value?.validate();
  if (!formStatus.valid) return;

  emit('save', currentApplicantDocument.value);
  dialog.value = false;
};
</script>

<style scoped>
/* Add your styles here */
</style>