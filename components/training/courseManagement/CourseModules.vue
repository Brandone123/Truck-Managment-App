<!-- src/components/training/courseManagement/CourseModules.vue -->

<template>
  <div>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="font-weight-bold text-primary">Modules</span>
        <v-btn color="primary" @click="openAddModuleDialog" density="comfortable">
          <v-icon left>mdi-plus</v-icon>
          Add Module
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="modules"
          :search="search"
          item-key="id"
          class="elevation-1"
          :items-per-page="10"
        >
          <template #top>
            <v-text-field
              v-model="search"
              label="Search Modules"
              append-icon="mdi-magnify"
              single-line
              hide-details
            ></v-text-field>
          </template>

          <template #item.title="{ item }">
            <v-btn variant="text" color="primary" :to="`/training/module/${item.id}`">
              {{ item.title }}
            </v-btn>
          </template>

          <template #item.actions="{ item }">
            <v-btn color="info" small @click="openEditModuleDialog(item)">
              <v-icon left>mdi-pencil</v-icon>
              Edit
            </v-btn>
            <v-btn color="red" small @click="confirmDeleteModule(item)">
              <v-icon left>mdi-delete</v-icon>
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Module Dialog -->
    <ModuleDialog
      v-if="isModuleDialogOpen"
      :is-edit="isEditMode"
      :module="selectedModule"
      @close-dialog="closeModuleDialog"
      @save-module="handleSaveModule"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="isDeleteDialogOpen" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete the module "{{ moduleToDelete?.title }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="isDeleteDialogOpen = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteModule">Delete</v-btn>
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
import { ref, computed, onMounted } from 'vue';
import { useTrainingModuleStore } from '@/stores/training/trainingModuleStore';
import { useCourseStore } from '@/stores/training/courseStore';

// Components
import ModuleDialog from '@/components/training/courseManagement/ModuleDialog.vue';

// Types
import type { TrainingModule } from '@/types/training/trainingModule';

const props = defineProps<{
  courseId: number | undefined;
}>();

const emit = defineEmits(['']); // No specific emits needed here

const moduleStore = useTrainingModuleStore();
const courseStore = useCourseStore();

// Local state
const search = ref('');
const isModuleDialogOpen = ref(false);
const isEditMode = ref(false);
const selectedModule = ref<TrainingModule | null>(null);

const isDeleteDialogOpen = ref(false);
const moduleToDelete = ref<TrainingModule | null>(null);

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

// Computed: Get modules associated with the course
const modules = computed<TrainingModule[]>(() => {
  return moduleStore.modules.filter(module => module.courseId === props.courseId);
});

// Headers for the data table
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Title', value: 'title' },
  { title: 'Description', value: 'description' },
  { title: 'Active', value: 'active' },
  { title: 'Actions', value: 'actions', sortable: false },
];

/**
 * Open the dialog to add a new module.
 */
function openAddModuleDialog() {
  isEditMode.value = false;
  selectedModule.value = null;
  isModuleDialogOpen.value = true;
}

/**
 * Open the dialog to edit an existing module.
 * @param module - The module to edit.
 */
function openEditModuleDialog(module: TrainingModule) {
  isEditMode.value = true;
  selectedModule.value = { ...module };
  isModuleDialogOpen.value = true;
}

/**
 * Close the module dialog.
 */
function closeModuleDialog() {
  isModuleDialogOpen.value = false;
  selectedModule.value = null;
}

/**
 * Handle saving a module (create or update).
 * @param moduleData - The module data from the dialog.
 */
async function handleSaveModule(moduleData: Partial<TrainingModule>) {
  try {
    if (isEditMode.value && selectedModule.value) {
      // Update
      await moduleStore.updateModule(selectedModule.value.id, moduleData);
      snackbar.value = {
        show: true,
        message: 'Module updated successfully.',
        color: 'success',
      };
    } else {
      // Create
      await moduleStore.createModule({
        ...moduleData,
        courseId: props.courseId ?? 1, // Ensure courseId is set
      });
      snackbar.value = {
        show: true,
        message: 'Module added successfully.',
        color: 'success',
      };
    }
    isModuleDialogOpen.value = false;
    selectedModule.value = null;
  } catch (error: any) {
    console.error(error);
    snackbar.value = {
      show: true,
      message: 'Failed to save module.',
      color: 'error',
    };
  }
}

/**
 * Confirm delete of a module.
 * @param module - The module to delete.
 */
function confirmDeleteModule(module: TrainingModule) {
  moduleToDelete.value = module;
  isDeleteDialogOpen.value = true;
}

/**
 * Actually delete the module.
 */
async function deleteModule() {
  if (!moduleToDelete.value) return;
  try {
    await moduleStore.deleteModule(moduleToDelete.value.id);
    snackbar.value = {
      show: true,
      message: 'Module deleted successfully.',
      color: 'success',
    };
    isDeleteDialogOpen.value = false;
    moduleToDelete.value = null;
  } catch (error: any) {
    console.error(error);
    snackbar.value = {
      show: true,
      message: 'Failed to delete module.',
      color: 'error',
    };
  }
}
</script>

<style scoped>
.font-weight-bold {
  font-weight: bold;
}
.text-primary {
  color: var(--v-theme-primary);
}
</style>
