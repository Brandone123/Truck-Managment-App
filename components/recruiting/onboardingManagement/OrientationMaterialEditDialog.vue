<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ material?.id ? 'Edit Material' : 'Add Material' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="materialForm">
          <v-row>
            <v-col cols="12" v-if="!currentMaterial.id">
              <v-select label="Name" item-title="title" item-value="value" :items="materialTypes"
                v-model="currentMaterial.type" :rules="[validation.required]" variant="outlined" flat
                density="compact"></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Name" v-model="currentMaterial.name" :rules="[validation.required]"
                variant="outlined" flat density="compact"></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0">
              <v-textarea variant="outlined" flat density="compact" label="Description"
                v-model="currentMaterial.description" rows="4" :rules="[validation.required]"></v-textarea>
            </v-col>
            
            <v-col cols="12" class="pt-0" v-if="currentMaterial.type == 'file'">
              <v-btn v-if="!currentMaterial.src && !currentMaterial.key" color="primary" density="comfortable"
                @click="triggerFileInput">Upload
                File</v-btn>
              <div class="d-flex" v-else>
                <span class="mr-2"> <v-icon color="primary">mdi-check</v-icon> File Attached</span>
                <v-btn color="primary" @click="triggerFileInput" density="comfortable" class="text-none">
                  <template class></template>Change
                  File</v-btn>
              </div>
              <input type="file" ref="fileInputRef" style="display: none" @change="handleFileChange" accept="*" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="primary" @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveMaterial">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue';
import type { OrientationMaterial } from '@/types/recruiting/onboardingOrientation';
// import JobCategoryAutocompleteInput from '@/components/recruiting/jobManagement/components/JobCategoryAutocompleteInput.vue'
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  material: {
    type: Object as PropType<OrientationMaterial | null>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);


const mediaStore = useMediaStore();

const currentMaterial = ref<Partial<OrientationMaterial>>({ ...props.material });
const fileInputRef = ref<HTMLInputElement | null>(null);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});


watch(
  () => props.material,
  (newMaterial) => {
    currentMaterial.value = { ...newMaterial };
  }
);

const materialForm = ref<HTMLFormElement | null>(null);

const materialTypes = ref([
  { title: 'File', value: 'file' },
  { title: 'Folder', value: 'folder' }
])

const saveMaterial = async () => {

  const formStatus = await materialForm.value?.validate();
  if (!formStatus.valid) return;

  const materialData: Partial<OrientationMaterial> = {
    ...currentMaterial.value,
    src: currentMaterial.value.type == 'file' ? currentMaterial.value.src : null,
    key: currentMaterial.value.type == 'file' ? currentMaterial.value.key : null,
  };

  emit('save', materialData);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (event: any) => {
  const target = event.target as HTMLInputElement;

  if (target.files) {
    const files = Array.from(target.files);

    for (const file of files) {
      const { data, error } = await mediaStore.uploadFile(file);
      if (data) {
        currentMaterial.value.src = data.src;
        currentMaterial.value.key = data.key;
      }
    }
  }

  // Clear input value
  target.value = '';
}
</script>

<style scoped>
/* Add your styles here */
</style>