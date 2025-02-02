<template>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-toolbar color="primary" dark dense>
          <v-toolbar-title>Material Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
  
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <strong>Name:</strong> {{ material?.name }}
              </v-col>
              <v-col cols="12" md="6">
                <strong>Created By:</strong> {{ material?.creator?.full_name || 'N/A' }}
              </v-col>
              <v-col cols="12" md="6">
                <strong>Created At:</strong> {{ formatDate(material?.created_at) }}
              </v-col>
              <v-col cols="12">
                <strong>Description:</strong> {{ material?.description || 'N/A' }}
              </v-col>
            </v-row>
<!--   
            <v-divider class="my-4"></v-divider>
  
            <div v-if="material?.material_type.toLowerCase() === 'slide' || material?.material_type.toLowerCase() === 'document'">
              <v-btn color="primary" @click="downloadContent">Download Content</v-btn>
              <v-sheet class="mt-4" height="400px">
                <iframe
                  :src="contentUrl"
                  width="100%"
                  height="100%"
                  frameborder="0"
                ></iframe>
              </v-sheet>
            </div>
  
            <div v-else-if="material?.material_type.toLowerCase() === 'video'">
              <video controls width="100%" class="mt-4">
                <source :src="contentUrl" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
  
            <div v-else-if="material?.material_type.toLowerCase() === 'photo'">
              <v-img :src="contentUrl" class="mt-4" contain></v-img>
            </div>
  
            <div v-else-if="material?.material_type.toLowerCase() === 'quiz'">
              <strong>Quizzes:</strong>
              <ul>
                <li v-for="quiz in material?.quizzes" :key="quiz.id">
                  {{ quiz.question_text }}
                </li>
              </ul>
            </div>
  
            <div v-else>
              <strong>Content:</strong>
              <a :href="contentUrl" target="_blank">View Content</a>
            </div> -->
          </v-container>
        </v-card-text>
  
        <v-divider></v-divider>
  
        <v-card-actions>
          <v-btn @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { defineProps, ref, watch, computed } from 'vue';
  import type { OrientationMaterial } from '@/types/recruiting/onboardingOrientation';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    material: {
      type: Object as PropType<OrientationMaterial | null>,
      required: true,
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'close']);
  
  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
  
  const contentUrl = computed(() => {
    if (props.material?.content_path) {
      return props.material.content_path;
    }
    return '';
  });
  
  watch(
    () => props.material,
    (newMaterial) => {
      // Additional logic if needed when material changes
    },
    { immediate: true }
  );
  
  /**
   * Formats a date string into a readable format using native JavaScript.
   *
   * @param dateStr ISO date string
   * @returns Formatted date string or 'N/A' if invalid
   */
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
  
    // Options for formatting
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
  
    return date.toLocaleString(undefined, options);
  };
  
  /**
   * Triggers the download of the content file.
   */
  const downloadContent = () => {
    if (contentUrl.value) {
      const link = document.createElement('a');
      link.href = contentUrl.value;
      link.download = props.material?.name || 'content';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  