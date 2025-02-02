<!-- src/components/training/quiz/AnswerOptions.vue -->

<template>
  <v-card flat>
    <v-radio-group
      :model-value="selectedOption"
      @update:model-value="onOptionSelected"
      :disabled="isPreviewMode"
    >
      <v-radio
        v-for="(option, index) in options"
        :key="index"
        :label="option"
        :value="index"
      >
        <template #label>
          <div :class="{ 'correct-answer': isPreviewMode && index === correctOptionIndex }">
            {{ option }}
            <span
              v-if="isPreviewMode && index === correctOptionIndex"
              class="ml-2"
              title="Correct Answer"
            >
              <v-icon small color="green">mdi-check-circle</v-icon>
            </span>
          </div>
        </template>
      </v-radio>
    </v-radio-group>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
  options: string[];
  selectedOption: number | null;
  mode: 'take' | 'preview';
  correctOptionIndex: number;
}>();

const emit = defineEmits(['update:selectedOption']);

const isPreviewMode = computed(() => props.mode === 'preview');

/**
 * Handles the selection of an option.
 * Emits an update event to inform the parent component of the new selection.
 *
 * @param optionIndex - The index of the selected option.
 */
function onOptionSelected(optionIndex: number) {
  if (props.mode === 'take') {
    emit('update:selectedOption', optionIndex);
  }
}
</script>

<style scoped>
.correct-answer {
  font-weight: bold;
  color: green;
}
</style>
