<template>
  <div>

    <v-row no-gutters>
      <v-col cols="4" class="py-0 pl-0 pr-4 computed-height" style="overflow-y:auto;">
        <v-card class="computed-height">
          <!-- Chapter Navigation and progress tracker-->
          <ChapterNavigation />

          <v-divider class="my-4"></v-divider>

          <!-- Material Access Component -->
          <MaterialAccess />
        </v-card>
      </v-col>
      <v-col cols="8" class="pa-0 computed-height">
        <v-card class="computed-height" style="overflow-y:auto;">
          <v-window v-model="currentWindow">
            <v-window-item value="intro">
              <!-- Module Content Viewer -->
              <ModuleContentViewer />
            </v-window-item>
            <v-window-item value="content">
              <!-- Quiz Component -->
              <ModuleQuiz class="computed-height" />
            </v-window-item>
            <v-row no-gutters class="pa-2">
              <v-btn color="primary" density="comfortable" class="text-none" @click="currentWindow = 'intro'"
                :disabled="currentWindow == 'intro'"><v-icon>mdi-chevron-left</v-icon>Back</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" density="comfortable" class="text-none" @click="currentWindow = 'content'"
                :disabled="currentWindow == 'content'">Next <v-icon>mdi-chevron-right</v-icon></v-btn>
            </v-row>
          </v-window>
        </v-card>
      </v-col>
    </v-row>

    <!-- Module Feedback Form -->
    <div class="mx-n4 mb-n4 mt-5 px-5 pb-5 background-primary">
      <ModuleFeedback class="" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Import each of the components used on the page
import ModuleContentViewer from '@/components/training/moduleDetails/ModuleContentViewer.vue';
import ChapterNavigation from '@/components/training/moduleDetails/ChapterNavigation.vue';
import ModuleQuiz from '@/components/training/moduleDetails/ModuleQuiz.vue';
import MaterialAccess from '@/components/training/moduleDetails/MaterialAccess.vue';
import ModuleFeedback from '@/components/training/moduleDetails/ModuleFeedback.vue';

import { ref } from 'vue';
// You might have additional setup here such as fetching the module data,
// handling user progress, etc.

const currentWindow = ref<string>('intro')
</script>

<style scoped>
/* Add any additional styling needed for your module detail page here */

.computed-height {
  height: calc(100vh - 75px)
}

.background-primary {
  background-color: rgba(var(--v-theme-primary), var(--v-border-opacity));
}
</style>