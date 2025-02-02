<!-- src/components/training/courseManagement/CourseRepository.vue -->

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="font-weight-bold text-primary">Course Repository</span>
        <v-btn color="primary" @click="openAddFileDialog" density="comfortable">
          <v-icon left>mdi-upload</v-icon>
          Upload File
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="files"
          :search="search"
          item-key="id"
          class="elevation-1"
          :items-per-page="10"
        >
          <template #top>
            <v-text-field
              v-model="search"
              label="Search Files"
              append-icon="mdi-magnify"
              single-line
              hide-details
            ></v-text-field>
          </template>

          <template #item.name="{ item }">
            <v-btn
              variant="text"
              color="primary"
              @click="openPreview(item)"
            >
              {{ item.name }}
            </v-btn>
          </template>

          <template #item.type="{ item }">
            <v-chip :color="getChipColor(item.type)" text-color="white">
              {{ item.type.toUpperCase() }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn color="info" small @click="openEditFileDialog(item)">
              <v-icon left>mdi-pencil</v-icon>
              Edit
            </v-btn>
            <v-btn color="red" small @click="confirmDeleteFile(item)">
              <v-icon left>mdi-delete</v-icon>
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Add/Edit File Dialog -->
    <FileDialog
      v-if="isFileDialogOpen"
      :is-edit="isEditMode"
      :file="selectedFile"
      @close-dialog="closeFileDialog"
      @save-file="handleSaveFile"
    />

    <!-- Preview File Dialog -->
    <v-dialog v-model="isPreviewDialogOpen" max-width="800px">
      <v-card>
        <v-card-title>
          Preview: {{ previewFile?.name }}
          <v-spacer></v-spacer>
          <v-btn icon @click="isPreviewDialogOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <component :is="getPreviewComponent(previewFile)" :file="previewFile" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="isDeleteDialogOpen" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete the file "{{ fileToDelete?.name }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isDeleteDialogOpen = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteFile">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for Notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useTrainingModuleStore } from '@/stores/training/trainingModuleStore';
import { useCourseStore } from '@/stores/training/courseStore';

// Components
import FileDialog from '@/components/training/courseManagement/FileDialog.vue';

// Types
import type { ModuleFile } from '@/types/training/trainingModule';
import type { TrainingModule } from '@/types/training/trainingModule';

const props = defineProps<{
  courseId: number | undefined;
}>();

const emit = defineEmits(['']); // No specific emits needed here

const moduleStore = useTrainingModuleStore();
const courseStore = useCourseStore();

// Local state
const search = ref('');
const isFileDialogOpen = ref(false);
const isEditMode = ref(false);
const selectedFile = ref<ModuleFile | null>(null);

const isDeleteDialogOpen = ref(false);
const fileToDelete = ref<ModuleFile | null>(null);

const isPreviewDialogOpen = ref(false);
const previewFile = ref<ModuleFile | null>(null);

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
});

// Fetch necessary data
onMounted(async () => {
  if (props.courseId) {
    await moduleStore.fetchModules();
    await courseStore.fetchCourses();
  }
});

// Computed: Get files associated with the course
const files = computed<ModuleFile[]>(() => {
  // Assuming files are part of modules; aggregate them
  const modules = moduleStore.modules.filter(m => m.courseId === props.courseId);
  let aggregatedFiles: ModuleFile[] = [];
  modules.forEach(module => {
    if (module.files && module.files.length) {
      aggregatedFiles = aggregatedFiles.concat(module.files);
    }
  });
  return aggregatedFiles;
});

// Headers for the data table
const headers = [
  { title: 'Name', value: 'name' },
  { title: 'Type', value: 'type' },
  { title: 'Actions', value: 'actions', sortable: false },
];

/**
 * Open the dialog to add a new file.
 */
function openAddFileDialog() {
  isEditMode.value = false;
  selectedFile.value = null;
  isFileDialogOpen.value = true;
}

/**
 * Open the dialog to edit an existing file.
 * @param file - The file to edit.
 */
function openEditFileDialog(file: ModuleFile) {
  isEditMode.value = true;
  selectedFile.value = { ...file };
  isFileDialogOpen.value = true;
}

/**
 * Close the file dialog.
 */
function closeFileDialog() {
  isFileDialogOpen.value = false;
  selectedFile.value = null;
}

/**
 * Handle saving a file (create or update).
 * @param fileData - The file data from the dialog.
 */
async function handleSaveFile(fileData: Partial<ModuleFile>) {
  try {
    if (isEditMode.value && selectedFile.value) {
      // Update
      await moduleStore.updateModuleFile(selectedFile.value.id, fileData);
      snackbar.value = {
        show: true,
        message: 'File updated successfully.',
        color: 'success',
      };
    } else {
      // Create
      await moduleStore.addFileToCourse(props.courseId!, fileData);
      snackbar.value = {
        show: true,
        message: 'File added successfully.',
        color: 'success',
      };
    }
    isFileDialogOpen.value = false;
    selectedFile.value = null;
  } catch (error: any) {
    console.error(error);
    snackbar.value = {
      show: true,
      message: 'Failed to save file.',
      color: 'error',
    };
  }
}

/**
 * Confirm delete of a file.
 * @param file - The file to delete.
 */
function confirmDeleteFile(file: ModuleFile) {
  fileToDelete.value = file;
  isDeleteDialogOpen.value = true;
}

/**
 * Actually delete the file.
 */
async function deleteFile() {
  if (!fileToDelete.value) return;
  try {
    await moduleStore.deleteModuleFile(fileToDelete.value.id);
    snackbar.value = {
      show: true,
      message: 'File deleted successfully.',
      color: 'success',
    };
    isDeleteDialogOpen.value = false;
    fileToDelete.value = null;
  } catch (error: any) {
    console.error(error);
    snackbar.value = {
      show: true,
      message: 'Failed to delete file.',
      color: 'error',
    };
  }
}

/**
 * Open the preview dialog for a file.
 * @param file - The file to preview.
 */
function openPreview(file: ModuleFile) {
  previewFile.value = file;
  isPreviewDialogOpen.value = true;
}

/**
 * Get the appropriate component for previewing a file based on its type.
 * @param file - The file to preview.
 * @returns The component name or null if not supported.
 */
function getPreviewComponent(file: ModuleFile | null): string | null {
  if (!file) return null;
  switch (file.type) {
    case 'pdf':
      return 'PdfPreview';
    case 'image':
      return 'ImagePreview';
    case 'video':
      return 'VideoPreview';
    case 'excel':
    case 'powerpoint':
    case 'text':
      return 'FileDownload';
    default:
      return 'FileDownload';
  }
}

/**
 * Determine chip color based on file type.
 * @param type - The type of the file.
 * @returns The color string for the chip.
 */
function getChipColor(type: string): string {
  const typeColorMap: { [key: string]: string } = {
    pdf: 'red',
    image: 'green',
    video: 'blue',
    excel: 'orange',
    powerpoint: 'purple',
    text: 'grey',
    other: 'brown',
  };
  return typeColorMap[type.toLowerCase()] || 'grey';
}

// Register dynamic components for previews
const PdfPreview = defineAsyncComponent(() => import('@/components/training/courseManagement/previews/PdfPreview.vue'));
const ImagePreview = defineAsyncComponent(() => import('@/components/training/courseManagement/previews/ImagePreview.vue'));
const VideoPreview = defineAsyncComponent(() => import('@/components/training/courseManagement/previews/VideoPreview.vue'));
const FileDownload = defineAsyncComponent(() => import('@/components/training/courseManagement/previews/FileDownload.vue'));
</script>

<style scoped>
.font-weight-bold {
  font-weight: bold;
}
.text-primary {
  color: var(--v-theme-primary);
}
</style>
