<!-- src/components/training/moduleDetails/ModuleContentViewer.vue -->
<template>
  <div>
    <v-tabs vertical v-model="currentTab" class="pa-2">
      <v-tab
        v-for="chapter in chapters"
        :key="chapter.id"
        @click="selectChapter(chapter)"
        :class="{ 'active-chapter': isActive(chapter) }"
      >
        {{ chapter.title }}
      </v-tab>
    </v-tabs>

    <v-tabs-window v-model="currentTab">
      <v-tabs-window-item v-for="chapter in chapters" :key="chapter.id">
        <div class="pa-4">
          <h2>{{ chapter.title }}</h2>
          <!-- Render rich text content safely -->
          <div v-html="sanitizedContent(chapter.content)"></div>

          <!-- Multimedia Assets -->
          <div v-if="chapter.multimedia && chapter.multimedia.length > 0" class="mt-4">
            <h3>Multimedia</h3>
            <v-row>
              <v-col
                v-for="media in chapter.multimedia"
                :key="media.id"
                cols="12"
                md="6"
              >
                <MediaViewer :media="media" />
              </v-col>
            </v-row>
          </div>

          <!-- Mark as Completed Button -->
          <v-btn
            color="success"
            class="mt-4"
            :disabled="chapter.completed"
            @click="markAsCompleted(chapter)"
          >
            {{ chapter.completed ? 'Completed' : 'Mark as Completed' }}
          </v-btn>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { useTrainingModuleStore } from '@/stores/training/trainingModuleStore';
import type { ModuleChapter, MultimediaAsset } from '@/types/training/trainingModule';
import DOMPurify from 'dompurify';
import MediaViewer from '@/components/training/moduleDetails/MediaViewer.vue';

const props = defineProps<{
  moduleId: number;
}>();

const store = useTrainingModuleStore();

// Get the module
const module = computed(() => store.getModuleById(props.moduleId));

// Get user progress
const progress = computed(() => store.getUserProgress(props.moduleId));

// Get chapters with completion status
const chapters = computed(() => {
  if (!module.value?.chapters) return [];
  return module.value.chapters.map((chapter) => ({
    ...chapter,
    completed: progress.value.completedChapters.includes(chapter.id),
  }));
});

// Current active tab
const currentTab = ref(0);

// Watch for current chapter change to set active tab
watch(
  () => progress.value.currentChapterId,
  (newChapterId) => {
    const index = chapters.value.findIndex((c) => c.id === newChapterId);
    if (index !== -1) {
      currentTab.value = index;
    }
  },
  { immediate: true }
);

// Select a chapter
function selectChapter(chapter: ModuleChapter) {
  store.setCurrentChapter(props.moduleId, chapter.id);
}

// Check if chapter is active
function isActive(chapter: ModuleChapter): boolean {
  return progress.value.currentChapterId === chapter.id;
}

// Mark chapter as completed
function markAsCompleted(chapter: ModuleChapter) {
  store.markChapterAsCompleted(props.moduleId, chapter.id);
}

// Sanitize HTML content
function sanitizedContent(content: string): string {
  return DOMPurify.sanitize(content);
}
</script>

<style scoped>
.active-chapter {
  background-color: rgba(0, 0, 255, 0.1);
}
</style>
