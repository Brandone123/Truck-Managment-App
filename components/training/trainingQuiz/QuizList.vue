<!-- src/components/training/trainingQuiz/QuizList.vue -->
<template>
  <v-data-table
    :headers="headers"
    :items="filteredQuizzes"
    :loading="loading"
    class="elevation-1"
    :items-per-page="10"
    item-key="id"
    show-select
  >
    <template #top>
      <v-text-field
        v-model="search"
        label="Search Quizzes"
        append-icon="mdi-magnify"
        single-line
        hide-details
      />
    </template>

    <template #item.title="{ item }">
      <!-- Link to the Quiz Detail Page -->
      <router-link :to="`/training/QuizManagement/${item.id}`" class="text-primary">
        <v-btn variant="text" color="primary">
          {{ item.title }}
        </v-btn>
      </router-link>
    </template>

    <template #item.association="{ item }">
      {{ item.association }}
    </template>

    <template #item.actions="{ item }">
      <v-btn color="info" small @click="$emit('edit-quiz', item)">
        <v-icon left>mdi-pencil</v-icon>
        Edit
      </v-btn>
      <v-btn color="red" small @click="$emit('delete-quiz', item)">
        <v-icon left>mdi-delete</v-icon>
        Delete
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { Quiz } from '@/types/training/trainingQuiz';
import { computed, ref } from 'vue';
import { useTrainingModuleStore } from '@/stores/training/trainingModuleStore';

const props = defineProps<{
  quizzes: Quiz[];
  loading: boolean;
}>();

const emit = defineEmits(['edit-quiz', 'delete-quiz']);

const search = ref('');

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Title', value: 'title' },
  { title: 'Description', value: 'description' },
  { title: 'Associated With', value: 'association' },
  { title: 'Created At', value: 'createdAt' },
  { title: 'Actions', value: 'actions', sortable: false },
];

const store = useTrainingModuleStore();

/**
 * Compute the association display based on courseId, moduleId, or chapterId.
 * @param quiz - The quiz object.
 * @returns A string representing the association.
 */
function computeAssociation(quiz: Quiz): string {
  if (quiz.courseId) {
    const course = store.courses.find((c) => c.id === quiz.courseId);
    return course ? `Course: ${course.name}` : `Course #${quiz.courseId}`;
  } else if (quiz.moduleId) {
    const module = store.modules.find((m) => m.id === quiz.moduleId);
    return module ? `Module: ${module.title}` : `Module #${quiz.moduleId}`;
  } else if (quiz.chapterId) {
    // Find the module and chapter
    for (const module of store.modules) {
      const chapter = module.chapters?.find((ch) => ch.id === quiz.chapterId);
      if (chapter) {
        return `Chapter: ${chapter.title} (Module: ${module.title})`;
      }
    }
    return `Chapter #${quiz.chapterId}`;
  } else {
    return 'General';
  }
}

// Add a computed property for association
const formattedQuizzes = computed(() =>
  props.quizzes.map((quiz) => ({
    ...quiz,
    association: computeAssociation(quiz),
  }))
);

const filteredQuizzes = computed(() => {
  if (!search.value.trim()) {
    return formattedQuizzes.value;
  }
  const lowerSearch = search.value.toLowerCase();
  return formattedQuizzes.value.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(lowerSearch) ||
      quiz.description.toLowerCase().includes(lowerSearch) ||
      quiz.association.toLowerCase().includes(lowerSearch)
  );
});
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
