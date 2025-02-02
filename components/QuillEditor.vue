<!-- src/components/QuillEditor.vue -->
<template>
  <div ref="editorContainer"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, defineProps, defineEmits } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's Snow theme

// Define component props
const props = defineProps<{
  modelValue: string;
  options?: Quill.QuillOptionsStatic;
  readOnly?: boolean;
}>();

// Define emits
const emit = defineEmits(['update:modelValue', 'text-change']);

// Reference to the editor container
const editorContainer = ref<HTMLElement | null>(null);

// Quill instance
let quill: Quill | null = null;

// Initialize Quill
onMounted(() => {
  if (editorContainer.value) {
    quill = new Quill(editorContainer.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean'],                                         // remove formatting button
          ['link', 'image', 'video']
        ],
        // Add other modules if needed
        ...props.options?.modules,
      },
      placeholder: props.options?.placeholder || 'Compose an epic...',
      readOnly: props.readOnly || false,
      ...props.options,
    });

    // Set initial content
    quill.setContents(quill.clipboard.convert({ html: props.modelValue }));

    // Listen to text changes
    quill.on('text-change', () => {
      const html = editorContainer.value?.querySelector('.ql-editor')?.innerHTML || '';
      emit('update:modelValue', html);
      emit('text-change', quill);
    });
  }
});

// Watch for external modelValue changes
watch(() => props.modelValue, (newVal) => {
  if (quill && newVal !== quill.root.innerHTML) {
    quill.setContents(quill.clipboard.convert(newVal));
  }
});

// Watch for readOnly prop changes
watch(() => props.readOnly, (newVal) => {
  if (quill) {
    quill.enable(!newVal);
  }
});

// Cleanup on component unmount
onBeforeUnmount(() => {
  if (quill) {
    quill.off('text-change');
    quill = null;
  }
});
</script>

<style scoped>
/* Optional: Customize the editor container */
.ql-container {
  height: 300px;
  /* Adjust as needed */
}
</style>