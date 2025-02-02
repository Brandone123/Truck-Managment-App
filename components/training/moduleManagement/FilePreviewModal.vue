<!-- src/components/training/moduleManagement/FilePreviewModal.vue -->
<template>
    <v-dialog v-model="visible" max-width="800px">
      <v-card>
        <v-card-title class="headline">{{ file?.name }}</v-card-title>
        <v-card-text>
          <div v-if="isImage(file)">
            <v-img :src="file.url" contain></v-img>
          </div>
          <div v-else-if="isVideo(file)">
            <video controls style="width: 100%;">
              <source :src="file.url" :type="getVideoType(file)">
              Your browser does not support the video tag.
            </video>
          </div>
          <div v-else-if="isPdf(file)">
            <iframe :src="file.url" width="100%" height="600px"></iframe>
          </div>
          <div v-else-if="isOffice(file)">
            <iframe :src="getOfficePreviewUrl(file)" width="100%" height="600px"></iframe>
          </div>
          <div v-else-if="isText(file)">
            <v-textarea
              :value="textContent"
              readonly
              auto-grow
              rows="10"
            ></v-textarea>
          </div>
          <div v-else>
            <v-alert type="warning" text>
              Preview not available for this file type.
            </v-alert>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="close">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue';
  import type { ModuleFile } from '@/types/training/trainingModule';
  
  const props = defineProps<{
    file: ModuleFile | null;
  }>();
  
  const emit = defineEmits(['close']);
  
  const visible = ref(false);
  const textContent = ref(''); // For text file content
  
  watch(
    () => props.file,
    (newFile) => {
      if (newFile) {
        visible.value = true;
        if (isText(newFile)) {
          fetchTextContent(newFile.url);
        }
      } else {
        visible.value = false;
        textContent.value = '';
      }
    },
    { immediate: true }
  );
  
  // Function to close the modal
  function close() {
    emit('close');
  }
  
  // Helper functions to determine file types
  function isImage(file: ModuleFile): boolean {
    return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(
      file.type.toLowerCase()
    );
  }
  
  function isVideo(file: ModuleFile): boolean {
    return ['mp4', 'webm', 'ogg'].includes(file.type.toLowerCase());
  }
  
  function isPdf(file: ModuleFile): boolean {
    return file.type.toLowerCase() === 'pdf';
  }
  
  function isExcel(file: ModuleFile): boolean {
    return ['xls', 'xlsx'].includes(file.type.toLowerCase());
  }
  
  function isPowerPoint(file: ModuleFile): boolean {
    return ['ppt', 'pptx'].includes(file.type.toLowerCase());
  }
  
  function isText(file: ModuleFile): boolean {
    return ['txt', 'md', 'csv'].includes(file.type.toLowerCase());
  }
  
  function isOffice(file: ModuleFile): boolean {
    return isExcel(file) || isPowerPoint(file);
  }
  
  // Function to get video MIME type
  function getVideoType(file: ModuleFile): string {
    const mimeMap: Record<string, string> = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      ogg: 'video/ogg',
    };
    return mimeMap[file.type.toLowerCase()] || 'video/mp4';
  }
  
  // Function to get Office file preview URL (using Google Docs Viewer or similar)
  function getOfficePreviewUrl(file: ModuleFile): string {
    // Encode the URL
    const encodedUrl = encodeURIComponent(file.url);
    // Using Google Docs Viewer
    return `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
  }
  
  // Function to fetch text content
  async function fetchTextContent(url: string) {
    try {
      const response = await fetch(url);
      const text = await response.text();
      textContent.value = text;
    } catch (error) {
      console.error('Error fetching text file:', error);
      textContent.value = 'Failed to load content.';
    }
  }
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>
  