h<template>
  <v-dialog v-model="dialog" max-width="900px" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title>
          Job Template Details
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container style="max-width: 1000px;">
          <v-card>
            <v-card-text>
              <QuillPreview :html="jobTemplate.html || ''" />
            </v-card-text>
          </v-card>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { JobTemplate } from '@/types/recruiting/jobManagement';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  jobTemplate: {
    type: Object as PropType<Partial<JobTemplate>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<style scoped>
.ql-editor {
  white-space: unset;
}
</style>
