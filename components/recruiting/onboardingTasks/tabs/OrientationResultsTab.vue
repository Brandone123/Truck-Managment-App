<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h3>Orientation Results</h3>
          <v-btn color="primary" @click="openAddResultDialog">Add Orientation Result</v-btn>
  
          <!-- Orientation Result Edit/Create Dialog -->
          <OrientationResultEditDialog
            :modelValue="resultDialog"
            :result="selectedResult"
            @update:modelValue="resultDialog = $event"
            @close="closeResultDialog"
            @save="saveResult"
          />
  
          <!-- Orientation Results List -->
          <OrientationResultsList
            :results="orientationStore.orientationResults"
            :loading="orientationStore.loadingOrientationResults"
            :pagination="orientationStore.pagination"
            :totalItems="orientationStore.totalOrientationResults"
            @edit="editResult"
            @delete="deleteResult"
            @update:pagination="orientationStore.updatePagination"
          />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import OrientationResultsList from '@/components/recruiting/onboardingTasks/OrientationResultsList.vue';
  import OrientationResultEditDialog from '@/components/recruiting/onboardingTasks/OrientationResultEditDialog.vue';
  import { OnboardingOrientationQuizStore } from '~/stores/recruiting/onboardingOrientation/orientationQuizStore';
  import type { OrientationResult } from '@/types/recruiting/onboardingOrientation';
  
  const orientationStore = OnboardingOrientationQuizStore();
  const { orientationResults, loadingOrientationResults, pagination, totalOrientationResults } = storeToRefs(orientationStore);
  
  const resultDialog = ref(false);
  const selectedResult = ref<OrientationResult | null>(null);
  
  const openAddResultDialog = () => {
    selectedResult.value = null;
    resultDialog.value = true;
  };
  
  const editResult = (result: OrientationResult) => {
    selectedResult.value = result;
    resultDialog.value = true;
  };
  
  const closeResultDialog = () => {
    resultDialog.value = false;
  };
  
  const saveResult = async (result: Partial<OrientationResult>) => {
    resultDialog.value = false;
    if (result.id) {
      await orientationStore.updateOrientationResult(result.id, result);
    } else {
      await orientationStore.createOrientationResult(result);
    }
  };
  
  const deleteResult = async (result: OrientationResult) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete result ID "${result.id}"?`);
    if (confirmDelete) {
      await orientationStore.deleteOrientationResult(result.id);
    }
  };
  
  onMounted(() => {
    orientationStore.fetchOrientationResults();
  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  