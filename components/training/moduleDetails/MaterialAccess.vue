<template>
  <v-card flat>
    <v-card-title>Additional Materials</v-card-title>
      <v-list dense>
        <v-list-item v-for="material in materials" :key="material.id" @click="openMaterial(material.link)">
          <v-list-item-title>{{ material.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ material.description }}</v-list-item-subtitle>
          <template v-slot:prepend>
            <v-icon>
              mdi-open-in-new
            </v-icon>
          </template>
        </v-list-item>
      </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Material {
  id: number;
  title: string;
  description: string;
  link: string;
  type: string; // Could be 'video', 'article', 'pdf', etc.
}

const materials = ref<Material[]>([
  {
    id: 1,
    title: 'Safety Protocols Video',
    description: 'A comprehensive video on safety protocols.',
    link: 'https://example.com/video',
    type: 'video',
  },
  {
    id: 2,
    title: 'Operational Excellence PDF',
    description: 'Detailed PDF on operational excellence.',
    link: 'https://example.com/operational-excellence.pdf',
    type: 'pdf',
  },
  // ... more materials
]);

function openMaterial(link: string) {
  window.open(link, '_blank');
}
</script>