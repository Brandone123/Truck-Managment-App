<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h3>Orientation Responses</h3>
          <v-btn color="primary" @click="openAddResponseDialog">Add Orientation Response</v-btn>
  
          <!-- Orientation Response Edit/Create Dialog -->
          <OrientationResponseEditDialog
            :modelValue="responseDialog"
            :response="selectedResponse"
            @update:modelValue="responseDialog = $event"
            @close="closeResponseDialog"
            @save="saveResponse"
          />
  
          <!-- Orientation Responses List -->
          <OrientationResponsesList
            :responses="orientationStore.orientationResponses"
            :loading="orientationStore.loadingOrientationResponses"
            :pagination="orientationStore.pagination"
            :totalItems="orientationStore.totalOrientationResponses"
            @edit="editResponse"
            @delete="deleteResponse"
            @update:pagination="orientationStore.updatePagination"
          />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import OrientationResponsesList from '@/components/recruiting/onboardingTasks/OrientationResponsesList.vue';
  import OrientationResponseEditDialog from '@/components/recruiting/onboardingTasks/OrientationResponseEditDialog.vue';
  import { OnboardingOrientationQuizStore } from '~/stores/recruiting/onboardingOrientation/orientationQuizStore';
  import type { OrientationResponse } from '@/types/recruiting/onboardingOrientation';
  
  const orientationStore = OnboardingOrientationQuizStore();
  const { orientationResponses, loadingOrientationResponses, pagination, totalOrientationResponses } = storeToRefs(orientationStore);
  
  const responseDialog = ref(false);
  const selectedResponse = ref<OrientationResponse | null>(null);
  
  const openAddResponseDialog = () => {
    selectedResponse.value = null;
    responseDialog.value = true;
  };
  
  const editResponse = (response: OrientationResponse) => {
    selectedResponse.value = response;
    responseDialog.value = true;
  };
  
  const closeResponseDialog = () => {
    responseDialog.value = false;
  };
  
  const saveResponse = async (response: Partial<OrientationResponse>) => {
    responseDialog.value = false;
    if (response.id) {
      await orientationStore.updateOrientationResponse(response.id, response);
    } else {
      await orientationStore.createOrientationResponse(response);
    }
  };
  
  const deleteResponse = async (response: OrientationResponse) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete response ID "${response.id}"?`);
    if (confirmDelete) {
      await orientationStore.deleteOrientationResponse(response.id);
    }
  };
  
  onMounted(() => {
    orientationStore.fetchOrientationResponses();
  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  