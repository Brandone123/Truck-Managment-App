<!-- src/components/training/courseManagement/FileDialog.vue -->

<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? 'Edit File' : 'Upload New File' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <!-- File Name -->
            <v-text-field
              v-model="fileData.name"
              label="File Name"
              :rules="[v => !!v || 'File name is required']"
              required
            ></v-text-field>
  
            <!-- File Type -->
            <v-select
              v-model="fileData.type"
              :items="fileTypes"
              label="File Type"
              :rules="[v => !!v || 'File type is required']"
              required
            ></v-select>
  
            <!-- File URL -->
            <v-text-field
              v-model="fileData.url"
              label="File URL"
              :rules="[v => !!v || 'File URL is required', v => isValidUrl(v) || 'Invalid URL']"
              required
            ></v-text-field>
  
            <!-- Upload File (only for adding new files) -->
            <v-file-input
              v-if="!isEdit"
              label="Select File"
              accept="*/*"
              @change="handleFileUpload"
              :rules="[v => !!v || 'File is required']"
              required
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text :disabled="!isFormValid" @click="saveFile">
            {{ isEdit ? 'Update' : 'Upload' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import type { ModuleFile } from '@/types/training/trainingModule';
  
  const props = defineProps<{
    isEdit: boolean;
    file?: ModuleFile | null;
  }>();
  
  const emit = defineEmits<{
    (e: 'close-dialog'): void;
    (e: 'save-file', fileData: Partial<ModuleFile>): void;
  }>();
  
  const dialog = ref(true);
  const isFormValid = ref(false);
  
  // Define file types
  const fileTypes = ['pdf', 'image', 'video', 'excel', 'powerpoint', 'text', 'other'];
  
  // Local form data
  const fileData = ref<Partial<ModuleFile>>({
    name: '',
    type: '',
    url: '',
  });
  
  // Watch for changes in the `file` prop to populate or reset form
  watch(
    () => props.file,
    (newVal) => {
      if (newVal) {
        // Editing
        fileData.value = { ...newVal };
      } else {
        // Adding new file => reset fields
        fileData.value = {
          name: '',
          type: '',
          url: '',
        };
      }
    },
    { immediate: true },
  );
  
  /**
   * Close the dialog without saving.
   */
  function closeDialog() {
    dialog.value = false;
    emit('close-dialog');
  }
  
  /**
   * Handle file upload (simulate uploading and getting a URL).
   * @param file - The selected file.
   */
  function handleFileUpload(file: File | null) {
    if (file) {
      // Simulate file upload and get URL
      const reader = new FileReader();
      reader.onload = () => {
        fileData.value.url = reader.result as string;
      };
      reader.readAsDataURL(file);
      fileData.value.name = file.name;
      fileData.value.type = getFileType(file);
    }
  }
  
  /**
   * Save the file (add or update).
   */
  function saveFile() {
    if (!isFormValid.value) return;
    emit('save-file', { ...fileData.value });
    dialog.value = false;
  }
  
  /**
   * Validate URL format.
   * @param url - The URL string to validate.
   * @returns Boolean indicating if the URL is valid.
   */
  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Determine file type based on file extension or MIME type.
   * @param file - The file to evaluate.
   * @returns The determined file type as a string.
   */
  function getFileType(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mime = file.type;
  
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension!)) return 'image';
    if (['mp4', 'webm', 'ogg'].includes(extension!)) return 'video';
    if (['pdf'].includes(extension!)) return 'pdf';
    if (['xls', 'xlsx'].includes(extension!)) return 'excel';
    if (['ppt', 'pptx'].includes(extension!)) return 'powerpoint';
    if (['txt', 'md', 'csv'].includes(extension!)) return 'text';
    return 'other';
  }
  </script>
  
  <style scoped>
  .text-h5 {
    font-size: 1.25rem;
    font-weight: bold;
  }
  </style>
  