<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ isNew ? 'New Program' : 'Edit Program' }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="tempProgram.name"
                label="Program Name"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="tempProgram.description"
                label="Program Description"
                required
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="tempProgram.targetAudience"
                label="Target Audience"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="tempProgram.completionTime"
                type="number"
                label="Estimated Completion Time (hours)"
              />
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="tempProgram.active"
                label="Active Program?"
              ></v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="save">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { TrainingProgram } from '@/types/training/program';
import { defineProps, defineEmits } from 'vue';

interface Props {
  isNew: boolean;
  programToEdit?: TrainingProgram | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['close-dialog', 'save-program']);

// Controls if the dialog is visible
const dialog = ref(true);

// Local copy of the program data
const tempProgram = ref<Partial<TrainingProgram>>({
  name: '',
  description: '',
  active: true,
});

// Watch for changes in `programToEdit`
watch(
  () => props.programToEdit,
  (newVal) => {
    if (newVal) {
      // Editing
      tempProgram.value = { ...newVal };
    } else {
      // Creating new => reset fields
      tempProgram.value = {
        name: '',
        description: '',
        active: true,
      };
    }
  },
  { immediate: true },
);

const isNew = computed(() => props.isNew);

/** Called when user presses Cancel */
function closeDialog() {
  dialog.value = false;
  emit('close-dialog');
}

/** Called when user presses Save */
function save() {
  emit('save-program', { ...tempProgram.value });
  dialog.value = false;
}
</script>

<style scoped>
</style>
