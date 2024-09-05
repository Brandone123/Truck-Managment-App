<template>
  <v-dialog v-model="dialog" fullscreen>
    <template v-slot:activator="{ props }">
      <v-btn color="primary" class="mb-1" v-bind="props" style="cursor: pointer;">
        <v-icon>mdi-plus</v-icon>
        <span class="ml-2">Add Photos</span>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Choose a Photo</span>
      </v-card-title>
      <v-card-text>
        <div>
          <input type="file" multiple ref="fileInput" @change="handleFiles" accept="image/*" />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const emit = defineEmits<{ (event: 'savephoto', photo: { name: string, url: string }): void; }>();
const dialog = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const closeDialog = () => {
  dialog.value = false;
};

const handleFiles = (event: Event) => {
  dialog.value = false;
  const files = (event.target as HTMLInputElement).files;

  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo = {
          name: file.name,
          url: e.target?.result as string
        };
        emit('savephoto', photo);
      };
      reader.readAsDataURL(file);
    }
  }
  (event.target as HTMLInputElement).value = '';
};

</script>

<style scoped></style>