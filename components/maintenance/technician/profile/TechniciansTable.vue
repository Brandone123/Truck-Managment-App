<template>
  <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="technicians" :loading="loading">
    <template v-slot:item.actions="{ item }">
      <v-icon class="ml-2" color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
      <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
      <v-icon class="ml-2" color="red" dense @click="$emit('delete', item)">mdi-delete</v-icon>
    </template>
    <template v-slot:item.full_name="{ item }">
      <span v-if="item.full_name">
        <v-chip variant="text" :prepend-avatar="getAvatarIcon(item.full_name)">
          <span class="text-secondary">{{ item.full_name }}</span>
        </v-chip>
        <br>
      </span>
      <span v-else>N/A</span>
    </template>
    <template v-slot:item.classification="{ item }">
      <v-chip color="grey" density="compact">{{ item.classification }}</v-chip>
    </template>
    <template v-slot:item.job_title="{ item }">
      <span>{{ item.job_title ? item.job_title : 'Not Provided' }}</span>
    </template>
  </SharedUiCustomTable>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useTechniciansStore } from '@/stores/maintenance/techniciansStore';
import type { Technician } from '@/types/maintenance/technicianTypes';

const props = defineProps({
  search: String,
});

const emit = defineEmits(['view', 'edit', 'delete']);

const techniciansStore = useTechniciansStore();
const technicians = computed(() => techniciansStore.technicians);
const loading = computed(() => techniciansStore.loading);

const headers = [
  // { title: 'ID', key: 'id' },
  { title: 'Name', key: 'full_name' },
  { title: 'Email', key: 'email' },
  { title: 'Job Title', key: 'job_title' },
  { title: 'Classification', key: 'classification' },
  { title: 'Group', key: 'group' },
  // { title: 'Experience Level', key: 'experience_level' },
  { title: 'Actions', key: 'actions', sortable: false },
];

function getAvatarIcon(label: any) {
  const size = 50;
  const circleSize = 50;

  // Générer les initiales à partir du label
  const words = Boolean(label) ? label.split(' ') : ['N', 'A'];
  const initials = words.map((word: any) => word.charAt(0).toUpperCase());

  // Créer un canvas et un contexte 2D
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  // Générer une couleur unique et légère pour l'avatar
  const colorHash = (Boolean(label) ? label.split('') : ['N', 'A']).reduce((acc: number, char: string) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
  const hue = (colorHash % 360);
  const saturation = 80;
  const lightness = 70;
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Dessiner le fond avec la couleur légère
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, circleSize / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Dessiner les initiales en blanc
  ctx.font = `${(circleSize * 0.6)}px Arial`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials.slice(0, 2).join(''), size / 2, size / 2);

  return canvas.toDataURL();
}
</script>