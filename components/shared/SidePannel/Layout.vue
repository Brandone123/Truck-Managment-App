<template>
  <div class="d-flex" style="height: calc(100vh - (48px + 48.81px + 48px))">
    <div class="flex-grow-1" style="overflow-y: auto">
      <slot name="default" :showSidePanel="showSidePanel"></slot>
    </div>
    <v-expand-x-transition ease-in>
      <div v-if="showSidePanel" style="height: calc(100vh - (48px + 48.81px + 48px)); min-width: 350px; width:350px;">
        <!-- Side Pannel Window Items -->
        <v-window v-model="currentStep" style="height: calc(100vh - (48px + 48.81px + 48px))">

          <!-- Comments Window -->
          <v-window-item v-if="showComments" :value="1" style="
                      position: relative;
                      overflow-y: auto;
                      height: calc(100vh - (48px + 48.81px + 48px));
                    ">
            <SidePannelComments :loading="loadingComments" :comments="comments || []" @addComment="addComment" />
          </v-window-item>

          <!-- Photo Window -->
          <v-window-item v-if="showPhotos" :value="2" style="
                      position: relative;
                      overflow-y: auto;
                      height: calc(100vh - (48px + 60px));">
            <SidePannelPhotos @invalidFileType="invalidFileType"  :photos="photos" @uploadPhotos="uploadPhotos" @deletePhoto="deletePhoto" />
          </v-window-item>

          <!-- Document Window -->
          <v-window-item v-if="showDocuments" :value="3" style="
                      position: relative;
                      overflow-y: auto;
                      height: calc(100vh - (48px + 60px));
                    ">
            <SidePannelDocuments @invalidFileType="invalidFileType"  :documents="documents" @uploadDocuments="uploadDocuments" @deleteDocument="deleteDocument" />
          </v-window-item>
        </v-window>
      </div>
    </v-expand-x-transition>

    <v-sheet id="side-panel">
      <div class="d-flex flex-column">
        <!-- Toggle Show/Hide Side Bar -->
        <v-tooltip :text="showSidePanel ? 'Close Sidebar' : 'Open Sidebar'">
          <template v-slot:activator="{ props }">
            <v-sheet v-bind="props" @click="toggleButtonPress" class="d-flex justify-center align-center side-button">
              <v-icon size="x-small">{{
                showSidePanel
                  ? "mdi-arrow-expand-right"
                  : "mdi-arrow-expand-left"
              }}</v-icon>
            </v-sheet>
          </template>
        </v-tooltip>

        <!-- Toggle Show Comments -->
        <v-tooltip text="Comments" v-if="showComments">
          <template v-slot:activator="{ props }">
            <v-card flat variant="tonal" @click="toggleSidePanel(1)" :color="currentStep == 1 ? 'primary' : 'white'"
              v-bind="props" class="rounded-0 d-flex justify-center align-center side-button" style="height: 50px">
              <!-- <v-badge v-if="comments.length" :content="comments.length" color="primary">
                <v-icon :color="currentStep == 1 ? 'primary' : 'black'">mdi-message-text-outline</v-icon>
              </v-badge>
              <v-icon v-else :color="currentStep == 1 ? 'primary' : 'black'">mdi-message-text-outline</v-icon> -->
              <v-icon :color="currentStep == 1 ? 'primary' : 'black'">mdi-message-text-outline</v-icon>
            </v-card>
          </template>
        </v-tooltip>

        <v-tooltip text="Photos" v-if="showPhotos">
          <template v-slot:activator="{ props }">
            <v-card flat variant="tonal" @click="toggleSidePanel(2)" :color="currentStep == 2 ? 'primary' : 'white'"
              v-bind="props" class="rounded-0 d-flex justify-center align-center side-button" style="height: 50px">
              <v-badge v-if="photos.length" :content="photos.length" color="primary">
                <v-icon :color="currentStep == 2 ? 'primary' : 'black'">mdi-image-outline</v-icon>
              </v-badge>
              <v-icon v-else :color="currentStep == 2 ? 'primary' : 'black'">mdi-image-outline</v-icon>
            </v-card>
          </template>
        </v-tooltip>

        <v-tooltip text="Documents" v-if="showDocuments">
          <template v-slot:activator="{ props }">
            <v-card flat variant="tonal" @click="toggleSidePanel(3)" :color="currentStep == 3 ? 'primary' : 'white'"
              v-bind="props" class="rounded-0 d-flex justify-center align-center side-button" style="height: 50px">
              <v-badge v-if="documents.length" :content="documents.length" color="primary" density="compact">
                <v-icon :color="currentStep == 3 ? 'primary' : 'black'">mdi-file-outline</v-icon>
              </v-badge>
              <v-icon v-else :color="currentStep == 3 ? 'primary' : 'black'">mdi-file-outline</v-icon>
            </v-card>
          </template>
        </v-tooltip>
      </div>
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import type { Comment } from '~/types/maintenance/maintenaceDashboardTypes';
import type { File } from "~/types/shared/file";
import SidePannelPhotos from './components/Photos.vue'
import SidePannelDocuments from './components/Documents.vue'
import SidePannelComments from './components/Comments.vue'

const props = defineProps({
  loadingComments: {
    type: Boolean,
    required: false,
    default: false
  },
  showComments: {
    type: Boolean,
    required: false,
    default: true
  },
  comments: {
    type: Array as PropType<Comment[]>,
    required: false,
    default: []
  },
  showPhotos: {
    type: Boolean,
    required: false,
    default: true
  },
  photos: {
    type: Array as PropType<File[]>,
    required: false,
    default: [],
  },
  showDocuments: {
    type: Boolean,
    required: false,
    default: true
  },
  documents: {
    type: Array as PropType<File[]>,
    required: false,
    default: [],
  }
});

const emit = defineEmits(['uploadPhotos','deletePhoto', 'uploadDocuments','deleteDocument', 'fetchComments', 'addComment','invalidFileType']);

const showSidePanel = ref<boolean>(false);
const currentStep = ref(0);
const lastStep = ref(0);

const toggleButtonPress = () => {
  // Check if the side panel is currently closed
  if (!showSidePanel.value) {
    // If closed, set current step to last step or default to 1
    currentStep.value = lastStep.value == 0 ? 1 : lastStep.value;
  } else {
    // If open, update last step and reset current step
    lastStep.value = currentStep.value;
    currentStep.value = 0; // Reset current step when closing
  }
  // Toggle the side panel visibility
  showSidePanel.value = !showSidePanel.value;
};

const toggleSidePanel = (stepVal: number) => {
  // Clicking on the active button should close the side panel
  if (currentStep.value === stepVal && showSidePanel.value) {
    lastStep.value = stepVal; // Store the step being closed
    currentStep.value = 0; // Reset current step
    showSidePanel.value = false; // Close the side panel
  } else {
    // Clicking on a different side panel button
    // If the panel was previously closed (currentStep is 0)
    if (currentStep.value === 0) {
      lastStep.value = stepVal; // Set last step to the new step
    } else {
      // If the panel was open, store the previous step as lastStep
      lastStep.value = currentStep.value; // Store current step as last step
    }
    currentStep.value = stepVal; // Set current step to the new step
    showSidePanel.value = true; // Open the side panel
  }
};

watch(() => currentStep.value, (val) => {
  if (val == 1 && showSidePanel.value == true) {
    emit('fetchComments')
  }
})

const addComment = (comment: any) => {
  emit('addComment', comment)
}

const uploadPhotos = (photos: File[]) => {
  emit('uploadPhotos', photos);
}

const deletePhoto = (photoId: number) => {
  emit('deletePhoto', photoId);
}

const uploadDocuments = (documents: File[]) => {
  emit('uploadDocuments', documents);
}

const deleteDocument = (documentId: number) => {
  emit('deleteDocument', documentId);
}
const invalidFileType = (status:boolean) => {
    emit('invalidFileType',status)
}

</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}


.side-button {
  height: 50px;
  cursor: pointer;
}

.side-button:hover {
  background-color: #eeeeee;
}

#side-panel {
  height: 100%;
  width: 50px;
  min-width: 50px;
  border-left: 1px solid grey;
}
</style>