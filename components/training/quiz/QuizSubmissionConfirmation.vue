<!-- src/components/training/quiz/QuizSubmissionConfirmation.vue -->

<template>
  <v-dialog v-model="localShow" max-width="500px">
    <v-card>
      <v-card-title class="headline">Confirm Submission</v-card-title>
      <v-card-text>
        Are you sure you want to submit the quiz? You will not be able to change your answers after submission.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel">Cancel</v-btn>
        <v-btn color="red" text @click="confirm">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['confirm', 'cancel', 'update:show']);

const localShow = ref(props.show);

watch(() => props.show, (newVal) => {
  localShow.value = newVal;
});

watch(localShow, (newVal) => {
  emit('update:show', newVal);
});

function confirm() {
  emit('confirm');
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
/* Add any necessary styles */
</style>
