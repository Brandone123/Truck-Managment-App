<template>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-toolbar color="primary" dark dense>
          <v-toolbar-title>Quiz Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
  
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <strong>Question:</strong> {{ quiz?.question_text }}
              </v-col>
              <v-col cols="12" md="6">
                <strong>Question Type:</strong> {{ quiz?.question_type.replace('_', ' ').toUpperCase() }}
              </v-col>
              <!-- <v-col cols="12" md="6">
                <strong>Associated Material:</strong> {{ getMaterialName(quiz?.material_id) || 'N/A' }}
              </v-col> -->
              <v-col cols="12" md="6">
                <strong>Options:</strong>
                <ul v-if="quiz?.options && quiz.options.length">
                  <li v-for="(option, index) in quiz.options" :key="index">{{ option }}</li>
                </ul>
                <span v-else>N/A</span>
              </v-col>
              <!-- <v-col cols="12" md="6">
                <strong>Correct Answer:</strong> {{ formatCorrectAnswer(quiz?.correct_answer) || 'N/A' }}
              </v-col> -->
              <v-col cols="12" md="6">
                <strong>Created At:</strong> {{ formatDate(quiz?.created_at) }}
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
  
        <v-divider></v-divider>
  
        <v-card-actions>
          <v-btn text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { defineProps, ref, watch, computed } from 'vue';
  import type { OrientationQuiz, OrientationMaterial } from '@/types/recruiting/onboardingOrientation';
  import { storeToRefs } from 'pinia';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    quiz: {
      type: Object as PropType<OrientationQuiz | null>,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'close']);
  
  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
  
  // const { orientationMaterials } = storeToRefs(store);
  
  // // Fetch materials if not already fetched
  // if (!store.orientationMaterials.length) {
  //   store.fetchOrientationMaterials();
  // }
  
  // const getMaterialName = (materialId?: number) => {
  //   if (!materialId) return 'N/A';
  //   const material = store.orientationMaterials.find(mat => mat.id === materialId);
  //   return material ? material.name : 'N/A';
  // };
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
  
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
  
    return date.toLocaleString(undefined, options);
  };
  
  const formatCorrectAnswer = (answer?: string | string[]) => {
    if (!answer) return 'N/A';
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    return answer;
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  