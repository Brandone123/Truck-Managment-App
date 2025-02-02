<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title>Document Details</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <strong>Name:</strong> {{ document?.name }}
            </v-col>
            <v-col cols="12" md="6">
              <strong>Type:</strong> {{ document?.document_type }}
            </v-col>
            <!-- <v-col cols="12" md="6">
                <strong>Version:</strong> {{ document?.version }}
              </v-col> -->
            <!-- <v-col cols="12" md="6">
                <strong>Status:</strong> {{ document?.status }}
              </v-col> -->
            <!-- <v-col cols="12" md="6">
                <strong>Created By:</strong> {{ document?.creator?.name || 'N/A' }}
              </v-col> -->
            <v-col cols="12" md="6">
              <strong>Created At:</strong> {{ formatDate(document?.created_at) }}
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- <div v-if="document?.is_fillable_pdf"> -->
            <v-btn color="primary" @click="downloadPDF">Download PDF</v-btn>
            <!-- Optionally, embed PDF viewer -->
            <!-- <v-sheet class="mt-4" height="400px">
              <iframe :src="pdfUrl" width="100%" height="100%" frameborder="0"></iframe>
            </v-sheet> -->
          <!-- </div> -->

          <!-- <div v-else>
            <strong>JSON Structure:</strong>
            <v-code-editor v-model="jsonContent" :options="{ theme: 'vs-dark', language: 'json', readOnly: true }"
              class="mt-2" height="400px"></v-code-editor>
          </div> -->
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue';
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

const emit = defineEmits(['update:modelValue', 'close']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const jsonContent = ref<string>('');

const pdfUrl = computed(() => {
  if (props.document?.src) {
    return props.document.src;
  }
  return '';
});

// Watch for changes in the document prop to update jsonContent
// watch(
//   () => props.document,
//   (newDocument) => {
//     if (!newDocument?.is_fillable_pdf && newDocument?.json_structure) {
//       jsonContent.value = JSON.stringify(newDocument.json_structure, null, 2);
//     } else {
//       jsonContent.value = '';
//     }
//   },
//   { immediate: true }
// );

/**
 * Formats a date string into a readable format using native JavaScript.
 *
 * @param dateStr ISO date string
 * @returns Formatted date string or 'N/A' if invalid
 */
const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';

  // Options for formatting
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return date.toLocaleString(undefined, options);
};

/**
 * Triggers the download of the PDF document.
 */
const downloadPDF = () => {
  if (pdfUrl.value) {
    const link = document.createElement('a');
    link.href = pdfUrl.value;
    link.download = props.document?.name || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>