<!-- src/components/training/programs/ProgramTrainingPlans.vue -->

<template>
    <div>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="font-weight-bold text-primary">Training Plans</span>
          <v-btn color="primary" @click="openAddPlanDialog" density="comfortable">
            <v-icon left>mdi-plus</v-icon>
            Add New Plan
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="trainingPlans"
            :search="search"
            item-key="id"
            class="elevation-1"
            :items-per-page="10"
          >
            <template #top>
              <v-text-field
                v-model="search"
                label="Search Training Plans"
                append-icon="mdi-magnify"
                single-line
                hide-details
              />
            </template>
  
            <template #item.name="{ item }">
              {{ item.name }}
            </template>
  
            <template #item.description="{ item }">
              {{ item.description }}
            </template>
  
            <template #item.actions="{ item }">
              <v-btn color="info" small @click="openEditPlanDialog(item)">
                <v-icon left>mdi-pencil</v-icon>
                Edit
              </v-btn>
              <v-btn color="red" small @click="confirmDeletePlan(item)">
                <v-icon left>mdi-delete</v-icon>
                Delete
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
  
      <!-- Add/Edit Training Plan Dialog -->
      <TrainingPlanDialog
        v-if="isPlanDialogOpen"
        :is-new="isNewPlan"
        :plan-to-edit="selectedPlan"
        @close-dialog="closePlanDialog"
        @save-plan="handleSavePlan"
      />
  
      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirm Delete</v-card-title>
          <v-card-text>
            Are you sure you want to delete the training plan "{{ planToDelete?.name }}"?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="red darken-1" text @click="handleDeletePlan">
              Delete
            </v-btn>
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
  import { useTrainingPlanStore } from '@/stores/training/trainingPlanStore';
  import { defineProps, defineEmits } from 'vue';
  
  // Components
  import TrainingPlanDialog from '@/components/training/program/TrainingPlanDialog.vue';
  
  import type { TrainingPlan } from '@/types/training/trainingPlan';
  
  const props = defineProps<{
    programId: number;
  }>();
  
  const emit = defineEmits(['']); // No specific emits needed here
  
  const trainingPlanStore = useTrainingPlanStore();
  
  // Local state
  const search = ref('');
  const isPlanDialogOpen = ref(false);
  const isNewPlan = ref(true);
  const selectedPlan = ref<TrainingPlan | null>(null);
  
  const deleteDialog = ref(false);
  const planToDelete = ref<TrainingPlan | null>(null);
  
  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  });
  
  // Fetch training plans when component is mounted or programId changes
  onMounted(() => {
    if (props.programId) {
      trainingPlanStore.fetchPlans();
    }
  });
  
  // Computed: Get training plans for the current program
  const trainingPlans = computed<TrainingPlan[]>(() =>
    trainingPlanStore.getPlansByProgramId(props.programId),
  );
  
  // Headers for the data table
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Name', value: 'name' },
    { title: 'Description', value: 'description' },
    { title: 'Actions', value: 'actions', sortable: false },
  ];
  
  /**
   * Open the dialog to add a new training plan.
   */
  function openAddPlanDialog() {
    isNewPlan.value = true;
    selectedPlan.value = null;
    isPlanDialogOpen.value = true;
  }
  
  /**
   * Open the dialog to edit an existing training plan.
   * @param plan - The training plan to edit.
   */
  function openEditPlanDialog(plan: TrainingPlan) {
    isNewPlan.value = false;
    selectedPlan.value = { ...plan };
    isPlanDialogOpen.value = true;
  }
  
  /**
   * Close the training plan dialog.
   */
  function closePlanDialog() {
    isPlanDialogOpen.value = false;
    selectedPlan.value = null;
  }
  
  /**
   * Handle saving a training plan (create or update).
   * @param planData - The training plan data from the dialog.
   */
  async function handleSavePlan(planData: Partial<TrainingPlan>) {
    if (isNewPlan.value) {
      await trainingPlanStore.createPlan({
        ...planData,
        programId: props.programId,
        courses: planData.courses || [],
      });
      snackbar.value = {
        show: true,
        message: 'Training plan added successfully.',
        color: 'success',
      };
    } else if (selectedPlan.value) {
      await trainingPlanStore.updatePlan(selectedPlan.value.id, planData);
      snackbar.value = {
        show: true,
        message: 'Training plan updated successfully.',
        color: 'success',
      };
    }
    isPlanDialogOpen.value = false;
    selectedPlan.value = null;
  }
  
  /**
   * Open the delete confirmation dialog for a training plan.
   * @param plan - The training plan to delete.
   */
  function confirmDeletePlan(plan: TrainingPlan) {
    planToDelete.value = plan;
    deleteDialog.value = true;
  }
  
  /**
   * Handle deleting a training plan.
   */
  async function handleDeletePlan() {
    if (planToDelete.value) {
      await trainingPlanStore.deletePlan(planToDelete.value.id);
      snackbar.value = {
        show: true,
        message: 'Training plan deleted successfully.',
        color: 'success',
      };
    }
    deleteDialog.value = false;
    planToDelete.value = null;
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
  