<!-- src/components/training/moduleManagement/ModuleChaptersDesigner.vue -->
<template>
  <v-card class="mb-4">
    <v-card-title>Chapters</v-card-title>
    <v-card-text>
      <v-row>
        <!-- Left Pane: Chapter List -->
        <v-col cols="12" md="4">
          <v-card outlined>
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Chapter List</span>
              <v-btn icon color="primary" @click="addChapter">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <draggable v-model="localChapters" @end="onDragEnd" tag="v-list" dense>
              <v-list-item
                v-for="chapter in localChapters"
                :key="chapter.id"
                @click="selectChapter(chapter)"
                :class="{ 'bg-light-blue-1': selectedChapter?.id === chapter.id }"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ chapter.title }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon small @click.stop="deleteChapter(chapter)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </draggable>
          </v-card>
        </v-col>

        <!-- Right Pane: Chapter Editor -->
        <v-col cols="12" md="8" v-if="selectedChapter">
          <v-card outlined>
            <v-card-title>Edit Chapter</v-card-title>
            <v-card-text>
              <v-form ref="chapterForm" v-model="formValid">
                <!-- Chapter Title -->
                <v-text-field
                  v-model="selectedChapter.title"
                  label="Chapter Title"
                  :rules="[v => !!v || 'Title is required']"
                  @blur="saveChapter"
                />

                <!-- Rich Text Editor for Content -->
                <div class="my-4">
                  <label class="subtitle-1 mb-2">Chapter Content</label>
                  <QuillEditor
                    v-model="selectedChapter.content"
                    :options="editorOptions"
                    @blur="saveChapter"
                  />
                </div>

                <!-- Multimedia Manager -->
                <div class="my-4">
                  <label class="subtitle-1 mb-2">Multimedia</label>
                  <v-file-input
                    multiple
                    prepend-icon="mdi-upload"
                    label="Upload Files"
                    @change="uploadFiles($event)"
                    hide-details
                  />
                  <v-list two-line>
                    <v-list-item
                      v-for="media in selectedChapter.multimedia"
                      :key="media.id"
                    >
                      <v-list-item-icon>
                        <v-icon>
                          {{ getMediaIcon(media.type) }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ media.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ media.type }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn icon small @click="removeMedia(media)">
                          <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                        <v-btn icon small @click="viewMedia(media)">
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- No Chapter Selected -->
        <v-col cols="12" md="8" v-else>
          <v-alert type="info">Select a chapter to edit its details.</v-alert>
        </v-col>
      </v-row>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirm Delete</v-card-title>
          <v-card-text>
            Are you sure you want to delete the chapter
            "{{ chapterToDelete?.title }}"?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="red darken-1" text @click="confirmDeleteChapter">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar for Feedback -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.message }}
        <v-btn text @click="snackbar.show = false">Close</v-btn>
      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';
import {VueDraggableNext} from 'vue-draggable-next';
import { useTrainingModuleStore } from '@/stores/training/trainingModuleStore';
import QuillEditor from '@/components/QuillEditor.vue'; // Import the new QuillEditor component
import type { ModuleChapter, MultimediaAsset } from '@/types/training/trainingModule';

// No need to import quillEditor as it's now handled by QuillEditor.vue

const props = defineProps<{
  chapters: ModuleChapter[];
  moduleId: number;
}>();

const draggable = VueDraggableNext;

const emit = defineEmits(['update:chapters']);

// Local copy of chapters for reactivity
const localChapters = ref<ModuleChapter[]>([...props.chapters]);

// Selected chapter for editing
const selectedChapter = ref<ModuleChapter | null>(null);

// Form validation
const formValid = ref(false);

// Delete dialog
const deleteDialog = ref(false);
const chapterToDelete = ref<ModuleChapter | null>(null);

// Snackbar for feedback
const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
});

// Quill editor options
const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button
      ['link', 'image', 'video']
    ],
    // Add other modules if needed
  }
};

// Watch for prop changes
watch(
  () => props.chapters,
  (newChapters) => {
    localChapters.value = [...newChapters];
    if (!localChapters.value.find(c => selectedChapter?.value?.id === c.id)) {
      selectedChapter.value = null;
    }
  }
);

// Update parent when localChapters change
watch(localChapters, (newChapters) => {
  emit('update:chapters', newChapters);
});

// Select a chapter to edit
function selectChapter(chapter: ModuleChapter) {
  selectedChapter.value = { ...chapter };
}

// Add a new chapter
function addChapter() {
  const newChapter: ModuleChapter = {
    id: Date.now(), // Simple unique ID
    title: 'New Chapter',
    content: '',
    multimedia: [],
  };
  localChapters.value.push(newChapter);
  selectedChapter.value = newChapter;
  showSnackbar('Chapter added successfully.', 'success');
}

// Delete a chapter
function deleteChapter(chapter: ModuleChapter) {
  chapterToDelete.value = chapter;
  deleteDialog.value = true;
}

function confirmDeleteChapter() {
  if (chapterToDelete.value) {
    const index = localChapters.value.findIndex(c => c.id === chapterToDelete.value!.id);
    if (index !== -1) {
      localChapters.value.splice(index, 1);
      showSnackbar('Chapter deleted successfully.', 'success');
      if (selectedChapter.value?.id === chapterToDelete.value.id) {
        selectedChapter.value = null;
      }
    }
  }
  deleteDialog.value = false;
}

// Save chapter changes
function saveChapter() {
  if (selectedChapter.value) {
    const index = localChapters.value.findIndex(c => c.id === selectedChapter.value!.id);
    if (index !== -1) {
      localChapters.value[index] = { ...selectedChapter.value };
      showSnackbar('Chapter updated successfully.', 'success');
    }
  }
}

// Handle drag end
function onDragEnd() {
  emit('update:chapters', localChapters.value);
}

// Multimedia management
async function uploadFiles(files: File[]) {
  if (!selectedChapter.value) return;
  const store = useTrainingModuleStore();

  for (const file of files) {
    try {
      await store.uploadMultimedia(props.moduleId, selectedChapter.value.id, file);
      // Update localChapter multimedia
      const module = store.getModuleById(props.moduleId);
      const updatedChapter = module?.chapters?.find(c => c.id === selectedChapter.value!.id);
      if (updatedChapter) {
        selectedChapter.value!.multimedia = [...(updatedChapter.multimedia || [])];
      }
      showSnackbar(`Uploaded ${file.name} successfully.`, 'success');
    } catch (error) {
      console.error('Upload failed', error);
      showSnackbar(`Failed to upload ${file.name}.`, 'error');
    }
  }
}

// Remove a multimedia asset
function removeMedia(media: MultimediaAsset) {
  if (!selectedChapter.value) return;
  const index = selectedChapter.value.multimedia?.findIndex(m => m.id === media.id);
  if (index !== undefined && index !== -1) {
    selectedChapter.value.multimedia?.splice(index, 1);
    // Update the store
    const store = useTrainingModuleStore();
    store.updateModule(props.moduleId, { chapters: localChapters.value });
    showSnackbar(`Removed ${media.name}.`, 'success');
  }
}

// View media (e.g., open in new tab)
function viewMedia(media: MultimediaAsset) {
  window.open(media.url, '_blank');
}

// Get icon based on media type
function getMediaIcon(type: string) {
  switch (type) {
    case 'image':
      return 'mdi-image';
    case 'video':
      return 'mdi-video';
    case 'pdf':
      return 'mdi-file-pdf';
    case 'audio':
      return 'mdi-music';
    default:
      return 'mdi-file';
  }
}

// Snackbar helper
function showSnackbar(message: string, color: string) {
  snackbar.value.message = message;
  snackbar.value.color = color;
  snackbar.value.show = true;
}
</script>


<style scoped>
.bg-light-blue-1 {
  background-color: rgba(0, 0, 255, 0.1) !important;
}
</style>
