<template>
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>
      <v-card-title>{{ currentGeofenceZone.id ? 'Edit' : 'Create' }} Geofence Zone</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="currentGeofenceZone.zone_name" label="Name" :rules="[required]"></v-text-field>
          <v-textarea v-model="currentGeofenceZone.description" label="Description"></v-textarea>
          <v-text-field v-model.number="currentGeofenceZone.latitude" label="Latitude" type="number"></v-text-field>
          <v-text-field v-model.number="currentGeofenceZone.longitude" label="Longitude" type="number"></v-text-field>
          <v-text-field v-model.number="currentGeofenceZone.radius_meters" label="Radius (meters)" type="number"></v-text-field>
          <!-- A map component could be integrated here to pick coordinates visually -->
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close')">Cancel</v-btn>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import type { GeofenceZone } from '@/types/workforce/attendanceRecord';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  geofenceZone: {
    type: Object as PropType<Partial<GeofenceZone>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentGeofenceZone = ref<Partial<GeofenceZone>>({ ...props.geofenceZone });
const form = ref(null);
const required = (value: any) => !!value || 'Required';

watch(
  () => props.geofenceZone,
  (newZone) => {
    currentGeofenceZone.value = { ...newZone };
  },
  { deep: true }
);

const save = () => {
  emit('save', currentGeofenceZone.value);
};
</script>
