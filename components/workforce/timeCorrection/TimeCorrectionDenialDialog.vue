<template>
  <v-dialog v-model="dialog" max-width="600px" scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Time Correction Denial</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="denialForm">
          <v-row>
            <v-col cols="12">
              <v-textarea :rules="[validation.required]" v-model="currentCorrectionRequest.denial_reason"
                density="compact" variant="solo" label="Reason for denial*"></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import type { TimeCorrectionRequest } from '@/types/workforce/attendanceRecord';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();


const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  correctionRequest: {
    type: Object as PropType<Partial<TimeCorrectionRequest>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});


const currentCorrectionRequest = ref<Partial<TimeCorrectionRequest>>({});

const save = () => {
  dialog.value = false;
  emit('save', currentCorrectionRequest.value);
};

watch(
  () => props.correctionRequest,
  () => {
    currentCorrectionRequest.value = { status: 'Denied', id: props.correctionRequest.id, denial_reason: '' };
  }
);
</script>

<style scoped>
.v-toolbar-title {
  flex: auto !important;
}
</style>