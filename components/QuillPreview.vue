<!-- src/components/QuillEditor.vue -->
<template>
  <div class="ql-editor" v-html="htmlContent"></div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';
import { computed } from 'vue';
import 'quill/dist/quill.snow.css'; // Import Quill's Snow theme

// Define component props
const props = defineProps<{
  html: string;
}>();


/**
 * The actual HTML shown in the PREVIEW tab
 */
const htmlContent = computed(() => {
  return DOMPurify.sanitize(props.html || '');
});


</script>

<style scoped>
.ql-editor {
  white-space: unset;
}
</style>