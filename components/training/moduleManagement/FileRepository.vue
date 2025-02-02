<!-- src/components/training/moduleManagement/FileRepository.vue -->
<template>
    <v-card outlined>
      <v-card-title>
        File Repository
        <!-- Spacer -->
        <v-spacer></v-spacer>
        <!-- Filter Dropdown -->
        <v-select
          v-model="selectedFileType"
          :items="fileTypes"
          label="Filter by Type"
          clearable
          @change="filterFiles"
          style="width: 200px;"
        ></v-select>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col
            v-for="file in filteredFiles"
            :key="file.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              class="pa-2"
              @click="openFile(file)"
              style="cursor: pointer;"
            >
              <!-- Conditionally render based on file type -->
              <div v-if="isImage(file)">
                <v-img
                  :src="file.url"
                  aspect-ratio="1"
                  class="mb-2"
                  contain
                >
                  <template #placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </div>
              <div v-else>
                <v-icon
                  size="64"
                  class="mb-2"
                  color="primary"
                >
                  {{ getFileIcon(file) }}
                </v-icon>
              </div>
              <v-card-title class="text-truncate">{{ file.name }}</v-card-title>
              <v-card-subtitle class="text-capitalize">
                {{ file.type }}
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- No Files Found Alert -->
        <v-alert
          v-if="filteredFiles.length === 0"
          type="info"
          text
        >
          No files found for the selected filter.
        </v-alert>
      </v-card-text>
  
      <!-- File Preview Modal -->
      <FilePreviewModal
        v-if="previewFile"
        :file="previewFile"
        @close="closeFilePreview"
      />
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { ModuleFile } from '@/types/training/trainingModule';
  import FilePreviewModal from '@/components/training/moduleManagement/FilePreviewModal.vue';
  
  const props = defineProps<{
    files: ModuleFile[];
    moduleId: number;
  }>();
  
  const emit = defineEmits(['update:files']); // If needed for emitting updates
  
  const fileTypes = [
    'All',
    'Image',
    'Video',
    'PDF',
    'Excel',
    'PowerPoint',
    'Text',
  ];
  
  const selectedFileType = ref('All');
  
  const filteredFiles = computed(() => {
    if (selectedFileType.value === 'All') {
      return props.files;
    }
    // Map display names to file type identifiers
    const typeMap: Record<string, string> = {
      Image: 'image',
      Video: 'video',
      PDF: 'pdf',
      Excel: 'excel',
      PowerPoint: 'powerpoint',
      Text: 'text',
    };
    return props.files.filter(
      (file) => file.type === typeMap[selectedFileType.value]
    );
  });
  
  // File Preview Modal
  const previewFile = ref<ModuleFile | null>(null);
  
  // Function to open file preview
  function openFile(file: ModuleFile) {
    previewFile.value = file;
  }
  
  // Function to close file preview
  function closeFilePreview() {
    previewFile.value = null;
  }
  
  // Function to get the appropriate MDI icon based on file type
  function getFileIcon(file: ModuleFile): string {
    const iconMap: Record<string, string> = {
      video: 'mdi-video',
      pdf: 'mdi-file-pdf-box',
      excel: 'mdi-file-excel-box',
      powerpoint: 'mdi-file-powerpoint-box',
      text: 'mdi-file-document-box',
      other: 'mdi-file',
    };
    // Return the mapped icon or a default icon
    return iconMap[file.type.toLowerCase()] || iconMap['other'];
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
  
  // Function to filter files (handled by computed property)
  function filterFiles() {
    // The computed 'filteredFiles' will automatically update
  }
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  .v-card {
    transition: box-shadow 0.3s;
  }
  
  .v-card:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  </style>
  