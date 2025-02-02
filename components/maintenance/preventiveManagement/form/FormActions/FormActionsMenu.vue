<template>
  <v-menu v-model="dialog" v-if="variant == 'button' || (isHovering || dialog)">
    <template v-slot:activator="{ props: menu }">
      <v-btn :disabled="disabled" v-if="variant == 'button'" v-bind="menu" variant="outlined" class="custom-button"
        color="primary">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
      <v-hover v-else-if="variant == 'hover-button'" v-slot="{ isHovering, props: hover }">
        <v-btn :disabled="disabled" v-bind="mergeProps(menu, hover)" variant="outlined" class="custom-button">
          <v-icon density="compact" class="icon">mdi-dots-horizontal</v-icon>
        </v-btn>
      </v-hover>
    </template>

    <v-list width="250px" density="compact">
      <v-list-subheader class="pa-4 text-caption" v-if="currentVersion">Edit</v-list-subheader>
      <v-list-item @click="$emit('editElements')" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Inspection Items</span>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('editWorkflows')" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Workflows</span>
          <v-icon>mdi-lightning-bolt-outline</v-icon>
        </v-list-item-title>
      </v-list-item>
      <!-- <v-list-item @click="" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Vehicles & Schedules</span>
          <v-icon>mdi-car</v-icon>
        </v-list-item-title> 
      </v-list-item>-->
      <v-list-item @click="$emit('edit')" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Title And Settings</span>
          <v-icon>mdi-pencil</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-divider class="mx-1"></v-divider>
      <v-list-item @click="$emit('startInspection')" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Start Inspection</span>
          <v-icon>mdi-plus</v-icon>
        </v-list-item-title>
      </v-list-item>
      <!-- <v-list-item @click="$emit('print')">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Print</span>
          <v-icon>mdi-printer</v-icon>
        </v-list-item-title>
      </v-list-item> -->
      <v-list-item @click="$emit('viewVersionDetails')" v-if="!currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Go to Current Version</span>
          <v-icon>mdi-arrow-right</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('copy')" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Make A Copy</span>
          <v-icon>mdi-content-copy</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('viewHistory')">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">View History</span>
          <v-icon>mdi-history</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('archiveForm')" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Archive </span>
          <v-icon>mdi-archive</v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { ref, mergeProps } from 'vue'

const props = defineProps({
  currentVersion: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  isHovering: {
    type: Boolean,
    required: false,
    default: false
  },
  variant: {
    type: String,
    required: false,
    default: 'button'
  }
})

const emit = defineEmits([
  'editElements',
  'editWorkflows',
  'edit',
  'startInspection',
  'print',
  'viewVersionDetails',
  'copy',
  'viewHistory',
  'archiveForm'
]);

const dialog = ref<boolean>(false)

</script>

<style scoped>
.custom-button {
  min-width: 0;
}
</style>