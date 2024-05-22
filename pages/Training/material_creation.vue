<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Material Creation</span>
    </div>

    <v-row>
      <!-- Material Upload Section -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Upload New Material</v-card-title>
          <v-card-text>
            <v-form ref="uploadForm" v-model="valid">
              <v-file-input density="comfortable" variant="outlined" v-model="(newMaterial.file as any)"
                label="Choose Material" accept=".pdf,.pptx,.docx,.mp4"></v-file-input>
              <v-text-field density="comfortable" variant="outlined" v-model="newMaterial.title" label="Material Title"
                :rules="[v => !!v || 'Title is required']"></v-text-field>
              <v-textarea density="comfortable" variant="outlined" v-model="newMaterial.description" label="Description"
                rows="2"></v-textarea>
              <v-btn color="primary" density="comfortable" class="text-none" @click="uploadMaterial">
                Upload
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>


      <!-- Materials Management Section -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Manage Materials</v-card-title>
          <v-card-text>
            <v-text-field density="comfortable" variant="outlined" v-model="searchQuery" prepend-inner-icon="mdi-magnify"
              placeholder="Search materials..." single-line hide-details></v-text-field>
            <v-list dense>
              <v-list-item v-for="(material, index) in filteredMaterials" :key="index" class="my-2">

                <v-list-item-title>{{ material.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ material.description }}</v-list-item-subtitle>
                <template v-slot:append>
                    <v-icon color="primary" @click="editMaterial(material.id as number)">mdi-pencil</v-icon>
                    <v-icon  color="red" density="compact" @click="deleteMaterial(material.id as number)">mdi-delete</v-icon>
                </template>
                <v-divider></v-divider>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const valid = ref(false);

interface Material {
  id?: number | null;
  file: undefined | File;
  title: string | null;
  description: string | null;
}
const newMaterial = ref<Material>({
  file: undefined,
  title: '',
  description: ''
});
const materials = ref<Material[]>([]); // This would be fetched from the server
const searchQuery = ref('');

const uploadMaterial = () => {
  // Implement the logic to upload the material
  console.log('Uploading material:', newMaterial.value);
  materials.value.push(newMaterial.value)
  // Reset the form after upload
  newMaterial.value = { file: undefined, title: '', description: '' };
};

const editMaterial = (id: number) => {
  // Navigate to the material edit page or open a dialog
  console.log('Editing material with id:', id);
};

const deleteMaterial = (id: number) => {
  // Call API to delete the material and remove it from the list
  console.log('Deleting material with id:', id);
  materials.value = materials.value.filter(material => material.id !== id);
};

const filteredMaterials = computed(() => {
  return materials.value.filter(material =>
    material.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>