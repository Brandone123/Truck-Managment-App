<!-- src/components/admin/trainingQuiz/QuizForm.vue -->
<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
    <v-text-field
      v-model="formData.title"
      label="Quiz Title"
      :rules="[v => !!v || 'Title is required']"
      required
    ></v-text-field>

    <v-textarea
      v-model="formData.description"
      label="Quiz Description"
      :rules="[v => !!v || 'Description is required']"
      required
    ></v-textarea>

    <!-- Association Selection -->
    <v-select
      v-model="association"
      :items="associationOptions"
      label="Associate With"
      :rules="[v => !!v || 'Association is required']"
      required
    ></v-select>

    <!-- Conditional Fields Based on Association -->
    <v-select
      v-if="association === 'Course'"
      v-model="formData.courseId"
      :items="courseOptions"
      label="Select Course"
      :rules="[v => !!v || 'Course is required']"
      required
    ></v-select>

    <v-select
      v-else-if="association === 'Module'"
      v-model="formData.moduleId"
      :items="moduleOptions"
      label="Select Module"
      :rules="[v => !!v || 'Module is required']"
      required
    ></v-select>

    <v-select
      v-else-if="association === 'Chapter'"
      v-model="formData.chapterId"
      :items="chapterOptions"
      label="Select Chapter"
      :rules="[v => !!v || 'Chapter is required']"
      required
    ></v-select>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="$emit('cancel')">
        Cancel
      </v-btn>
      <v-btn color="blue darken-1" text type="submit" :disabled="!valid">
        Save
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import type { Quiz } from '@/types/training/trainingQuiz';
import { useTrainingQuizStore } from '@/stores/training/trainingQuizStore';
import { useTrainingModuleStore } from '@/stores/training/trainingModuleStore';

const props = defineProps<{
  quiz: Quiz | null;
  isEditMode: boolean;
}>();

const emit = defineEmits(['save', 'cancel']);

const quizStore = useTrainingQuizStore();
const moduleStore = useTrainingModuleStore();

// Ensure that courses and modules are fetched
onMounted(() => {
  if (moduleStore.courses.length === 0) {
    moduleStore.fetchModules();
  }
});

// Form validity
const valid = ref(false);

// Form data
const formData = ref<Partial<Quiz>>({
  title: '',
  description: '',
  courseId: undefined,
  moduleId: undefined,
  chapterId: undefined,
});

// Association selection
const association = ref<string | null>(null);

// Options for association
const associationOptions = ['Course', 'Module', 'Chapter'];

// Computed options based on association
const courseOptions = computed(() =>
  moduleStore.courses.map((course) => ({
    text: course.name,
    value: course.id,
  }))
);

const moduleOptions = computed(() => {
  return moduleStore.modules.map((module) => ({
    text: module.title,
    value: module.id,
  }));
});

const chapterOptions = computed(() => {
  // Flatten all chapters from all modules
  const allChapters = moduleStore.modules.flatMap((module) => module.chapters || []);
  return allChapters.map((chapter) => ({
    text: `${chapter.title} (Module: ${getModuleTitleByChapterId(chapter.id)})`,
    value: chapter.id,
  }));
});

/**
 * Helper function to find module title from chapter ID.
 * @param chapterId - ID of the chapter.
 * @returns The title of the module associated with the chapter or 'Unknown Module'.
 */
function getModuleTitleByChapterId(chapterId: number): string {
  for (const module of moduleStore.modules) {
    if (module.chapters?.some((ch) => ch.id === chapterId)) {
      return module.title;
    }
  }
  return 'Unknown Module';
}

// Initialize form data if in edit mode
if (props.isEditMode && props.quiz) {
  formData.value = { ...props.quiz };
  if (props.quiz.courseId) {
    association.value = 'Course';
  } else if (props.quiz.moduleId) {
    association.value = 'Module';
  } else if (props.quiz.chapterId) {
    association.value = 'Chapter';
  }
}

// Watch association to reset dependent fields
watch(association, (newVal) => {
  if (newVal !== 'Course') {
    formData.value.courseId = undefined;
  }
  if (newVal !== 'Module') {
    formData.value.moduleId = undefined;
  }
  if (newVal !== 'Chapter') {
    formData.value.chapterId = undefined;
  }
});

/**
 * Handle form submission.
 */
function submitForm() {
  if (formData.value) {
    emit('save', formData.value);
  }
}
</script>

<style scoped>
/* Optional: Add styles for the form */
</style>
